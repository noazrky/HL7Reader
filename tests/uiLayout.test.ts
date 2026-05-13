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

describe('app layout', () => {
  it('keeps the pasted message panel visible above the parsing results', () => {
    const inputPanelRule = ruleFor('.input-panel')

    expect(main).toContain('class="workspace"')
    expect(main).toContain('class="results-panel"')
    expect(inputPanelRule).toContain('position: sticky')
    expect(inputPanelRule).toContain('top: var(--sticky-offset)')
    expect(inputPanelRule).toContain('z-index:')
  })
})
