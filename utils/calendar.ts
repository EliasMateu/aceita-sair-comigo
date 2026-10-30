import { formatUtcStamp, zonedDateTimeToUtc } from './timezone'

export interface CalendarEventInput {
  title: string
  description: string
  location?: string
  date: string
  time: string
  timeZone: string
  durationMinutes: number
}

interface EventRange {
  start: Date
  end: Date
}

function resolveRange(input: CalendarEventInput): EventRange | null {
  const start = zonedDateTimeToUtc(input.date, input.time, input.timeZone)
  if (!start) return null

  const duration = Number.isFinite(input.durationMinutes)
    ? Math.max(15, input.durationMinutes)
    : 120

  return {
    start,
    end: new Date(start.getTime() + duration * 60_000),
  }
}

export function buildGoogleCalendarUrl(
  input: CalendarEventInput,
): string | null {
  const range = resolveRange(input)
  if (!range) return null

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${formatUtcStamp(range.start)}/${formatUtcStamp(range.end)}`,
    details: input.description,
  })

  if (input.location?.trim()) {
    params.set('location', input.location.trim())
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function escapeIcsText(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
}

/**
 * Folds a content line to 75 octets as required by RFC 5545.
 * Continuation lines start with a single space, counted in the limit.
 */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder()
  const chunks: string[] = []
  let current = ''
  let bytes = 0

  for (const character of line) {
    const size = encoder.encode(character).length
    const limit = chunks.length === 0 ? 75 : 74

    if (bytes + size > limit && current) {
      chunks.push(current)
      current = character
      bytes = size
      continue
    }

    current += character
    bytes += size
  }

  chunks.push(current)
  return chunks
    .map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`))
    .join('\r\n')
}

function buildUid(date: string, time: string): string {
  const stamp = `${date.replaceAll('-', '')}-${time.replace(':', '')}`
  return `nosso-date-${stamp}@aceita-sair-comigo`
}

export function buildIcsEvent(
  input: CalendarEventInput,
  stamp: Date = new Date(),
): string | null {
  const range = resolveRange(input)
  if (!range) return null

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//aceita-sair-comigo//Convite//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(buildUid(input.date, input.time))}`,
    `DTSTAMP:${formatUtcStamp(stamp)}`,
    `DTSTART:${formatUtcStamp(range.start)}`,
    `DTEND:${formatUtcStamp(range.end)}`,
    `SUMMARY:${escapeIcsText(input.title)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
  ]

  if (input.location?.trim()) {
    lines.push(`LOCATION:${escapeIcsText(input.location.trim())}`)
  }

  lines.push('STATUS:CONFIRMED', 'TRANSP:OPAQUE', 'END:VEVENT', 'END:VCALENDAR')

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

export function buildIcsFilename(date: string | null): string {
  return date ? `nosso-date-${date}.ics` : 'nosso-date.ics'
}
