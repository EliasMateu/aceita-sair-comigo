import { isValidISODate, isValidTime, parseISODateParts } from './date'

interface ZonedParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(timeZone)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  formatterCache.set(timeZone, formatter)
  return formatter
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = getFormatter(timeZone).formatToParts(date)
  const values = new Map(parts.map((part) => [part.type, part.value]))

  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    second: Number(values.get('second')),
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone)
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )

  return asUtc - Math.trunc(date.getTime() / 1000) * 1000
}

/**
 * Converts a local date/time in an IANA timezone to a real UTC Date.
 * Handles the offset by resolving it twice, which also covers DST edges.
 */
export function zonedDateTimeToUtc(
  dateISO: string,
  time: string,
  timeZone: string,
): Date | null {
  if (!isValidISODate(dateISO) || !isValidTime(time)) return null

  const parts = parseISODateParts(dateISO)
  if (!parts) return null

  const [hours, minutes] = time.split(':').map(Number)
  const naiveUtc = Date.UTC(parts.year, parts.month - 1, parts.day, hours, minutes, 0)

  const firstOffset = getTimeZoneOffsetMs(new Date(naiveUtc), timeZone)
  let timestamp = naiveUtc - firstOffset

  const secondOffset = getTimeZoneOffsetMs(new Date(timestamp), timeZone)
  if (secondOffset !== firstOffset) {
    timestamp = naiveUtc - secondOffset
  }

  return new Date(timestamp)
}

/** iCalendar/Google-friendly UTC stamp: 20261114T223000Z */
export function formatUtcStamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}
