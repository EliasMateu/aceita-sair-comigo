import { describe, expect, it } from 'vitest'
import {
  buildGoogleCalendarUrl,
  buildIcsEvent,
  buildIcsFilename,
  foldIcsLine,
  type CalendarEventInput,
} from '~/utils/calendar'

const event: CalendarEventInput = {
  title: 'Nosso primeiro date 💗',
  description: 'Programa: Jantar\nObservações: sem pressa, com carinho; muita conversa.',
  location: 'São Paulo, SP',
  date: '2026-11-14',
  time: '19:30',
  timeZone: 'America/Sao_Paulo',
  durationMinutes: 120,
}

const stamp = new Date('2026-10-30T12:00:00.000Z')

describe('buildGoogleCalendarUrl', () => {
  it('converts São Paulo time to UTC and encodes details', () => {
    const url = buildGoogleCalendarUrl(event)
    expect(url).not.toBeNull()

    const parsed = new URL(url!)
    expect(parsed.origin + parsed.pathname).toBe(
      'https://calendar.google.com/calendar/render',
    )
    expect(parsed.searchParams.get('action')).toBe('TEMPLATE')
    expect(parsed.searchParams.get('text')).toBe(event.title)
    expect(parsed.searchParams.get('dates')).toBe(
      '20261114T223000Z/20261115T003000Z',
    )
    expect(parsed.searchParams.get('details')).toContain('Jantar')
    expect(parsed.searchParams.get('location')).toBe('São Paulo, SP')
  })

  it('returns null for invalid input', () => {
    expect(
      buildGoogleCalendarUrl({ ...event, date: '2026-02-31' }),
    ).toBeNull()
    expect(buildGoogleCalendarUrl({ ...event, time: '25:00' })).toBeNull()
  })
})

describe('buildIcsEvent', () => {
  const ics = buildIcsEvent(event, stamp)!

  it('builds a valid UTC event with CRLF line endings', () => {
    expect(ics).toContain('BEGIN:VCALENDAR\r\nVERSION:2.0')
    expect(ics).toContain('DTSTART:20261114T223000Z')
    expect(ics).toContain('DTEND:20261115T003000Z')
    expect(ics).toContain('DTSTAMP:20261030T120000Z')
    expect(ics).toContain('SUMMARY:Nosso primeiro date 💗')
    expect(ics.endsWith('\r\n')).toBe(true)
  })

  it('escapes commas, semicolons and newlines in text fields', () => {
    expect(ics).toContain('LOCATION:São Paulo\\, SP')
    expect(ics).toContain('\\n')
    expect(ics).toContain('\\;')
  })

  it('keeps every folded line within 75 octets', () => {
    const encoder = new TextEncoder()
    for (const line of ics.split('\r\n')) {
      if (!line) continue
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
    }
  })
})

describe('foldIcsLine', () => {
  it('folds long unicode lines on character boundaries', () => {
    const line = `DESCRIPTION:${'coração 💗 '.repeat(20)}`
    const folded = foldIcsLine(line)
    const encoder = new TextEncoder()

    for (const part of folded.split('\r\n')) {
      expect(encoder.encode(part).length).toBeLessThanOrEqual(75)
    }

    expect(folded.replaceAll('\r\n ', '')).toBe(line)
  })
})

describe('buildIcsFilename', () => {
  it('includes the date when available', () => {
    expect(buildIcsFilename('2026-11-14')).toBe('nosso-date-2026-11-14.ics')
    expect(buildIcsFilename(null)).toBe('nosso-date.ics')
  })
})
