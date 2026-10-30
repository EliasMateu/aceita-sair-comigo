export const WEEKDAY_LABELS = [
  'dom',
  'seg',
  'ter',
  'qua',
  'qui',
  'sex',
  'sáb',
] as const

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/
const ptBrDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const ptBrMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export interface DateParts {
  year: number
  month: number
  day: number
}

export function parseISODateParts(iso: string): DateParts | null {
  const match = ISO_DATE_RE.exec(iso)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const check = new Date(year, month - 1, day, 12)

  if (
    check.getFullYear() !== year ||
    check.getMonth() !== month - 1 ||
    check.getDate() !== day
  ) {
    return null
  }

  return { year, month, day }
}

export function isValidISODate(iso: string): boolean {
  return parseISODateParts(iso) !== null
}

export function isValidTime(time: string): boolean {
  return TIME_RE.test(time)
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now)
}

export function dateFromISO(iso: string): Date {
  const parts = parseISODateParts(iso)
  if (!parts) return new Date(Number.NaN)
  return new Date(parts.year, parts.month - 1, parts.day, 12, 0, 0)
}

export function isISODateInPast(iso: string, today = todayISO()): boolean {
  return iso < today
}

export function formatDateLong(iso: string): string {
  if (!isValidISODate(iso)) return ''
  return ptBrDateFormatter.format(dateFromISO(iso))
}

export function formatDateShort(iso: string): string {
  const parts = parseISODateParts(iso)
  if (!parts) return ''
  return `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`
}

export function formatMonthYear(year: number, monthIndex: number): string {
  const value = ptBrMonthFormatter.format(new Date(year, monthIndex, 1, 12))
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function formatTimeLabel(time: string): string {
  if (!isValidTime(time)) return ''
  const [hours, minutes] = time.split(':')
  return minutes === '00' ? `${hours}h` : `${hours}h${minutes}`
}

export interface MonthCell {
  iso: string
  day: number
  inMonth: boolean
}

export function buildMonthCells(year: number, monthIndex: number): MonthCell[] {
  const firstWeekday = new Date(year, monthIndex, 1, 12).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0, 12).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstWeekday + 1
    const date = new Date(year, monthIndex, day, 12)
    return {
      iso: toISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === monthIndex,
    }
  })
}

export interface YearMonth {
  year: number
  month: number
}

export function shiftMonth(year: number, month: number, offset: number): YearMonth {
  const date = new Date(year, month + offset, 1, 12)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function monthIndexFromISO(iso: string): YearMonth {
  const parts = parseISODateParts(iso)
  if (!parts) {
    throw new Error(`Invalid ISO date: ${iso}`)
  }
  return { year: parts.year, month: parts.month - 1 }
}

export function compareMonths(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) return a.year - b.year
  return a.month - b.month
}

export function addMinutesToLocalDateTime(
  dateISO: string,
  time: string,
  minutes: number,
): { date: string; time: string } {
  const parts = parseISODateParts(dateISO)
  if (!parts || !isValidTime(time)) {
    return { date: dateISO, time }
  }

  const [hours, mins] = time.split(':').map(Number)
  const date = new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    hours,
    mins + minutes,
    0,
  )

  return {
    date: toISODate(date),
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  }
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  totalMinutes: number
  isPast: boolean
  isToday: boolean
}

export function buildCountdown(target: Date, now: Date = new Date()): Countdown {
  const diff = target.getTime() - now.getTime()
  const totalMinutes = Math.max(0, Math.floor(diff / 60_000))
  const days = Math.floor(totalMinutes / 1_440)
  const hours = Math.floor((totalMinutes % 1_440) / 60)
  const minutes = totalMinutes % 60

  return {
    days,
    hours,
    minutes,
    totalMinutes,
    isPast: diff <= 0,
    isToday:
      diff > 0 &&
      target.getFullYear() === now.getFullYear() &&
      target.getMonth() === now.getMonth() &&
      target.getDate() === now.getDate(),
  }
}

export function padNumber(value: number): string {
  return pad(value)
}
