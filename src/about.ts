import { getCurrentWindow } from '@tauri-apps/api/window'
import { appIconDataUrl } from '@shared/appIcon'
import { releaseNotes } from '@shared/releaseNotes'
import './styles/about.css'

const appDisplayName = 'HL7 Reader'
const currentVersion = '2.0.0'
const about = document.querySelector<HTMLElement>('#about')

if (!about) {
  throw new Error('Missing about root')
}

const releaseHistory = releaseNotes
  .map((note, index) => {
    const changes = note.changes.map((change) => `<li>${escapeHtml(change)}</li>`).join('')
    const openAttribute = index === 0 ? ' open' : ''

    return `
      <details class="release-note"${openAttribute}>
        <summary>
          <span>Version ${escapeHtml(note.version)}</span>
          <time>${escapeHtml(note.date)}</time>
        </summary>
        <ul>${changes}</ul>
      </details>
    `
  })
  .join('')

about.innerHTML = `
  <header>
    <img src="${appIconDataUrl}" alt="" />
    <div>
      <h1>${escapeHtml(appDisplayName)}</h1>
      <p class="current-version">Current version ${escapeHtml(currentVersion)}</p>
    </div>
  </header>

  <h2>Version History</h2>
  <section class="release-list" aria-label="Version history">
    ${releaseHistory}
  </section>

  <button id="close-about" type="button">Close</button>
`

document.querySelector<HTMLButtonElement>('#close-about')?.addEventListener('click', () => {
  void getCurrentWindow().close()
})

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
