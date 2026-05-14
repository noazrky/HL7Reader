import { detectDelimiters, splitHl7 } from './hl7Parser'
import type { Hl7Delimiters } from './hl7Parser'

export type DeidentificationSummary = {
  names: number
  ids: number
  addresses: number
  phones: number
  dobs: number
}

export type DeidentificationCategory = keyof DeidentificationSummary

export type DeidentificationChange = {
  path: string
  category: DeidentificationCategory
  start: number
  end: number
  value: string
}

export type DeidentificationResult = {
  message: string
  changes: DeidentificationChange[]
  summary: DeidentificationSummary
}

type DateParts = {
  year: number
  month: number
  day: number
}

type FieldTransformKind =
  | 'address'
  | 'birthPlace'
  | 'cx'
  | 'dln'
  | 'dob'
  | 'phone'
  | 'stId'
  | 'xcn'
  | 'xon'
  | 'xpn'

type FieldRule = {
  category: DeidentificationCategory
  kind: FieldTransformKind
}

type MessagePiece = {
  text: string
  ending: string
}

type TransformContext = {
  delimiters: Hl7Delimiters
  messageDate: DateParts
  replacements: Map<string, string>
  summary: DeidentificationSummary
  changes: DeidentificationChange[]
}

type SyntheticName = {
  family: string
  given: string
  middle: string
}

type SyntheticAddress = {
  street: string
  unit: string
  city: string
  state: string
  zip: string
}

const emptySummary: DeidentificationSummary = {
  names: 0,
  ids: 0,
  addresses: 0,
  phones: 0,
  dobs: 0
}

const firstNames = [
  'Maya',
  'Noah',
  'Elena',
  'Caleb',
  'Iris',
  'Owen',
  'Avery',
  'Miles',
  'Nora',
  'Theo'
]

const familyNames = [
  'Garcia',
  'Miller',
  'Patel',
  'Nguyen',
  'Carter',
  'Brooks',
  'Reed',
  'Morgan',
  'Hayes',
  'Bennett'
]

const middleInitials = ['A', 'C', 'D', 'E', 'J', 'K', 'L', 'M', 'R', 'S']

const streetNames = [
  'Cedar Ave',
  'Maple St',
  'Harbor Rd',
  'Pine Way',
  'Summit Dr',
  'River Ln',
  'Market St',
  'Park Ter',
  'Lake View',
  'Hillcrest Rd'
]

const cities = [
  'Riverton',
  'Fairview',
  'Milton',
  'Ashland',
  'Franklin',
  'Clinton',
  'Oakdale',
  'Madison',
  'Georgetown',
  'Bristol'
]

const states = ['MA', 'NC', 'WA', 'IL', 'OH', 'PA', 'MI', 'AZ', 'CO', 'OR']

