export type ReleaseNote = {
  version: string
  date: string
  changes: string[]
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: '1.0.0',
    date: '2026-05-11',
    changes: [
      'Upgraded Electron and Electron Builder to resolve release-blocking dependency vulnerabilities.',
      'Added HL7 escape decoding for display while preserving raw parsed message values.',
      'Hardened packaged app defaults and reduced Windows package locales to en-US.'
    ]
  },
  {
    version: '0.2.2',
    date: '2026-05-11',
    changes: [
      'Documented the Major.Minor.Change versioning policy and EXE archive expectations.',
      'Added a changelog covering all project versions through the current release.',
      'Changed the About window release history from a running list to per-version dropdowns.'
    ]
  },
  {
    version: '0.2.1',
    date: '2026-05-11',
    changes: [
      'Hid the native Electron menu bar by default.',
      'Added Ctrl+Shift+M, F1, and a hamburger button for native menu and About access.',
      'Updated the app icon to a star-only mark and reused it in the header, About dialog, and Windows package.'
    ]
  },
  {
    version: '0.2.0',
    date: '2026-05-11',
    changes: [
      'Added a populated Help menu with app version details and release history.',
      'Added a small HL7 Reader icon mark in the app header, Help dialog, and packaged Windows app.',
      'Limited packaged Electron locale files to en-US, en-GB, and es.'
    ]
  },
  {
    version: '0.1.1',
    date: '2026-05-11',
    changes: [
      'Expanded HL7 parser labeling for additional ADT, order, observation, procedure, role, and insurance segments.',
      'Added parser coverage for repeated fields, nested components, custom delimiters, malformed input, and blank input.'
    ]
  },
  {
    version: '0.1.0',
    date: '2026-05-11',
    changes: ['Initial HL7 v2 message parser and desktop reader.']
  }
]
