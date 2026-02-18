// utils/vcard.ts
type Profile = {
  name?: string
  title?: string
  phone?: string
  email?: string
  website?: string
}

/**
 * Escapes characters per vCard text rules:
 * - backslash → \\ 
 * - comma → \,
 * - semicolon → \;
 * - newline → \n (literal)
 */
function esc(value: unknown = ''): string {
  const s = String(value ?? '')
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/**
 * Build a vCard 3.0 string.
 * Use CRLF line endings as recommended by the spec.
 */
export function toVCard(profile: Profile): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${esc(profile.name || '')}`,
    profile.title ? `TITLE:${esc(profile.title)}` : undefined,
    profile.phone ? `TEL;TYPE=CELL:${esc(profile.phone)}` : undefined,
    profile.email ? `EMAIL;TYPE=INTERNET:${esc(profile.email)}` : undefined,
    profile.website ? `URL:${esc(profile.website)}` : undefined,
    'END:VCARD'
  ].filter(Boolean) as string[]

  // Important: This must be a single JS string with escaped CRLF, not broken into multiple lines.
  return lines.join('\r\n')
}