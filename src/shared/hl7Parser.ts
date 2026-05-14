import {
  getComponentName,
  getFieldDefinition,
  getSegmentDefinition
} from './hl7Dictionaries'

export type Hl7Delimiters = {
  field: string
  component: string
  repetition: string
  escape: string
  subcomponent: string
}

export type ParsedSubcomponent = {
  path: string
  name: string
  rawValue: string
}

export type ParsedComponent = {
  path: string
  name: string
  rawValue: string
  subcomponents: ParsedSubcomponent[]
}

export type ParsedRepetition = {
  path: string
  rawValue: string
  components: ParsedComponent[]
}

export type ParsedField = {
  path: string
  name: string
  datatype?: string
  rawValue: string
  repetitions: ParsedRepetition[]
}

export type ParsedSegment = {
  id: string
  name: string
  index: number
  rawValue: string
  fields: ParsedField[]
}

export type ParsedMessageMetadata = {
  messageType?: string
  triggerEvent?: string
  messageStructure?: string
  version?: string
}

export type ParsedMessage = {
  delimiters: Hl7Delimiters
  metadata: ParsedMessageMetadata
  warnings: string[]
  segments: ParsedSegment[]
}

export const defaultDelimiters: Hl7Delimiters = {
  field: '|',
  component: '^',
  repetition: '~',
  escape: '\\',
  subcomponent: '&'
}

export function parseHl7(message: string): ParsedMessage {
  const warnings: string[] = []
  const lines = normalizeSegments(message)

  if (lines.length === 0) {
    return {
      delimiters: defaultDelimiters,
      metadata: {},
      warnings,
      segments: []
    }
  }

  const delimiters = detectDelimiters(lines[0], warnings)
  const segments = lines.map((line, index) => parseSegment(line, index + 1, delimiters, warnings))
  const metadata = extractMetadata(segments)

  return {
    delimiters,
    metadata,
    warnings,
    segments
  }
}

export function decodeHl7Escapes(value: string, delimiters: Hl7Delimiters): string {
  if (value.length === 0) {
    return value
  }

  const escape = delimiters.escape
  let decoded = ''
  let index = 0

  while (index < value.length) {
    if (value[index] !== escape) {
      decoded += value[index]
      index += 1
      continue
    }

    const endIndex = value.indexOf(escape, index + 1)

    if (endIndex === -1) {
      decoded += value[index]
      index += 1
      continue
    }

    const token = value.slice(index + 1, endIndex)
    decoded += decodeEscapeToken(token, delimiters)
    index = endIndex + 1
  }

  return decoded
}

function normalizeSegments(message: string): string[] {
  return message
    .replace(/\r\n/g, '\r')
    .replace(/\n/g, '\r')
    .split('\r')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
}

export function detectDelimiters(firstLine: string, warnings?: string[]): Hl7Delimiters {
  if (!firstLine.startsWith('MSH') || firstLine.length < 8) {
    warnings?.push('No valid MSH segment found. Default HL7 delimiters were used.')
    return defaultDelimiters
  }

  const field = firstLine.charAt(3)
  const encodingCharacters = firstLine.slice(4, 8)

  return {
    field: field || defaultDelimiters.field,
    component: encodingCharacters.charAt(0) || defaultDelimiters.component,
    repetition: encodingCharacters.charAt(1) || defaultDelimiters.repetition,
    escape: encodingCharacters.charAt(2) || defaultDelimiters.escape,
    subcomponent: encodingCharacters.charAt(3) || defaultDelimiters.subcomponent
  }
}

function parseSegment(
  line: string,
  index: number,
  delimiters: Hl7Delimiters,
  warnings: string[]
): ParsedSegment {
  const parts = splitHl7(line, delimiters.field, delimiters.escape)
  const id = parts[0] || `SEG${index}`
  const segmentDefinition = getSegmentDefinition(id)

  if (id.length !== 3) {
    warnings.push(`Segment ${index} has an unexpected identifier: ${id}`)
  }

  return {
    id,
    name: segmentDefinition.name,
    index,
    rawValue: line,
    fields: parseFields(id, parts.slice(1), delimiters)
  }
}