const targetFieldRules: Record<string, FieldRule> = {
  'PID-2': { category: 'ids', kind: 'cx' },
  'PID-3': { category: 'ids', kind: 'cx' },
  'PID-4': { category: 'ids', kind: 'cx' },
  'PID-5': { category: 'names', kind: 'xpn' },
  'PID-6': { category: 'names', kind: 'xpn' },
  'PID-7': { category: 'dobs', kind: 'dob' },
  'PID-9': { category: 'names', kind: 'xpn' },
  'PID-11': { category: 'addresses', kind: 'address' },
  'PID-13': { category: 'phones', kind: 'phone' },
  'PID-14': { category: 'phones', kind: 'phone' },
  'PID-18': { category: 'ids', kind: 'cx' },
  'PID-19': { category: 'ids', kind: 'stId' },
  'PID-20': { category: 'ids', kind: 'dln' },
  'PID-21': { category: 'ids', kind: 'cx' },
  'PID-23': { category: 'addresses', kind: 'birthPlace' },
  'NK1-2': { category: 'names', kind: 'xpn' },
  'NK1-4': { category: 'addresses', kind: 'address' },
  'NK1-5': { category: 'phones', kind: 'phone' },
  'NK1-6': { category: 'phones', kind: 'phone' },
  'NK1-12': { category: 'ids', kind: 'cx' },
  'NK1-13': { category: 'names', kind: 'xon' },
  'NK1-16': { category: 'dobs', kind: 'dob' },
  'NK1-26': { category: 'names', kind: 'xpn' },
  'GT1-2': { category: 'ids', kind: 'cx' },
  'GT1-3': { category: 'names', kind: 'xpn' },
  'GT1-4': { category: 'names', kind: 'xpn' },
  'GT1-5': { category: 'addresses', kind: 'address' },
  'GT1-6': { category: 'phones', kind: 'phone' },
  'GT1-7': { category: 'phones', kind: 'phone' },
  'GT1-8': { category: 'dobs', kind: 'dob' },
  'IN1-16': { category: 'names', kind: 'xpn' },
  'IN1-18': { category: 'dobs', kind: 'dob' },
  'IN1-19': { category: 'addresses', kind: 'address' },
  'IN1-36': { category: 'ids', kind: 'stId' },
  'IN2-1': { category: 'ids', kind: 'cx' },
  'IN2-2': { category: 'ids', kind: 'stId' },
  'IN2-3': { category: 'names', kind: 'xcn' },
  'IN2-6': { category: 'ids', kind: 'stId' },
  'IN2-7': { category: 'names', kind: 'xpn' },
  'IN2-8': { category: 'ids', kind: 'stId' },
  'IN2-9': { category: 'names', kind: 'xpn' },
  'IN2-10': { category: 'ids', kind: 'stId' },
  'IN2-22': { category: 'names', kind: 'xpn' },
  'IN2-25': { category: 'ids', kind: 'cx' },
  'IN2-26': { category: 'ids', kind: 'cx' },
  'IN2-40': { category: 'names', kind: 'xpn' },
  'IN2-49': { category: 'names', kind: 'xpn' },
  'IN2-50': { category: 'phones', kind: 'phone' },
  'IN2-52': { category: 'names', kind: 'xpn' },
  'IN2-53': { category: 'phones', kind: 'phone' },
  'IN2-61': { category: 'ids', kind: 'cx' },
  'IN2-63': { category: 'phones', kind: 'phone' },
  'IN2-64': { category: 'phones', kind: 'phone' },
  'IN2-69': { category: 'names', kind: 'xon' },
  'IN2-70': { category: 'names', kind: 'xon' }
}

export function deidentifyHl7(message: string): DeidentificationResult {
  const summary = { ...emptySummary }

  if (message.trim().length === 0) {
    return {
      message,
      changes: [],
      summary
    }
  }

  const pieces = splitMessage(message)
  const firstSegment = pieces.find((piece) => piece.text.trim().length > 0)?.text ?? ''
  const delimiters = detectDelimiters(firstSegment)
  const context: TransformContext = {
    delimiters,
    messageDate: detectMessageDate(pieces, delimiters),
    replacements: new Map(),
    summary,
    changes: []
  }
  let output = ''

  for (const piece of pieces) {
    const segmentStart = output.length
    const transformed = transformSegment(piece.text, segmentStart, context)
    output += transformed + piece.ending
  }

  return {
    message: output,
    changes: context.changes,
    summary
  }
}

function splitMessage(message: string): MessagePiece[] {
  const pieces: MessagePiece[] = []
  let index = 0

  while (index < message.length) {
    const nextReturn = message.indexOf('\r', index)
    const nextNewline = message.indexOf('\n', index)
    const candidates = [nextReturn, nextNewline].filter((candidate) => candidate !== -1)
    const lineEnd = candidates.length === 0 ? -1 : Math.min(...candidates)

    if (lineEnd === -1) {
      pieces.push({ text: message.slice(index), ending: '' })
      break
    }

    const isCrLf = message[lineEnd] === '\r' && message[lineEnd + 1] === '\n'
    pieces.push({
      text: message.slice(index, lineEnd),
      ending: isCrLf ? '\r\n' : message[lineEnd]
    })
    index = lineEnd + (isCrLf ? 2 : 1)
  }

  return pieces
}

function detectMessageDate(pieces: MessagePiece[], delimiters: Hl7Delimiters): DateParts {
  const msh = pieces.find((piece) => piece.text.startsWith('MSH'))?.text

  if (!msh) {
    return todayParts()
  }

  const fields = splitHl7(msh, delimiters.field, delimiters.escape)
  return parseDateParts(fields[6]) ?? todayParts()
}

function todayParts(): DateParts {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  }
}

