export const appIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="HL7 Reader">
  <rect width="64" height="64" rx="16" fill="#151c24"/>
  <path d="M32 9l5.5 13.4L52 23.8 41 33l3.4 14.1L32 39.6 19.6 47.1 23 33 12 23.8l14.5-1.4L32 9z" fill="#5fd0bd"/>
  <path d="M32 18l3.5 8.5 9.2.9-7 5.9 2.2 9-7.9-4.8-7.9 4.8 2.2-9-7-5.9 9.2-.9L32 18z" fill="#ffffff" opacity="0.92"/>
</svg>
`.trim()

export const appIconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(appIconSvg)}`
