import { invoke } from '@tauri-apps/api/core'
import {
  deidentifyHl7,
  type DeidentificationChange,
  type DeidentificationResult,
  type DeidentificationSummary
} from '@shared/hl7Deidentifier'
import {
  decodeHl7Escapes,
  parseHl7,
  type ParsedComponent,
  type ParsedField,
  type ParsedMessage,
  type ParsedRepetition,
  type ParsedSegment
} from '@shared/hl7Parser'
import { initializeSystemTheme } from '@shared/systemTheme'
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
  deidentified: DeidentificationResult | null
  showEmptyFields: boolean
}

const app = document.querySelector<HTMLDivElement>('#app')

void initializeSystemTheme()

if (!app) {
  throw new Error('Missing app root')
}

app.innerHTML = `
  <section class="shell">
    <header class="topbar">
      <div class="brand-block">
        <h1>HL7 Reader</h1>
      </div>
      <div class="topbar-actions">
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
          <div class="panel-actions">
            <span class="wrap-warning" id="wrap-warning" hidden>
              <span class="wrap-warning-icon" aria-hidden="true">!</span>
              Lines are wrapped
            </span>
            <button class="secondary-button" id="deidentify-generate" type="button">Generate synthetic message</button>
          </div>
        </div>
        <div class="message-editor" id="message-editor">
          <div class="message-highlights" id="message-highlights" aria-hidden="true"></div>
          <textarea id="message-input" spellcheck="false"></textarea>
        </div>
      </section>

      <section class="deidentify-output-panel" id="deidentify-output-panel" aria-label="Synthetic HL7 output" hidden>
        <div class="panel-heading">
          <div>
            <h2>Synthetic message</h2>
            <p id="deidentify-status">Generated locally from structured fields</p>
          </div>
          <div class="panel-actions">
            <button class="secondary-button" id="deidentify-copy" type="button">Copy output</button>
          </div>
        </div>
        <div class="deidentify-summary" id="deidentify-summary"></div>
        <pre class="deidentify-output" id="deidentify-highlighted-output" tabindex="0"></pre>
      </section>

      <section class="results-panel" aria-label="Parsed HL7 output">
        <div class="panel-heading results-heading">
          <div>
            <h2>Parsed structure</h2>
            <p id="parse-summary">Paste a message to begin</p>
          </div>
          <label class="toggle">
            <input id="show-empty" type="checkbox" />
            <span>Show empty segments</span>
          </label>
        </div>
        <section class="warnings" id="warnings"></section>
        <section class="tree" id="tree"></section>
      </section>
    </main>
  </section>
`

const input = document.querySelector<HTMLTextAreaElement>('#message-input')
const messageEditor = document.querySelector<HTMLElement>('#message-editor')
const messageHighlights = document.querySelector<HTMLElement>('#message-highlights')
const deidentifyGenerate = document.querySelector<HTMLButtonElement>('#deidentify-generate')
const deidentifyOutputPanel = document.querySelector<HTMLElement>('#deidentify-output-panel')
const deidentifyStatus = document.querySelector<HTMLElement>('#deidentify-status')
const deidentifySummary = document.querySelector<HTMLElement>('#deidentify-summary')
const deidentifyHighlightedOutput = document.querySelector<HTMLElement>('#deidentify-highlighted-output')
const deidentifyCopy = document.querySelector<HTMLButtonElement>('#deidentify-copy')
const wrapWarning = document.querySelector<HTMLElement>('#wrap-warning')
const showEmpty = document.querySelector<HTMLInputElement>('#show-empty')
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')
const messageSummary = document.querySelector<HTMLElement>('#message-summary')
const parseSummary = document.querySelector<HTMLElement>('#parse-summary')
const warnings = document.querySelector<HTMLElement>('#warnings')
const tree = document.querySelector<HTMLElement>('#tree')

if (
  !input ||
  !messageEditor ||
  !messageHighlights ||
  !deidentifyGenerate ||
  !deidentifyOutputPanel ||
  !deidentifyStatus ||
  !deidentifySummary ||
  !deidentifyHighlightedOutput ||
  !deidentifyCopy ||
  !wrapWarning ||
  !showEmpty ||
  !menuToggle ||
  !messageSummary ||
  !parseSummary ||
  !warnings ||
  !tree
) {
  throw new Error('Missing renderer elements')
}

const elements = {
  input,
  messageEditor,
  messageHighlights,
  deidentifyGenerate,
  deidentifyOutputPanel,
  deidentifyStatus,
  deidentifySummary,
  deidentifyHighlightedOutput,
  deidentifyCopy,
  wrapWarning,
  showEmpty,
  menuToggle,
  messageSummary,
  parseSummary,
  warnings,
  tree
}

