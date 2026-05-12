import { describe, expect, it } from 'vitest'
import { decodeHl7Escapes, parseHl7 } from '../src/shared/hl7Parser'

describe('parseHl7', () => {
  it('parses a standard ADT message with MSH, EVN, PID, and PV1', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00001|P|2.5',
      'EVN|A01|202405091105',
      'PID|1||123456^^^HOSP^MR||Doe^Jane^A||19800115|F|||123 Main St^^Boston^MA^02118',
      'PV1|1|I|3N^301^A^HOSP'
    ].join('\r'))

    expect(parsed.metadata).toMatchObject({
      messageType: 'ADT',
      triggerEvent: 'A01',
      version: '2.5'
    })
    expect(parsed.segments).toHaveLength(4)
    expect(parsed.segments[0].fields[0]).toMatchObject({
      path: 'MSH-1',
      name: 'Field Separator',
      rawValue: '|'
    })
    expect(parsed.segments[2].fields.find((field) => field.path === 'PID-5')).toMatchObject({
      name: 'Patient Name',
      datatype: 'XPN',
      rawValue: 'Doe^Jane^A'
    })
  })

  it('parses ORU messages with repeated OBX segments', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|LAB|HOSP|EHR|HOSP|202405091105||ORU^R01|MSG00002|P|2.5',
      'PID|1||123456^^^HOSP^MR||Doe^Jane',
      'OBR|1|P123|F456|CBC^Complete blood count^L',
      'OBX|1|NM|718-7^Hemoglobin^LN||13.2|g/dL|12-16|N|||F',
      'OBX|2|NM|789-8^Erythrocytes^LN||4.7|10*6/uL|4.2-5.4|N|||F'
    ].join('\n'))

    const obxSegments = parsed.segments.filter((segment) => segment.id === 'OBX')

    expect(parsed.metadata.messageType).toBe('ORU')
    expect(obxSegments).toHaveLength(2)
    expect(obxSegments[0].fields.find((field) => field.path === 'OBX-3')).toMatchObject({
      name: 'Observation Identifier',
      datatype: 'CE',
      rawValue: '718-7^Hemoglobin^LN'
    })
  })

  it('parses ORM messages with ORC and OBR fields', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|EHR|HOSP|LAB|HOSP|202405091105||ORM^O01|MSG00003|P|2.3',
      'PID|1||123456^^^HOSP^MR||Doe^Jane',
      'ORC|NW|P123|F456|||||||202405091105|||1234^Smith^John',
      'OBR|1|P123|F456|BMP^Basic metabolic panel^L'
    ].join('\r\n'))

    const orc = parsed.segments.find((segment) => segment.id === 'ORC')
    const obr = parsed.segments.find((segment) => segment.id === 'OBR')

    expect(parsed.metadata.messageType).toBe('ORM')
    expect(orc?.fields.find((field) => field.path === 'ORC-1')?.name).toBe('Order Control')
    expect(obr?.fields.find((field) => field.path === 'OBR-4')?.name).toBe('Universal Service Identifier')
  })

  it('reads custom delimiters from MSH', () => {
    const parsed = parseHl7([
      'MSH*%$!?*REG*HOSP*EHR*HOSP*202405091105**ADT%A01*MSG00004*P*2.5',
      'PID*1**123456%%%HOSP%MR**Doe%Jane'
    ].join('\r'))

    expect(parsed.delimiters).toEqual({
      field: '*',
      component: '%',
      repetition: '$',
      escape: '!',
      subcomponent: '?'
    })
    expect(parsed.metadata).toMatchObject({
      messageType: 'ADT',
      triggerEvent: 'A01'
    })
    expect(parsed.segments[1].fields.find((field) => field.path === 'PID-5')?.repetitions[0].components[1]).toMatchObject({
      path: 'PID-5.2',
      name: 'Given Name',
      rawValue: 'Jane'
    })
  })

  it('decodes standard HL7 escape tokens without changing raw parsed values', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|APP|FAC|APP|FAC|202405091105||ORU^R01|MSG00007|P|2.5',
      'NTE|1|L|Line one\\.br\\Line two\\F\\field\\S\\component\\R\\repeat\\T\\sub\\E\\escape'
    ].join('\r'))
    const comment = parsed.segments[1].fields.find((field) => field.path === 'NTE-3')

    expect(comment?.rawValue).toBe(
      'Line one\\.br\\Line two\\F\\field\\S\\component\\R\\repeat\\T\\sub\\E\\escape'
    )
    expect(comment?.repetitions).toHaveLength(1)
    expect(comment?.repetitions[0].components).toHaveLength(1)
    expect(decodeHl7Escapes(comment?.rawValue ?? '', parsed.delimiters)).toBe(
      'Line one\nLine two|field^component~repeat&sub\\escape'
    )
  })

  it('uses active custom delimiters when decoding HL7 escape tokens', () => {
    const parsed = parseHl7([
      'MSH*%$!?*REG*HOSP*EHR*HOSP*202405091105**ADT%A01*MSG00008*P*2.5',
      'NTE*1*L*alpha!F!beta!S!gamma!R!delta!T!epsilon!E!zeta'
    ].join('\r'))
    const comment = parsed.segments[1].fields.find((field) => field.path === 'NTE-3')

    expect(decodeHl7Escapes(comment?.rawValue ?? '', parsed.delimiters)).toBe(
      'alpha*beta%gamma$delta?epsilon!zeta'
    )
  })

  it('does not split fields or components inside unknown escape sequences', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|APP|FAC|APP|FAC|202405091105||ORU^R01|MSG00009|P|2.5',
      'NTE|1|L|alpha\\Z|still note\\^beta|next'
    ].join('\r'))
    const comment = parsed.segments[1].fields.find((field) => field.path === 'NTE-3')

    expect(comment?.rawValue).toBe('alpha\\Z|still note\\^beta')
    expect(comment?.repetitions[0].components).toHaveLength(2)
    expect(comment?.repetitions[0].components[0]?.rawValue).toBe('alpha\\Z|still note\\')
    expect(comment?.repetitions[0].components[1]?.rawValue).toBe('beta')
    expect(decodeHl7Escapes(comment?.rawValue ?? '', parsed.delimiters)).toBe(
      'alpha\\Z|still note\\^beta'
    )
    expect(decodeHl7Escapes('\\X0D\\', parsed.delimiters)).toBe('\\X0D\\')
  })

  it('parses repeated fields, components, and subcomponents', () => {
    const parsed = parseHl7('PID|1||123^^^HOSP&1.2.3&ISO^MR~456^^^CLINIC&9.8.7&ISO^MR||Doe^Jane')
    const pid3 = parsed.segments[0].fields.find((field) => field.path === 'PID-3')

    expect(pid3?.repetitions).toHaveLength(2)
    expect(pid3?.repetitions[0].components[3]).toMatchObject({
      path: 'PID-3.4',
      name: 'Assigning Authority',
      rawValue: 'HOSP&1.2.3&ISO'
    })
    expect(pid3?.repetitions[0].components[3].subcomponents[1]).toMatchObject({
      path: 'PID-3.4.2',
      rawValue: '1.2.3'
    })
    expect(pid3?.repetitions[1].path).toBe('PID-3(2)')
  })

  it('labels unknown Z segments and unknown fields deterministically', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|APP|FAC|APP|FAC|202405091105||ADT^A01|MSG00005|P|2.5',
      'ZXX|one|two^three'
    ].join('\r'))
    const zxx = parsed.segments.find((segment) => segment.id === 'ZXX')

    expect(zxx).toMatchObject({
      id: 'ZXX',
      name: 'Custom Segment'
    })
    expect(zxx?.fields[1]).toMatchObject({
      path: 'ZXX-2',
      name: 'ZXX-2',
      rawValue: 'two^three'
    })
  })

  it('labels PV2, NK1, PR1, ROL, and IN2 fields from the sample ADT message', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|MESA_ADT|XYZ_ADMITTING|iFW|ZYX_HOSPITAL|||ADT^A04|103102|P|2.4||||||||',
      'EVN||200007010800||||200007010800',
      'PID|||583295^^^ADT1||DOE^JANE||19610615|M-||2106-3|123 MAIN STREET^^GREENSBORO^NC^27401-1020|GL|(919)379-1212|(919)271-3434~(919)277-3114||S||PATID12345001^2^M10|123456789|9-87654^NC',
      'NK1|1|BATES^RONALD^L|SPO|||||20011105',
      'PV1||E||||||5101^NELL^FREDERICK^P^^DR|||||||||||V1295^^^ADT1|||||||||||||||||||||||||200007010800||||||||',
      'PV2|||^ABDOMINAL PAIN',
      'OBX|1|HD|SR Instance UID||1.123456.2.2000.31.2.1||||||F||||||',
      'AL1|1||^PENICILLIN||PRODUCES HIVES~RASH',
      'AL1|2||^CAT DANDER',
      'DG1|001|I9|1550|MAL NEO LIVER, PRIMARY|19880501103005|F||',
      'PR1|2234|M11|111^CODE151|COMMON PROCEDURES|198809081123',
      'ROL|45^RECORDER^ROLE MASTER LIST|AD|CP|KATE^SMITH^ELLEN|199505011201',
      'GT1|1122|1519|BILL^GATES^A',
      'IN1|001|A357|1234|BCMD|||||132987',
      'IN2|ID1551001|SSN12345678'
    ].join('\r'))

    const byId = new Map(parsed.segments.map((segment) => [segment.id, segment]))

    expect(byId.get('PV2')).toMatchObject({ name: 'Patient Visit - Additional Information' })
    expect(byId.get('PV2')?.fields.find((field) => field.path === 'PV2-3')).toMatchObject({
      name: 'Admit Reason',
      datatype: 'CE'
    })
    expect(byId.get('NK1')).toMatchObject({ name: 'Next of Kin / Associated Parties' })
    expect(byId.get('NK1')?.fields.find((field) => field.path === 'NK1-8')).toMatchObject({
      name: 'Start Date',
      rawValue: '20011105'
    })
    expect(byId.get('PR1')).toMatchObject({ name: 'Procedures' })
    expect(byId.get('PR1')?.fields.find((field) => field.path === 'PR1-5')).toMatchObject({
      name: 'Procedure Date/Time',
      rawValue: '198809081123'
    })
    expect(byId.get('ROL')).toMatchObject({ name: 'Role' })
    expect(byId.get('ROL')?.fields.find((field) => field.path === 'ROL-4')).toMatchObject({
      name: 'Role Person',
      datatype: 'XCN',
      rawValue: 'KATE^SMITH^ELLEN'
    })
    expect(byId.get('IN2')).toMatchObject({ name: 'Insurance Additional Information' })
    expect(byId.get('IN2')?.fields.find((field) => field.path === 'IN2-2')).toMatchObject({
      name: "Insured's Social Security Number",
      rawValue: 'SSN12345678'
    })
  })

  it('labels standard IN3 fields and identifies nonstandard IN4+ insurance segments', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|APP|FAC|APP|FAC|202405091105||ADT^A04|MSG00006|P|2.4',
      'IN3|1|CERT123|9876^Reviewer^Rita|Y||20240501|20240502',
      'IN4|custom-one|custom-two'
    ].join('\r'))

    const in3 = parsed.segments.find((segment) => segment.id === 'IN3')
    const in4 = parsed.segments.find((segment) => segment.id === 'IN4')

    expect(in3).toMatchObject({
      id: 'IN3',
      name: 'Insurance Additional Information, Certification'
    })
    expect(in3?.fields.find((field) => field.path === 'IN3-2')).toMatchObject({
      name: 'Certification Number',
      datatype: 'CX',
      rawValue: 'CERT123'
    })
    expect(in3?.fields.find((field) => field.path === 'IN3-3')).toMatchObject({
      name: 'Certified By',
      datatype: 'XCN',
      rawValue: '9876^Reviewer^Rita'
    })
    expect(in4).toMatchObject({
      id: 'IN4',
      name: 'Insurance Segment (Non-standard)'
    })
    expect(in4?.fields[1]).toMatchObject({
      path: 'IN4-2',
      name: 'IN4-2',
      rawValue: 'custom-two'
    })
  })

  it('labels complete HL7 v2.4 order entry, diet, supply, and pharmacy/treatment specs', () => {
    const makeSegment = (
      id: string,
      fieldCount: number,
      values: Record<number, string>
    ): string => {
      const fields = Array.from({ length: fieldCount }, (_, index) => values[index + 1] ?? '')
      return `${id}|${fields.join('|')}`
    }

    const parsed = parseHl7([
      'MSH|^~\\&|ORDERS|HOSP|EHR|HOSP|202405091105||ORM^O01|MSG00012|P|2.4',
      makeSegment('ORC', 25, { 1: 'NW', 25: 'MOD^Order modifier^L' }),
      makeSegment('BLG', 3, { 1: 'CH', 3: 'ACCT123' }),
      makeSegment('OBR', 47, { 4: 'TEST^Test order^L', 47: 'FILL^Filler supplemental^L' }),
      makeSegment('ODS', 4, { 3: 'DIET^Diet order^L' }),
      makeSegment('ODT', 3, { 3: 'Tray instruction' }),
      makeSegment('RQD', 10, { 10: '20240510' }),
      makeSegment('RQ1', 7, { 7: 'Y' }),
      makeSegment('RXO', 24, { 24: 'SUP^Supplementary^L' }),
      makeSegment('RXR', 5, { 5: 'ROUTE^Routing instruction^L' }),
      makeSegment('RXC', 7, { 7: 'SUP^Supplementary^L' }),
      makeSegment('RXE', 31, { 31: 'SUP^Supplementary^L' }),
      makeSegment('RXD', 27, { 27: 'PACK^Packaging location^L' }),
      makeSegment('RXG', 22, { 22: 'IND^Indication^L' }),
      makeSegment('RXA', 22, { 22: '202405091106' })
    ].join('\r'))

    const byId = new Map(parsed.segments.map((segment) => [segment.id, segment]))

    expect(byId.get('BLG')).toMatchObject({ name: 'Billing' })
    expect(byId.get('ORC')?.fields.find((field) => field.path === 'ORC-25')).toMatchObject({
      name: 'Order Status Modifier',
      datatype: 'CWE'
    })
    expect(byId.get('OBR')?.fields.find((field) => field.path === 'OBR-47')).toMatchObject({
      name: 'Filler Supplemental Service Information',
      datatype: 'CE'
    })
    expect(byId.get('ODS')?.fields.find((field) => field.path === 'ODS-3')).toMatchObject({
      name: 'Diet, Supplement, or Preference Code',
      datatype: 'CE'
    })
    expect(byId.get('RQD')?.fields.find((field) => field.path === 'RQD-10')).toMatchObject({
      name: 'Date Needed',
      datatype: 'DT'
    })
    expect(byId.get('RXO')?.fields.find((field) => field.path === 'RXO-24')).toMatchObject({
      name: 'Supplementary Code',
      datatype: 'CE'
    })
    expect(byId.get('RXE')?.fields.find((field) => field.path === 'RXE-31')).toMatchObject({
      name: 'Supplementary Code',
      datatype: 'CE'
    })
    expect(byId.get('RXD')?.fields.find((field) => field.path === 'RXD-27')).toMatchObject({
      name: 'Packaging/Assembly Location',
      datatype: 'CE'
    })
    expect(byId.get('RXG')?.fields.find((field) => field.path === 'RXG-22')).toMatchObject({
      name: 'Indication',
      datatype: 'CE'
    })
    expect(byId.get('RXA')?.fields.find((field) => field.path === 'RXA-22')).toMatchObject({
      name: 'System Entry Date/Time',
      datatype: 'TS'
    })
  })

  it('labels HL7 v2.4 scheduling notification messages and resource segments', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|SCHED|CLINIC|EHR|CLINIC|202405091105||SIU^S12|MSG00010|P|2.4',
      'SCH|APT123|FILL456|1|GRP789|CARD^Cardiology^L|BOOK^Booked^L|CHECKUP^Checkup^L|ROUTINE^Routine^L|30|min^Minutes^ISO|1^once^^202405101000^202405101030',
      'PID|1||123456^^^CLINIC^MR||Doe^Jane',
      'RGS|1|A|ROOMS^Rooms^L',
      'AIS|1|A|99213^Office visit^CPT|202405101000|||30|min^Minutes^ISO||BOOKED^Booked^L|FASTING^Fasting^L',
      'AIG|1|A|EKG^ECG Machine^L|DEVICE^Device^L|CARD^Cardiology^L|1|each^Each^L|202405101000|||30|min^Minutes^ISO||BOOKED^Booked^L',
      'AIL|1|A|CARD^101^A^CLINIC|ROOM^Room^L|CARD^Cardiology^L|202405101000|||30|min^Minutes^ISO||BOOKED^Booked^L',
      'AIP|1|A|5555^Smith^Sam|PROV^Provider^L|CARD^Cardiology^L|202405101000|||30|min^Minutes^ISO||BOOKED^Booked^L'
    ].join('\r'))

    const byId = new Map(parsed.segments.map((segment) => [segment.id, segment]))

    expect(parsed.metadata).toMatchObject({
      messageType: 'SIU',
      triggerEvent: 'S12',
      version: '2.4'
    })
    expect(byId.get('SCH')).toMatchObject({ name: 'Schedule Activity Information' })
    expect(byId.get('SCH')?.fields.find((field) => field.path === 'SCH-11')).toMatchObject({
      name: 'Appointment Timing Quantity',
      datatype: 'TQ'
    })
    expect(byId.get('RGS')).toMatchObject({ name: 'Resource Group' })
    expect(byId.get('AIS')?.fields.find((field) => field.path === 'AIS-3')).toMatchObject({
      name: 'Universal Service Identifier',
      datatype: 'CE'
    })
    expect(byId.get('AIG')?.fields.find((field) => field.path === 'AIG-4')).toMatchObject({
      name: 'Resource Type',
      datatype: 'CE'
    })
    expect(byId.get('AIL')?.fields.find((field) => field.path === 'AIL-3')).toMatchObject({
      name: 'Location Resource ID',
      datatype: 'PL'
    })
    expect(byId.get('AIP')?.fields.find((field) => field.path === 'AIP-3')).toMatchObject({
      name: 'Personnel Resource ID',
      datatype: 'XCN'
    })
  })

  it('labels HL7 v2.4 scheduling placer request messages and appointment preferences', () => {
    const parsed = parseHl7([
      'MSH|^~\\&|PLACER|CLINIC|FILLER|CLINIC|202405091105||SRM^S01|MSG00011|P|2.4',
      'ARQ|APT123||1|GRP789|CARD^Cardiology^L|NEW^New request^L|CHECKUP^Checkup^L|ROUTINE^Routine^L|30|min^Minutes^ISO|202405101000^202405101030|A|Q1D|2|5555^Jones^Pat|5551231212',
      'PID|1||123456^^^CLINIC^MR||Doe^Jane',
      'APR|AM^Morning^L|PROV^Preferred provider^L|CARD^Cardiology^L|15|OPEN^Open slot^L'
    ].join('\r'))

    const arq = parsed.segments.find((segment) => segment.id === 'ARQ')
    const apr = parsed.segments.find((segment) => segment.id === 'APR')

    expect(parsed.metadata).toMatchObject({
      messageType: 'SRM',
      triggerEvent: 'S01'
    })
    expect(arq).toMatchObject({ name: 'Appointment Request' })
    expect(arq?.fields.find((field) => field.path === 'ARQ-11')).toMatchObject({
      name: 'Requested Start Date/Time Range',
      datatype: 'DR'
    })
    expect(arq?.fields.find((field) => field.path === 'ARQ-13')).toMatchObject({
      name: 'Repeating Interval',
      datatype: 'RI'
    })
    expect(apr).toMatchObject({ name: 'Appointment Preferences' })
    expect(apr?.fields.find((field) => field.path === 'APR-1')).toMatchObject({
      name: 'Time Selection Criteria',
      datatype: 'SCV'
    })
  })

  it('labels additional composite datatype components used by known segments', () => {
    const makeSegment = (
      id: string,
      fieldCount: number,
      values: Record<number, string>
    ): string => {
      const fields = Array.from({ length: fieldCount }, (_, index) => values[index + 1] ?? '')
      return `${id}|${fields.join('|')}`
    }

    const parsed = parseHl7([
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01^ADT_A01|MSG00013|P^T|2.4^USA^HL70471',
      makeSegment('PID', 20, {
        3: '123456^^^HOSP^MR',
        5: 'Doe^Jane^A',
        20: 'A1234567^MA^20280509'
      }),
      makeSegment('NK1', 11, {
        2: 'Smith^Sam',
        3: 'SPO',
        11: 'Analyst^IT^Interface analyst'
      }),
      makeSegment('PV1', 20, {
        2: 'I',
        3: '3N^301^A^HOSP',
        7: '1234^Smith^John',
        19: 'V12345',
        20: 'PPO^20240509'
      }),
      makeSegment('ORC', 8, {
        1: 'NW',
        2: 'P123',
        3: 'F456',
        8: 'PARENT1^PARENT2'
      }),
      makeSegment('OBR', 9, {
        1: '1',
        2: 'P123',
        3: 'F456',
        4: 'CBC^Complete blood count^L',
        9: '10^mL'
      }),
      makeSegment('IN1', 4, {
        1: '1',
        2: 'PLAN^Plan name^L',
        3: '12345^INSCO^ISO',
        4: 'Acme Insurance^L^999^7^M11^AUTH^XX^FAC^A^ORGID'
      })
    ].join('\r'))

    const getComponents = (path: string) => {
      const field = parsed.segments
        .flatMap((segment) => segment.fields)
        .find((candidate) => candidate.path === path)

      return field?.repetitions[0]?.components ?? []
    }

    expect(getComponents('MSH-9').map((component) => component.name)).toEqual([
      'Message Code',
      'Trigger Event',
      'Message Structure'
    ])
    expect(getComponents('MSH-11').map((component) => component.name)).toEqual([
      'Processing ID',
      'Processing Mode'
    ])
    expect(getComponents('MSH-12').map((component) => component.name)).toEqual([
      'Version ID',
      'Internationalization Code',
      'International Version ID'
    ])
    expect(getComponents('IN1-4').slice(0, 4).map((component) => component.name)).toEqual([
      'Organization Name',
      'Organization Name Type Code',
      'ID Number',
      'Check Digit'
    ])
    expect(getComponents('OBR-9').map((component) => component.name)).toEqual([
      'Quantity',
      'Units'
    ])
    expect(getComponents('PID-20').map((component) => component.name)).toEqual([
      'License Number',
      'Issuing State, Province, Country',
      'Expiration Date'
    ])
    expect(getComponents('NK1-11').map((component) => component.name)).toEqual([
      'Job Code',
      'Job Class',
      'Job Description Text'
    ])
    expect(getComponents('PV1-20').map((component) => component.name)).toEqual([
      'Financial Class Code',
      'Effective Date'
    ])
    expect(getComponents('ORC-8').map((component) => component.name)).toEqual([
      'Composite Component 1',
      'Composite Component 2'
    ])
  })

  it('returns an empty parse for blank input', () => {
    const parsed = parseHl7('   \r\n  ')

    expect(parsed.segments).toEqual([])
    expect(parsed.warnings).toEqual([])
  })

  it('warns and still parses malformed input without a valid MSH', () => {
    const parsed = parseHl7('PID|1||123456^^^HOSP^MR||Doe^Jane')

    expect(parsed.warnings[0]).toContain('No valid MSH segment')
    expect(parsed.segments[0]).toMatchObject({
      id: 'PID',
      name: 'Patient Identification'
    })
  })
})
