import { describe, expect, it } from 'vitest'
import { deidentifyHl7 } from '../src/shared/hl7Deidentifier'
import { parseHl7 } from '../src/shared/hl7Parser'

function fieldValue(message: string, path: string): string | undefined {
  return parseHl7(message)
    .segments
    .flatMap((segment) => segment.fields)
    .find((field) => field.path === path)
    ?.rawValue
}

function fieldValues(message: string): Map<string, string> {
  return new Map(
    parseHl7(message)
      .segments
      .flatMap((segment) => segment.fields)
      .map((field) => [field.path, field.rawValue])
  )
}

function ageAt(dob: string, asOf: string): number {
  const birthYear = Number.parseInt(dob.slice(0, 4), 10)
  const birthMonth = Number.parseInt(dob.slice(4, 6), 10)
  const birthDay = Number.parseInt(dob.slice(6, 8), 10)
  const asOfYear = Number.parseInt(asOf.slice(0, 4), 10)
  const asOfMonth = Number.parseInt(asOf.slice(4, 6), 10)
  const asOfDay = Number.parseInt(asOf.slice(6, 8), 10)
  const hadBirthday =
    asOfMonth > birthMonth || (asOfMonth === birthMonth && asOfDay >= birthDay)

  return asOfYear - birthYear - (hadBirthday ? 0 : 1)
}