const state: RendererState = {
  parsed: parseHl7(''),
  deidentified: null,
  showEmptyFields: false
}

let messageHighlightFrame = 0
let parseTimer = 0

const REPEATED_PATH_RE = /\(\d+\)$/

elements.input.placeholder = sampleMessage

elements.input.addEventListener('input', () => {
  renderMessageHighlights()
  clearTimeout(parseTimer)
  parseTimer = window.setTimeout(() => {
    state.parsed = parseHl7(elements.input.value)
    state.deidentified = null
    renderSummaries(state.parsed)
    renderWarnings(state.parsed)
    renderDeidentifiedOutput()
    renderTree(state.parsed)
  }, 150)
})

elements.input.addEventListener('scroll', syncMessageHighlightScroll)

const messageInputResizeObserver = new ResizeObserver(() => {
  scheduleMessageHighlightMeasure()
})
messageInputResizeObserver.observe(elements.input)

elements.showEmpty.addEventListener('change', () => {
  state.showEmptyFields = elements.showEmpty.checked
  render()
})

elements.deidentifyGenerate.addEventListener('click', () => {
  if (elements.input.value.trim().length === 0) {
    return
  }

  if (state.deidentified) {
    state.deidentified = null
    render()
    return
  }

  state.deidentified = deidentifyHl7(elements.input.value)
  render()
})