function transformSegment(line: string, startOffset: number, context: TransformContext): string {
  if (line.trim().length === 0) {
    return line
  }

  const parts = splitHl7(line, context.delimiters.field, context.delimiters.escape)
  const segmentId = parts[0] ?? ''

  if (segmentId.length === 0 || segmentId === 'MSH') {
    return line
  }

  let rebuilt = segmentId

  for (let index = 1; index < parts.length; index += 1) {
    const fieldNumber = index
    const path = `${segmentId}-${fieldNumber}`
    const value = parts[index]
    const fieldStart = startOffset + rebuilt.length + context.delimiters.field.length
    const transformed = transformField(path, value, context)

    rebuilt += context.delimiters.field
    if (transformed.value !== value) {
      context.summary[transformed.category] += 1
      context.changes.push({
        path,
        category: transformed.category,
        start: fieldStart,
        end: fieldStart + transformed.value.length,
        value: transformed.value
      })
    }
    rebuilt += transformed.value
  }

  return rebuilt
}

function transformField(
  path: string,
  value: string,
  context: TransformContext
): { value: string; category: DeidentificationCategory } {
  const rule = targetFieldRules[path]

  if (!rule || value.length === 0) {
    return {
      value,
      category: 'ids'
    }
  }

  return {
    value: transformRepetitions(value, rule.kind, context),
    category: rule.category
  }
}

function transformRepetitions(value: string, kind: FieldTransformKind, context: TransformContext): string {
  return splitHl7(value, context.delimiters.repetition, context.delimiters.escape)
    .map((repetition) => transformRepetition(repetition, kind, context))
    .join(context.delimiters.repetition)
}

function transformRepetition(repetition: string, kind: FieldTransformKind, context: TransformContext): string {
  if (repetition.length === 0) {
    return repetition
  }

  if (kind === 'xpn') {
    return transformXpn(repetition, context)
  }

  if (kind === 'xcn') {
    return transformXcn(repetition, context)
  }

  if (kind === 'xon') {
    return transformXon(repetition, context)
  }

  if (kind === 'cx') {
    return transformCx(repetition, context)
  }

  if (kind === 'dln') {
    return transformDln(repetition, context)
  }

  if (kind === 'address') {
    return transformAddress(repetition, context)
  }

  if (kind === 'phone') {
    return transformPhone(repetition, context)
  }

  if (kind === 'dob') {
    return syntheticDob(repetition, context)
  }

  if (kind === 'birthPlace') {
    return replacementFor(context, `birthPlace:${repetition}`, () => syntheticAddress(repetition).city)
  }

  return replacementFor(context, `stId:${repetition}`, () => syntheticId(repetition, 'ID'))
}

function transformXpn(value: string, context: TransformContext): string {
  const name = syntheticName(value)
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `xpn:${value}`, () => {
    if (components.length <= 1) {
      return name.family
    }

    const transformed = [...components]
    transformed[0] = name.family
    transformed[1] = name.given

    if ((transformed[2] ?? '').length > 0) {
      transformed[2] = name.middle
    }

    return transformed.join(context.delimiters.component)
  })
}

function transformXcn(value: string, context: TransformContext): string {
  const name = syntheticName(value)
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `xcn:${value}`, () => {
    if (components.length <= 1) {
      return syntheticId(value, 'XCN')
    }

    const transformed = [...components]
    transformed[0] = transformed[0]?.length > 0 ? syntheticId(transformed[0], 'XCN') : transformed[0]
    transformed[1] = name.family
    transformed[2] = name.given

    if ((transformed[3] ?? '').length > 0) {
      transformed[3] = name.middle
    }

    return transformed.join(context.delimiters.component)
  })
}

function transformXon(value: string, context: TransformContext): string {
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `xon:${value}`, () => {
    const organization = `${pick(familyNames, value, 8)} Test Group`

    if (components.length <= 1) {
      return organization
    }

    const transformed = [...components]
    transformed[0] = organization

    if ((transformed[2] ?? '').length > 0) {
      transformed[2] = syntheticId(transformed[2], 'ORG')
    }

    if ((transformed[9] ?? '').length > 0) {
      transformed[9] = syntheticId(transformed[9], 'ORG')
    }

    return transformed.join(context.delimiters.component)
  })
}

function transformCx(value: string, context: TransformContext): string {
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `cx:${value}`, () => {
    if (components.length <= 1) {
      return syntheticId(value, 'MR')
    }

    const transformed = [...components]
    transformed[0] = syntheticId(components[0] || value, 'MR')

    return transformed.join(context.delimiters.component)
  })
}

function transformDln(value: string, context: TransformContext): string {
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `dln:${value}`, () => {
    if (components.length <= 1) {
      return syntheticId(value, 'DL')
    }

    const transformed = [...components]
    transformed[0] = syntheticId(components[0] || value, 'DL')

    return transformed.join(context.delimiters.component)
  })
}

