import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(resolve(process.cwd(), 'src/styles/styles.css'), 'utf8')
const main = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8')
const packageJson = readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')

function ruleFor(selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'm'))

  return match?.[1] ?? ''
}

function rootVariable(name: string): string {
  return cssVariable(ruleFor(':root'), name)
}

function cssVariable(rule: string, name: string): string {
  const match = rule.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))

  return match?.[1] ?? ''
}

function hexToRgb(hex: string): [number, number, number] {
  const [, red, green, blue] = hex.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/) ?? []

  if (!red || !green || !blue) {
    throw new Error(`Expected six-digit hex color, got ${hex}`)
  }

  return [red, green, blue].map((channel) => Number.parseInt(channel, 16)) as [number, number, number]
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((channel) => {
    const normalized = channel / 255

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))

  return (lighter + 0.05) / (darker + 0.05)
}

function neutralSpread(hex: string): number {
  const channels = hexToRgb(hex)

  return Math.max(...channels) - Math.min(...channels)
}

describe('app layout', () => {
  it('keeps the pasted message panel visible above the parsing results', () => {
    const inputPanelRule = ruleFor('.input-panel')

    expect(main).toContain('class="workspace"')
    expect(main).toContain('class="results-panel"')
    expect(inputPanelRule).toContain('position: sticky')
    expect(inputPanelRule).toContain('top: var(--sticky-offset)')
    expect(inputPanelRule).toContain('z-index:')
  })

  it('expands the workspace across wide app windows', () => {
    const shellRule = ruleFor('.shell')
    const editorRule = ruleFor('.message-editor')

    expect(shellRule).toContain('width: calc(100vw - clamp(')
    expect(shellRule).not.toContain('1180px')
    expect(editorRule).toContain('width: 100%')
  })

  it('uses a very dark accessible neutral theme', () => {
    const rootRule = ruleFor(':root')
    const bg = rootVariable('--bg')
    const surface = rootVariable('--surface')
    const surfaceSoft = rootVariable('--surface-soft')
    const ink = rootVariable('--ink')
    const muted = rootVariable('--muted')
    const accentStrong = rootVariable('--accent-strong')

    expect(rootRule).toContain('color-scheme: dark')
    expect(relativeLuminance(bg)).toBeLessThan(0.01)
    expect(relativeLuminance(surface)).toBeLessThan(0.03)
    expect(neutralSpread(bg)).toBeLessThanOrEqual(8)
    expect(neutralSpread(surface)).toBeLessThanOrEqual(16)
    expect(neutralSpread(surfaceSoft)).toBeLessThanOrEqual(18)
    expect(contrastRatio(ink, bg)).toBeGreaterThanOrEqual(7)
    expect(contrastRatio(ink, surface)).toBeGreaterThanOrEqual(7)
    expect(contrastRatio(muted, surface)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(accentStrong, surface)).toBeGreaterThanOrEqual(4.5)
  })

  it('can apply the Windows app theme at startup', () => {
    expect(main).toContain('initializeSystemTheme')
    expect(styles).toContain(':root[data-theme="light"]')
    expect(styles).toContain('--bg: #f4f6f8')
  })

  it('uses readable parsed value text in light mode', () => {
    const lightRootRule = ruleFor(':root[data-theme="light"]')
    const valueRule = ruleFor('.value')
    const valueInk = cssVariable(lightRootRule, '--value-ink')
    const surface = cssVariable(lightRootRule, '--surface')
    const surfaceTint = cssVariable(lightRootRule, '--surface-tint')

    expect(valueRule).toContain('color: var(--value-ink)')
    expect(contrastRatio(valueInk, surface)).toBeGreaterThanOrEqual(7)
    expect(contrastRatio(valueInk, surfaceTint)).toBeGreaterThanOrEqual(7)
  })

  it('reserves a disclosure column so expandable and flat parsed rows align', () => {
    const rowRule = ruleFor('.row')
    const disclosurePlaceholderRule = ruleFor('.row::before')
    const disclosureRule = ruleFor('details > summary .row::before')

    expect(rowRule).toContain('grid-template-columns: 18px')
    expect(styles).not.toMatch(/summary\s+\.row\s*\{[^}]*grid-template-columns/)
    expect(disclosurePlaceholderRule).toContain('content: ""')
    expect(disclosureRule).toContain('content: ">"')
  })

  it('keeps the app title and menu button on one row without an in-window icon', () => {
    const topbarRule = ruleFor('.topbar')
    const brandRule = ruleFor('.brand-block')
    const titleRule = ruleFor('h1')
    const actionsRule = ruleFor('.topbar-actions')

    expect(main).toContain('<h1>HL7 Reader</h1>')
    expect(main).not.toContain('appIconSvg')
    expect(main).not.toContain('class="app-mark"')
    expect(styles).not.toContain('.app-mark')
    expect(topbarRule).toContain('display: flex')
    expect(topbarRule).not.toContain('flex-direction: column')
    expect(brandRule).toContain('flex: 1 1 auto')
    expect(titleRule).toContain('white-space: nowrap')
    expect(titleRule).toContain('text-overflow: ellipsis')
    expect(actionsRule).toContain('flex: 0 0 auto')
  })

  it('keeps pasted message resizing vertical-only and highlights wrapped logical lines', () => {
    const textareaRule = ruleFor('textarea')
    const highlightRule = ruleFor('.message-highlights')
    const wrappedLineRule = ruleFor('.message-line.is-wrapped')
    const wrapWarningRule = ruleFor('.wrap-warning')

    expect(main).toContain('id="message-highlights"')
    expect(main).toContain('id="wrap-warning"')
    expect(main).toContain('Lines are wrapped')
    expect(main).toContain('markWrappedMessageLines')
    expect(main).toContain('setWrappedLineWarning')
    expect(textareaRule).toContain('resize: vertical')
    expect(textareaRule).not.toContain('resize: both')
    expect(textareaRule).toContain('overflow: auto')
    expect(highlightRule).toContain('pointer-events: none')
    expect(highlightRule).toContain('white-space: pre-wrap')
    expect(styles).toContain('--wrap-highlight:')
    expect(wrappedLineRule).toContain('background: var(--wrap-highlight)')
    expect(wrappedLineRule).toContain('box-decoration-break: clone')
    expect(wrapWarningRule).toContain('display: inline-flex')
    expect(styles).toContain('.wrap-warning[hidden]')
  })

  it('provides a separate synthetic de-identification output panel', () => {
    expect(main).toContain('Generate synthetic message')
    expect(main).toContain('id="deidentify-output-panel"')
    expect(main).toContain('id="deidentify-summary"')
    expect(main).toContain('id="deidentify-highlighted-output"')
    expect(main).toContain('Copy output')
    expect(main).not.toContain('Use as input')
    expect(main).not.toContain('deidentifyUse')
    expect(main).not.toContain('deidentify-use')
    expect(main).toContain('Hide synthetic message')
    expect(main).toContain('updateDeidentifyGenerateButton')
    expect(main).toContain('elements.deidentifyGenerate.hidden = !hasMessageText')
    expect(main).not.toContain('Hide output')
    expect(main).not.toContain('deidentifyHide')
    expect(main).toContain('renderDeidentifiedOutput')
  })

  it('styles de-identified changed values in the output message', () => {
    const outputPanelRule = ruleFor('.deidentify-output-panel')
    const outputRule = ruleFor('.deidentify-output')
    const changeRule = ruleFor('.deidentify-change')

    expect(outputPanelRule).toContain('border: 1px solid var(--line)')
    expect(outputRule).toContain('white-space: pre-wrap')
    expect(changeRule).toContain('background:')
    expect(changeRule).toContain('color:')
    expect(changeRule).toContain('box-decoration-break: clone')
  })

  it('does not add runtime network behavior for de-identification', () => {
    expect(main).not.toMatch(/\bfetch\s*\(/)
    expect(main).not.toContain('WebSocket')
    expect(main).not.toContain('EventSource')
    expect(packageJson).not.toContain('faker')
    expect(packageJson).not.toContain('@faker-js')
  })
})
