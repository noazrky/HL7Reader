import { invoke } from '@tauri-apps/api/core'
import {
  decodeHl7Escapes,
  parseHl7,
  type ParsedComponent,
  type ParsedField,
  type ParsedMessage,
  type ParsedRepetition,
  type ParsedSegment
} from '@shared/hl7Parser'
import { appIconSvg } from '@shared/appIcon'
import './styles/styles.css'

const sampleMessage = [
  'MSH|^~\\&|REG|HOSP|EHR|HOSP|202405091105||ADT^A01|MSG00001|P|2.5',
  'EVN|A01|202405091105',
  'PID|1||123456^^^HOSP^MR||Doe^Jane^A||19800115|F|||123 Main St^^Boston^MA^02118||555-0100',
  'PV1|1|I|3N^301^A^HOSP||||1234^Smith^John|||MED|||||||1234^Smith^John||V12345',
  'OBX|1|NM|8480-6^Systolic blood pressure^LN||120|mmHg|90-120|N|||F'
].join('\r')

type RendererState = {
  parsed: ParsedMessage
  showEmptyFields: boolean
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing app root')
}

app.innerHTML = `
  <section class="shell">
    <header class="topbar">
      <div class="brand-block">
        <h1><span class="app-mark" aria-hidden="true">${appIconSvg}</span>HL7 Reader</h1>
        <p>Local HL7 v2 message inspection</p>
      </div>
      <div class="topbar-actions">
        <label class="toggle">
          <input id="show-empty" type="checkbox" />
          <span>Show empty fields</span>
        </label>
        <button class="icon-button" id="menu-toggle" type="button" aria-label="Toggle menu bar" title="Toggle menu bar">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <main class="workspace">
      <section class="input-panel" aria-label="HL7 message input">
        <div class="panel-heading">
          <div>
            <h2>Message</h2>
            <p id="message-summary">Waiting for pasted content</p>
          </div>
        </div>
        <textarea id="message-input" spellcheck="false"></textarea>
      </section>

      <section class="results-panel" aria-label="Parsed HL7 output">
        <div class="panel-heading results-heading">
          <div>
            <h2>Parsed structure</h2>
            <p id="parse-summary">Paste a message to begin</p>
          </div>
        </div>
        <section class="warnings" id="warnings"></section>
        <section class="tree" id="tree"></section>
      </section>
    </main>
  </section>
`

const input = document.querySelector<HTMLTextAreaElement>('#message-input')
const showEmpty = document.querySelector<HTMLInputElement>('#show-empty')
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')
const messageSummary = document.querySelector<HTMLElement>('#message-summary')
const parseSummary = document.querySelector<HTMLElement>('#parse-summary')
const warnings = document.querySelector<HTMLElement>('#warnings')
const tree = document.querySelector<HTMLElement>('#tree')

if (!input || !showEmpty || !menuToggle || !messageSummary || !parseSummary || !warnings || !tree) {
  throw new Error('Missing renderer elements')
}

const elements = {
  input,
  showEmpty,
  menuToggle,
  messageSummary,
  parseSummary,
  warnings,
  tree
}

const state: RendererState = {
  parsed: parseHl7(''),
  showEmptyFields: false
}

elements.input.placeholder = sampleMessage

elements.input.addEventListener('input', () => {
  state.parsed = parseHl7(elements.input.value)
  render()
})

elements.showEmpty.addEventListener('change', () => {
  state.showEmptyFields = elements.showEmpty.checked
  render()
})

elements.menuToggle.addEventListener('click', () => {
  void invoke('toggle_menu')
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'F1') {
    event.preventDefault()
    void invoke('show_about')
    return
  }

  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
    event.preventDefault()
    void invoke('toggle_menu')
  }
})

render()

function render(): void {
  renderSummaries(state.parsed)
  renderWarnings(state.parsed)
  renderTree(state.parsed)
}

function renderSummaries(parsed: ParsedMessage): void {
  const rawMessage = elements.input.value.trim()
  const lineCount = rawMessage.length === 0 ? 0 : rawMessage.split(/\r\n|\r|\n/).filter((line) => line.trim().length > 0).length
  const segmentCount = parsed.segments.length

  elements.messageSummary.textContent = lineCount === 0
    ? 'Waiting for pasted content'
    : `${lineCount} message ${lineCount === 1 ? 'line' : 'lines'}`

  if (segmentCount === 0) {
    elements.parseSummary.textContent = 'Paste a message to begin'
    return
  }

  const messageType = parsed.metadata.triggerEvent
    ? `${parsed.metadata.messageType ?? 'HL7'}^${parsed.metadata.triggerEvent}`
    : parsed.metadata.messageType
  const version = parsed.metadata.version ? `HL7 ${parsed.metadata.version}` : 'HL7'
  const segmentText = `${segmentCount} ${segmentCount === 1 ? 'segment' : 'segments'}`

  elements.parseSummary.textContent = [segmentText, messageType, version]
    .filter(Boolean)
    .join(' · ')
}