function transformAddress(value: string, context: TransformContext): string {
  const address = syntheticAddress(value)
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)

  return replacementFor(context, `address:${value}`, () => {
    if (components.length <= 1) {
      return address.street
    }

    const transformed = [...components]
    transformed[0] = address.street
    transformed[1] = (transformed[1] ?? '').length > 0 ? address.unit : transformed[1]
    transformed[2] = address.city
    transformed[3] = address.state
    transformed[4] = address.zip

    return transformed.join(context.delimiters.component)
  })
}

function transformPhone(value: string, context: TransformContext): string {
  const components = splitHl7(value, context.delimiters.component, context.delimiters.escape)
  const phone = syntheticPhone(value)

  return replacementFor(context, `phone:${value}`, () => {
    if (components.length <= 1) {
      return phone
    }

    const transformed = [...components]

    if ((transformed[0] ?? '').length > 0) {
      transformed[0] = phone
    }

    if ((transformed[5] ?? '').length > 0) {
      transformed[5] = phone.slice(4, 7)
    }

    if ((transformed[6] ?? '').length > 0) {
      transformed[6] = phone.slice(8)
    }

    return transformed.join(context.delimiters.component)
  })
}

function syntheticDob(value: string, context: TransformContext): string {
  return replacementFor(context, `dob:${value}:${context.messageDate.year}`, () => {
    const originalDate = parseDateParts(value)
    const messageDate = context.messageDate
    const fallbackAge = 20 + (hashString(value) % 70)
    const originalAge = originalDate ? ageAt(originalDate, messageDate) : fallbackAge
    const syntheticAge = originalAge > 89 || originalAge < 0
      ? fallbackAge
      : clamp(originalAge + ((hashString(value) % 5) - 2), 0, 89)
    const month = 1 + (hashString(`${value}:month`) % 12)
    const day = 1 + (hashString(`${value}:day`) % 28)
    const syntheticYear = messageDate.year - syntheticAge
    const synthetic = `${syntheticYear}${pad2(month)}${pad2(day)}`
    const adjusted = ageAt(parseDateParts(synthetic) ?? messageDate, messageDate) > 89
      ? `${messageDate.year - 89}${pad2(messageDate.month)}${pad2(messageDate.day)}`
      : synthetic

    return value.length > 8 ? `${adjusted}${value.slice(8)}` : adjusted
  })
}

function parseDateParts(value: string | undefined): DateParts | null {
  if (!value || !/^\d{8}/.test(value)) {
    return null
  }

  const year = Number.parseInt(value.slice(0, 4), 10)
  const month = Number.parseInt(value.slice(4, 6), 10)
  const day = Number.parseInt(value.slice(6, 8), 10)

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }

  return { year, month, day }
}

function ageAt(birthDate: DateParts, asOfDate: DateParts): number {
  const hadBirthday =
    asOfDate.month > birthDate.month ||
    (asOfDate.month === birthDate.month && asOfDate.day >= birthDate.day)

  return asOfDate.year - birthDate.year - (hadBirthday ? 0 : 1)
}

function syntheticName(seed: string): SyntheticName {
  return {
    family: pick(familyNames, seed, 1),
    given: pick(firstNames, seed, 2),
    middle: pick(middleInitials, seed, 3)
  }
}

function syntheticAddress(seed: string): SyntheticAddress {
  const streetNumber = 100 + (hashString(seed) % 8900)
  const zip = `${String(10000 + (hashString(`${seed}:zip`) % 89999)).padStart(5, '0')}`

  return {
    street: `${streetNumber} ${pick(streetNames, seed, 4)}`,
    unit: `Suite ${100 + (hashString(`${seed}:unit`) % 800)}`,
    city: pick(cities, seed, 5),
    state: pick(states, seed, 6),
    zip
  }
}

function syntheticPhone(seed: string): string {
  const exchange = 200 + (hashString(`${seed}:exchange`) % 700)
  const line = String(1000 + (hashString(`${seed}:line`) % 9000)).padStart(4, '0')

  return `555-${exchange}-${line}`
}

function syntheticId(seed: string, prefix: string): string {
  const value = String(100000 + (hashString(`${prefix}:${seed}`) % 900000))

  return `${prefix}${value}`
}

function replacementFor(context: TransformContext, key: string, buildValue: () => string): string {
  const existing = context.replacements.get(key)

  if (existing) {
    return existing
  }

  const value = buildValue()
  context.replacements.set(key, value)
  return value
}

function pick(values: string[], seed: string, salt: number): string {
  return values[hashString(`${seed}:${salt}`) % values.length]
}

function hashString(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}
