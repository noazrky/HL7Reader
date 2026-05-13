import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const styles = readFileSync(resolve(process.cwd(), 'src/styles/styles.css'), 'utf8')
const main = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8')

function ruleFor(selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, 'm'))

  return match?.[1] ?? ''
}

function rootVariable(name: string): string {
  const match = ruleFor(':root').match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))

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

  it('reserves a disclosure column so expandable and flat parsed rows align', () => {
    const rowRule = ruleFor('.row')
    const disclosurePlaceholderRule = ruleFor('.row::before')
    const disclosureRule = ruleFor('details > summary .row::before')

    expect(rowRule).toContain('grid-template-columns: 18px')
    expect(styles).not.toMatch(/summary\s+\.row\s*\{[^}]*grid-template-columns/)
    expect(disclosurePlaceholderRule).toContain('content: ""')
    expect(disclosureRule).toContain('content: ">"')
  })
})