function renderWarnings(parsed: ParsedMessage): void {
  elements.warnings.replaceChildren()

  for (const warning of parsed.warnings) {
    const item = document.createElement('div')
    item.className = 'warning'
    item.textContent = warning
    elements.warnings.append(item)
  }
}

function renderTree(parsed: ParsedMessage): void {
  elements.tree.replaceChildren()

  if (parsed.segments.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'empty-state'
    empty.textContent = 'Paste an HL7 message above to see the parsed structure.'
    elements.tree.append(empty)
    return
  }

  for (const segment of parsed.segments) {
    elements.tree.append(segmentNode(segment))
  }
}

function segmentNode(segment: ParsedSegment): HTMLElement {
  const details = document.createElement('details')
  details.className = 'node segment'

  const summaryEl = document.createElement('summary')
  summaryEl.append(row(`${segment.id} #${segment.index}`, segment.name, compactPreview(segment.rawValue)))
  details.append(summaryEl)

  const fieldList = document.createElement('div')
  fieldList.className = 'children'

  for (const field of segment.fields) {
    if (!state.showEmptyFields && field.rawValue.length === 0) {
      continue
    }

    fieldList.append(fieldNode(field))
  }

  details.append(fieldList)
  return details
}

function fieldNode(field: ParsedField): HTMLElement {
  const hasNested = field.repetitions.some((repetition) => repetition.components.length > 1 || repetition.components.some((component) => component.subcomponents.length > 0))
  const container = document.createElement(hasNested ? 'details' : 'div')
  container.className = `node field ${field.rawValue.length === 0 ? 'is-empty' : ''}`

  const fieldName = field.datatype ? `${field.name} (${field.datatype})` : field.name

  if (hasNested) {
    const summaryEl = document.createElement('summary')
    summaryEl.append(row(field.path, fieldName, field.rawValue))
    container.append(summaryEl)

    const children = document.createElement('div')
    children.className = 'children'
    for (const repetition of field.repetitions) {
      children.append(repetitionNode(repetition))
    }
    container.append(children)
    return container
  }

  container.append(row(field.path, fieldName, field.rawValue))
  return container
}

function repetitionNode(repetition: ParsedRepetition): HTMLElement {
  const hasRepeatedPath = /\(\d+\)$/.test(repetition.path)
  const container = document.createElement(hasRepeatedPath ? 'details' : 'div')
  container.className = 'node repetition'

  if (hasRepeatedPath) {
    const summaryEl = document.createElement('summary')
    summaryEl.append(row(repetition.path, 'Repetition', repetition.rawValue))
    container.append(summaryEl)

    const children = document.createElement('div')
    children.className = 'children'
    appendComponents(children, repetition.components)
    container.append(children)
    return container
  }

  appendComponents(container, repetition.components)
  return container
}

function appendComponents(parent: HTMLElement, components: ParsedComponent[]): void {
  for (const component of components) {
    if (!state.showEmptyFields && component.rawValue.length === 0) {
      continue
    }

    parent.append(componentNode(component))
  }
}

function componentNode(component: ParsedComponent): HTMLElement {
  if (component.subcomponents.length === 0) {
    const container = document.createElement('div')
    container.className = 'node component'
    container.append(row(component.path, component.name, component.rawValue))
    return container
  }

  const details = document.createElement('details')
  details.className = 'node component'

  const summaryEl = document.createElement('summary')
  summaryEl.append(row(component.path, component.name, component.rawValue))
  details.append(summaryEl)

  const children = document.createElement('div')
  children.className = 'children'
  for (const subcomponent of component.subcomponents) {
    if (!state.showEmptyFields && subcomponent.rawValue.length === 0) {
      continue
    }

    children.append(row(subcomponent.path, subcomponent.name, subcomponent.rawValue))
  }
  details.append(children)
  return details
}

function row(path: string, name: string, value: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'row'

  const pathEl = document.createElement('span')
  pathEl.className = 'path'
  pathEl.textContent = path

  const nameEl = document.createElement('span')
  nameEl.className = 'name'
  nameEl.textContent = name

  const valueEl = document.createElement('span')
  valueEl.className = value.length > 0 ? 'value' : 'value muted'
  valueEl.textContent = value.length > 0 ? displayValue(value) : 'empty'

  wrapper.append(pathEl, nameEl, valueEl)
  return wrapper
}

function displayValue(value: string): string {
  return decodeHl7Escapes(value, state.parsed.delimiters)
}

function compactPreview(value: string): string {
  const preview = displayValue(value)
  return preview.length > 120 ? `${preview.slice(0, 117)}...` : preview
}
