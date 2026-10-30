import { describe, expect, it } from 'vitest'
import { buildCountdown, buildMonthCells, formatDateLong, formatTimeLabel, toISODate } from '~/utils/date'
import { formatUtcStamp, zonedDateTimeToUtc } from '~/utils/timezone'

describe('timezone', () => {
  it('converts a São Paulo wall time to UTC', () => {
    const utc = zonedDateTimeToUtc('2026-11-14', '19:30', 'America/Sao_Paulo')
    expect(utc?.toISOString()).toBe('2026-11-14T22:30:00.000Z')
  })

  it('formats a compact UTC stamp for calendar links', () => {
    const utc = zonedDateTimeToUtc('2026-11-14', '19:30', 'America/Sao_Paulo')!
    expect(formatUtcStamp(utc)).toBe('20261114T223000Z')
  })

  it('returns null for invalid date or time', () => {
    expect(zonedDateTimeToUtc('2026-02-31', '19:00', 'America/Sao_Paulo')).toBeNull()
    expect(zonedDateTimeToUtc('2026-11-14', '24:00', 'America/Sao_Paulo')).toBeNull()
  })
})

describe('date helpers', () => {
  it('builds a month grid that starts on the right weekday', () => {
    const cells = buildMonthCells(2026, 9)
    const first = cells.find((cell) => cell.inMonth)
    expect(first?.iso).toBe('2026-10-01')
    expect(first && new Date(2026, 9, 1, 12).getDay()).toBe(4)
    expect(cells[4]?.iso).toBe('2026-10-01')
  })

  it('formats dates and times in pt-BR', () => {
    expect(formatDateLong('2026-11-14')).toBe('14 de novembro de 2026')
    expect(formatTimeLabel('19:30')).toBe('19h30')
    expect(formatTimeLabel('19:00')).toBe('19h')
  })

  it('formats local dates using local calendar parts', () => {
    expect(toISODate(new Date(2026, 0, 5, 12))).toBe('2026-01-05')
  })
})

describe('buildCountdown', () => {
  const now = new Date('2026-10-30T15:00:00.000Z')

  it('returns days, hours and minutes until the date', () => {
    const target = new Date('2026-11-14T22:30:00.000Z')
    const countdown = buildCountdown(target, now)

    expect(countdown.isPast).toBe(false)
    expect(countdown.isToday).toBe(false)
    expect(countdown.days).toBe(15)
    expect(countdown.hours).toBe(7)
    expect(countdown.minutes).toBe(30)
  })

  it('marks the same local day as today', () => {
    const target = new Date('2026-10-30T22:00:00.000Z')
    const countdown = buildCountdown(target, now)

    expect(countdown.isToday).toBe(true)
    expect(countdown.days).toBe(0)
  })

  it('marks elapsed dates as past', () => {
    const countdown = buildCountdown(new Date('2026-10-29T15:00:00.000Z'), now)
    expect(countdown.isPast).toBe(true)
    expect(countdown.totalMinutes).toBe(0)
  })
})