describe('deidentifyHl7', () => {
  it('replaces structured patient identifiers with synthetic local values and keeps output parseable', () => {
    const message = [
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00001|P|2.5',
      'PID|1||123456^^^HOSP^MR~123456^^^CLINIC^MR|ALT999^^^HOSP^MR|Doe^Jane^A||19800115|F|Alias^Janey|2106-3|123 Main St^^Boston^MA^02118||555-0100|555-0199|||PATID12345001^2^M10|123-45-6789|D1234567^MA^20280509|MOM123^^^HOSP^MR||Boston',
      'PV1|1|I|3N^301^A^HOSP||||1234^Smith^John|||MED|||||||1234^Smith^John||V12345',
      'OBX|1|TX|NOTE^Note^L||Patient Doe Jane lives at 123 Main St||||||F',
      'ZPI|Doe^Jane|123456'
    ].join('\r')

    const result = deidentifyHl7(message)
    const values = fieldValues(result.message)

    expect(parseHl7(result.message).segments).toHaveLength(5)
    expect(values.get('PID-3')).not.toBe('123456^^^HOSP^MR~123456^^^CLINIC^MR')
    expect(values.get('PID-4')).not.toBe('ALT999^^^HOSP^MR')
    expect(values.get('PID-5')).not.toBe('Doe^Jane^A')
    expect(values.get('PID-7')).not.toBe('19800115')
    expect(values.get('PID-11')).not.toBe('123 Main St^^Boston^MA^02118')
    expect(values.get('PID-13')).not.toBe('555-0100')
    expect(values.get('PID-14')).not.toBe('555-0199')
    expect(values.get('PID-18')).not.toBe('PATID12345001^2^M10')
    expect(values.get('PID-19')).not.toBe('123-45-6789')
    expect(values.get('PID-20')).not.toBe('D1234567^MA^20280509')
    expect(values.get('PID-21')).not.toBe('MOM123^^^HOSP^MR')
    expect(values.get('PID-23')).not.toBe('Boston')
    expect(values.get('PV1-7')).toBe('1234^Smith^John')
    expect(values.get('PV1-19')).toBe('V12345')
    expect(values.get('OBX-5')).toBe('Patient Doe Jane lives at 123 Main St')
    expect(values.get('ZPI-1')).toBe('Doe^Jane')
    expect(values.get('ZPI-2')).toBe('123456')
    expect(result.summary.names).toBeGreaterThan(0)
    expect(result.summary.ids).toBeGreaterThan(0)
    expect(result.summary.addresses).toBeGreaterThan(0)
    expect(result.summary.phones).toBeGreaterThan(0)
    expect(result.summary.dobs).toBeGreaterThan(0)
    expect(result.changes.every((change) => change.start < change.end)).toBe(true)
    expect(result.changes.map((change) => change.path)).toEqual(
      expect.arrayContaining(['PID-3', 'PID-5', 'PID-7', 'PID-11', 'PID-13'])
    )
  })

  it('replaces related-person and insured structured fields without changing provider fields', () => {
    const message = [
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A04|MSG00002|P|2.5',
      'PID|1||123456^^^HOSP^MR||Doe^Jane',
      'NK1|1|Bates^Ronald^L|SPO|456 Oak St^^Salem^MA^01970|555-1111|555-2222||||||NKEMP123^^^HOSP^EI',
      'GT1|1|G123^^^HOSP^GN|Gates^Bill^A|Gates^Melinda|1 Lake Rd^^Medina^WA^98039|555-3333|555-4444|19551028',
      'IN1|1|PLAN^Plan^L|INS123^ACME^ISO|Acme Insurance|1 Payor Way^^Boston^MA^02110|Payor^Pat|555-5555|GROUP123|Group Name|||||||Doe^Jane|SEL|19800115|123 Main St^^Boston^MA^02118|||||||||||||||||POLICY123',
      'IN2|EMP123|999-88-7777|Employer^Ellen|DATA||MEDICARE123|Medicaid^Mary|MCAID123|Sponsor^Sam|MIL123||||||||||||Approval^Ann||||SUB123||||||||||||||Maiden^Mabel||||||||Contact^Carl|555-6666||Insured^Ivy|555-7777||||||||MEMBER123||555-8888|555-9999',
      'ROL|1|AD|CP|1234^Provider^Pat|20240509||||||22 Provider Rd^^Boston^MA^02110|555-0000'
    ].join('\r')

    const result = deidentifyHl7(message)
    const values = fieldValues(result.message)

    expect(values.get('NK1-2')).not.toBe('Bates^Ronald^L')
    expect(values.get('NK1-4')).not.toBe('456 Oak St^^Salem^MA^01970')
    expect(values.get('NK1-5')).not.toBe('555-1111')
    expect(values.get('GT1-3')).not.toBe('Gates^Bill^A')
    expect(values.get('GT1-5')).not.toBe('1 Lake Rd^^Medina^WA^98039')
    expect(values.get('IN1-16')).not.toBe('Doe^Jane')
    expect(values.get('IN1-18')).not.toBe('19800115')
    expect(values.get('IN1-19')).not.toBe('123 Main St^^Boston^MA^02118')
    expect(values.get('IN1-36')).not.toBe('POLICY123')
    expect(values.get('IN2-2')).not.toBe('999-88-7777')
    expect(values.get('IN2-7')).not.toBe('Medicaid^Mary')
    expect(values.get('IN2-61')).not.toBe('MEMBER123')
    expect(values.get('ROL-4')).toBe('1234^Provider^Pat')
    expect(values.get('ROL-11')).toBe('22 Provider Rd^^Boston^MA^02110')
    expect(values.get('ROL-12')).toBe('555-0000')
  })

  it('uses custom delimiters and keeps repeated identifiers consistently synthetic per message', () => {
    const message = [
      'MSH*%$!?*REG*HOSP*EHR*HOSP*202405091105**ADT%A01*MSG00003*P*2.5',
      'PID*1**123456%%%HOSP%MR$123456%%%CLINIC%MR**Doe%Jane',
      'NK1*1*Doe%Jane*SPO*123 Main St%%Boston%MA%02118*555-0100'
    ].join('\r')

    const result = deidentifyHl7(message)
    const parsed = parseHl7(result.message)
    const pid3 = fieldValue(result.message, 'PID-3')
    const pid5 = fieldValue(result.message, 'PID-5')
    const nk12 = fieldValue(result.message, 'NK1-2')

    expect(parsed.delimiters).toEqual({
      field: '*',
      component: '%',
      repetition: '$',
      escape: '!',
      subcomponent: '?'
    })
    expect(pid3).not.toContain('|')
    expect(pid3).toContain('$')
    expect(pid5).toBe(nk12)
  })

  it('preserves approximate age for normal DOBs and caps synthetic DOBs at age 89', () => {
    const under90 = deidentifyHl7([
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00004|P|2.5',
      'PID|1||123456^^^HOSP^MR||Doe^Jane||19800115'
    ].join('\r'))
    const over89 = deidentifyHl7([
      'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00005|P|2.5',
      'PID|1||123456^^^HOSP^MR||Doe^Jane||19200115'
    ].join('\r'))
    const under90Dob = fieldValue(under90.message, 'PID-7') ?? ''
    const over89Dob = fieldValue(over89.message, 'PID-7') ?? ''

    expect(under90Dob).toMatch(/^\d{8}$/)
    expect(ageAt(under90Dob, '20240509')).toBeGreaterThanOrEqual(39)
    expect(ageAt(under90Dob, '20240509')).toBeLessThanOrEqual(49)
    expect(over89Dob).toMatch(/^\d{8}$/)
    expect(ageAt(over89Dob, '20240509')).toBeLessThanOrEqual(89)
  })

  it('returns an empty result for blank input', () => {
    const result = deidentifyHl7('  \r\n ')

    expect(result.message).toBe('  \r\n ')
    expect(result.changes).toEqual([])
    expect(result.summary).toEqual({
      names: 0,
      ids: 0,
      addresses: 0,
      phones: 0,
      dobs: 0
    })
  })
})
