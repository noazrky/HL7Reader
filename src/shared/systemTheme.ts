import { getCurrentWindow, type Theme } from '@tauri-apps/api/window'

type AppTheme = Theme

const fallbackTheme: AppTheme = 'dark'

export function applyAppTheme(theme: AppTheme | null | undefined): void {
  const activeTheme = theme ?? fallbackTheme

  document.documentElement.dataset.theme = activeTheme
  document.documentElement.style.colorScheme = activeTheme
}

export async function initializeSystemTheme(): Promise<void> {
  const currentWindow = getCurrentWindow()

  try {
    applyAppTheme(await currentWindow.theme())
    await currentWindow.onThemeChanged(({ payload }) => {
      applyAppTheme(payload)
    })
  } catch {
    applyAppTheme(window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : fallbackTheme)
  }
}