elements.deidentifyCopy.addEventListener('click', () => {
  void copyDeidentifiedOutput()
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
  const lines = elements.input.value.split(/\r\n|\r|\n/)
  renderMessageHighlights(lines)
  renderSummaries(state.parsed, lines)
  renderDeidentifiedOutput()
  renderWarnings(state.parsed)
  renderTree(state.parsed)
}

function renderMessageHighlights(lines?: string[]): void {
  elements.messageHighlights.replaceChildren()

  if (elements.input.value.length === 0) {
    scheduleMessageHighlightMeasure()
    return
  }

  const messageLines = lines ?? elements.input.value.split(/\r\n|\r|\n/)

  for (const [index, line] of messageLines.entries()) {
    const lineEl = document.createElement('span')
    lineEl.className = 'message-line'
    lineEl.textContent = line.length > 0 ? line : '\u200B'
    elements.messageHighlights.append(lineEl)

    if (index < messageLines.length - 1) {
      elements.messageHighlights.append(document.createElement('br'))
    }
  }

  scheduleMessageHighlightMeasure()
}

function scheduleMessageHighlightMeasure(): void {
  if (messageHighlightFrame !== 0) {
    return
  }

  messageHighlightFrame = window.requestAnimationFrame(() => {
    messageHighlightFrame = 0
    syncMessageHighlightSize()
    markWrappedMessageLines()
    syncMessageHighlightScroll()
  })
}

function syncMessageHighlightSize(): void {
  const styles = getComputedStyle(elements.input)
  const borderX = numericStyleValue(styles.borderLeftWidth) + numericStyleValue(styles.borderRightWidth)
  const borderY = numericStyleValue(styles.borderTopWidth) + numericStyleValue(styles.borderBottomWidth)

  elements.messageHighlights.style.width = `${elements.input.clientWidth + borderX}px`
  elements.messageHighlights.style.height = `${elements.input.clientHeight + borderY}px`
}

function syncMessageHighlightScroll(): void {
  elements.messageHighlights.scrollLeft = elements.input.scrollLeft
  elements.messageHighlights.scrollTop = elements.input.scrollTop
}

function markWrappedMessageLines(): void {
  let hasWrappedLines = false

  for (const line of elements.messageHighlights.querySelectorAll<HTMLElement>('.message-line')) {
    const isWrapped = line.getClientRects().length > 1
    line.classList.toggle('is-wrapped', isWrapped)
    hasWrappedLines ||= isWrapped
  }

  setWrappedLineWarning(hasWrappedLines)
}

function setWrappedLineWarning(hasWrappedLines: boolean): void {
  elements.wrapWarning.hidden = !hasWrappedLines
}

function numericStyleValue(value: string): number {
  const numericValue = Number.parseFloat(value)

  return Number.isFinite(numericValue) ? numericValue : 0
}

function renderSummaries(parsed: ParsedMessage, lines?: string[]): void {
  const rawMessage = elements.input.value.trim()
  const messageLines = lines ?? rawMessage.split(/\r\n|\r|\n/)
  const lineCount = rawMessage.length === 0 ? 0 : messageLines.filter((line) => line.trim().length > 0).length
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

function renderDeidentifiedOutput(): void {
  const result = state.deidentified
  elements.deidentifyOutputPanel.hidden = !result
  updateDeidentifyGenerateButton(Boolean(result))

  if (!result) {
    elements.deidentifySummary.replaceChildren()
    elements.deidentifyHighlightedOutput.replaceChildren()
    elements.deidentifyStatus.textContent = 'Generated locally from structured fields'
    return
  }

  elements.deidentifyStatus.textContent = result.changes.length === 0
    ? 'No structured patient or related-person fields were changed'
    : `${result.changes.length} structured ${result.changes.length === 1 ? 'value' : 'values'} changed`
  renderDeidentificationSummary(result.summary)
  renderHighlightedDeidentificationOutput(result.message, result.changes)
}

function updateDeidentifyGenerateButton(hasSyntheticOutput: boolean): void {
  const hasMessageText = elements.input.value.trim().length > 0

  elements.deidentifyGenerate.hidden = !hasMessageText
  elements.deidentifyGenerate.textContent = hasSyntheticOutput
    ? 'Hide synthetic message'
    : 'Generate synthetic message'
}

function renderDeidentificationSummary(summary: DeidentificationSummary): void {
  elements.deidentifySummary.replaceChildren()

  const entries: Array<[keyof DeidentificationSummary, string]> = [
    ['names', 'Names'],
    ['ids', 'IDs'],
    ['addresses', 'Addresses'],
    ['phones', 'Phones'],
    ['dobs', 'DOBs']
  ]

  for (const [key, label] of entries) {
    const item = document.createElement('span')
    item.className = 'summary-pill'
    item.textContent = `${summary[key]} ${label}`
    elements.deidentifySummary.append(item)
  }
}

function renderHighlightedDeidentificationOutput(
  message: string,
  changes: DeidentificationChange[]
): void {
  elements.deidentifyHighlightedOutput.replaceChildren()

  const orderedChanges = [...changes].sort((first, second) => first.start - second.start)
  let cursor = 0

  for (const change of orderedChanges) {
    if (change.start < cursor) {
      continue
    }

    elements.deidentifyHighlightedOutput.append(document.createTextNode(message.slice(cursor, change.start)))

    const changedValue = document.createElement('mark')
    changedValue.className = `deidentify-change deidentify-change-${change.category}`
    changedValue.textContent = message.slice(change.start, change.end)
    changedValue.title = `${change.path} synthetic ${summaryLabel(change.category)}`
    elements.deidentifyHighlightedOutput.append(changedValue)
    cursor = change.end
  }

  elements.deidentifyHighlightedOutput.append(document.createTextNode(message.slice(cursor)))
}

const SUMMARY_LABELS: Record<keyof DeidentificationSummary, string> = {
  names: 'name',
  ids: 'ID',
  addresses: 'address',
  phones: 'phone',
  dobs: 'DOB'
}

function summaryLabel(category: keyof DeidentificationSummary): string {
  return SUMMARY_LABELS[category]
}

async function copyDeidentifiedOutput(): Promise<void> {
  if (!state.deidentified) {
    return
  }

  const output = state.deidentified.message

  try {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API unavailable')
    }

    await navigator.clipboard.writeText(output)
    elements.deidentifyStatus.textContent = 'Synthetic message copied'
    return
  } catch {
    selectDeidentifiedOutput()
    elements.deidentifyStatus.textContent = 'Copy unavailable; output text selected'
  }
}

function selectDeidentifiedOutput(): void {
  const selection = window.getSelection()
  const range = document.createRange()

  range.selectNodeContents(elements.deidentifyHighlightedOutput)
  selection?.removeAllRanges()
  selection?.addRange(range)
  elements.deidentifyHighlightedOutput.focus()
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
  const fieldName = field.datatype ? `${field.name} (${field.datatype})` : field.name
  let hasNested = false
  const builtRepetitions: HTMLElement[] = []

  for (const repetition of field.repetitions) {
    if (!hasNested && (repetition.components.length > 1 || repetition.components.some((c) => c.subcomponents.length > 0))) {
      hasNested = true
    }
    builtRepetitions.push(repetitionNode(repetition))
  }

  const container = document.createElement(hasNested ? 'details' : 'div')
  container.className = `node field ${field.rawValue.length === 0 ? 'is-empty' : ''}`

  if (hasNested) {
    const summaryEl = document.createElement('summary')
    summaryEl.append(row(field.path, fieldName, field.rawValue))
    container.append(summaryEl)

    const children = document.createElement('div')
    children.className = 'children'
    for (const node of builtRepetitions) {
      children.append(node)
    }
    container.append(children)
    return container
  }

  container.append(row(field.path, fieldName, field.rawValue))
  return container
}

function repetitionNode(repetition: ParsedRepetition): HTMLElement {
  const hasRepeatedPath = REPEATED_PATH_RE.test(repetition.path)
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