function parseFields(segmentId: string, rawFields: string[], delimiters: Hl7Delimiters): ParsedField[] {
  if (segmentId === 'MSH') {
    return [
      buildField(segmentId, 1, delimiters.field, delimiters),
      buildField(segmentId, 2, rawFields[0] ?? '', delimiters),
      ...rawFields.slice(1).map((value, index) => buildField(segmentId, index + 3, value, delimiters))
    ]
  }

  return rawFields.map((value, index) => buildField(segmentId, index + 1, value, delimiters))
}

function buildField(
  segmentId: string,
  position: number,
  rawValue: string,
  delimiters: Hl7Delimiters
): ParsedField {
  const definition = getFieldDefinition(segmentId, position)
  const path = `${segmentId}-${position}`
  const shouldParseNestedValues = !(segmentId === 'MSH' && position === 2)

  return {
    path,
    name: definition.name,
    datatype: definition.datatype,
    rawValue,
    repetitions: shouldParseNestedValues
      ? parseRepetitions(path, rawValue, definition.datatype, delimiters)
      : []
  }
}

function parseRepetitions(
  fieldPath: string,
  rawValue: string,
  datatype: string | undefined,
  delimiters: Hl7Delimiters
): ParsedRepetition[] {
  if (rawValue.length === 0) {
    return []
  }

  return splitHl7(rawValue, delimiters.repetition, delimiters.escape).map((repetitionValue, repetitionIndex) => {
    const repetitionPath =
      repetitionIndex === 0 ? fieldPath : `${fieldPath}(${repetitionIndex + 1})`

    return {
      path: repetitionPath,
      rawValue: repetitionValue,
      components: parseComponents(repetitionPath, repetitionValue, datatype, delimiters)
    }
  })
}

function parseComponents(
  repetitionPath: string,
  rawValue: string,
  datatype: string | undefined,
  delimiters: Hl7Delimiters
): ParsedComponent[] {
  return splitHl7(rawValue, delimiters.component, delimiters.escape).map((componentValue, index) => {
    const position = index + 1
    const path = `${repetitionPath}.${position}`

    return {
      path,
      name: getComponentName(datatype, position),
      rawValue: componentValue,
      subcomponents: parseSubcomponents(path, componentValue, delimiters)
    }
  })
}

function parseSubcomponents(
  componentPath: string,
  rawValue: string,
  delimiters: Hl7Delimiters
): ParsedSubcomponent[] {
  const subcomponents = splitHl7(rawValue, delimiters.subcomponent, delimiters.escape)

  if (subcomponents.length <= 1) {
    return []
  }

  return subcomponents.map((subcomponentValue, index) => {
    const position = index + 1

    return {
      path: `${componentPath}.${position}`,
      name: `Subcomponent ${position}`,
      rawValue: subcomponentValue
    }
  })
}

export function splitHl7(value: string, separator: string, escape: string): string[] {
  const parts: string[] = []
  let partStart = 0
  let index = 0

  while (index < value.length) {
    if (value[index] === escape) {
      const escapeEnd = value.indexOf(escape, index + 1)

      if (escapeEnd === -1) {
        index += 1
        continue
      }

      index = escapeEnd + 1
      continue
    }

    if (value[index] === separator) {
      parts.push(value.slice(partStart, index))
      partStart = index + 1
    }

    index += 1
  }

  parts.push(value.slice(partStart))
  return parts
}

function decodeEscapeToken(token: string, delimiters: Hl7Delimiters): string {
  if (token === 'F') {
    return delimiters.field
  }

  if (token === 'S') {
    return delimiters.component
  }

  if (token === 'R') {
    return delimiters.repetition
  }

  if (token === 'T') {
    return delimiters.subcomponent
  }

  if (token === 'E') {
    return delimiters.escape
  }

  if (token === '.br') {
    return '\n'
  }

  return `${delimiters.escape}${token}${delimiters.escape}`
}

function extractMetadata(segments: ParsedSegment[]): ParsedMessageMetadata {
  const msh = segments.find((segment) => segment.id === 'MSH')

  if (!msh) {
    return {}
  }

  const messageTypeField = msh.fields.find((field) => field.path === 'MSH-9')
  const version = msh.fields.find((field) => field.path === 'MSH-12')?.rawValue
  const messageTypeParts = messageTypeField?.repetitions[0]?.components ?? []

  return {
    messageType: messageTypeParts[0]?.rawValue || messageTypeField?.rawValue || undefined,
    triggerEvent: messageTypeParts[1]?.rawValue || undefined,
    messageStructure: messageTypeParts[2]?.rawValue || undefined,
    version: version || undefined
  }
}
