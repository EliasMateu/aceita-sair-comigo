import { describe, expect, it } from 'vitest'
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  sanitizeWhatsAppNumber,
} from '~/utils/whatsapp'
import type { PlanSummary } from '~/utils/plan'

const copy = {
  greeting: 'Oiê! 💗',
  intro: 'Então... eu aceitei sair com você!',
  programLabel: 'Programa',
  customLabel: 'Minha ideia',
  dateLabel: 'Data',
  timeLabel: 'Horário',
  notesLabel: 'Observações',
  closing: 'Agora é só a gente combinar!',
}

const scheduledPlan: PlanSummary = {
  program: {
    title: 'Jantar romântico',
    detail: 'Uma comida gostosa e horas de conversa.',
    isCustom: false,
  },
  dateLabel: '14 de novembro de 2026',
  timeLabel: '19h30',
  notes: 'Sem pressa.',
  isScheduled: true,
}

describe('sanitizeWhatsAppNumber', () => {
  it('keeps only digits from formatted numbers', () => {
    expect(sanitizeWhatsAppNumber('+55 (15) 99740-2280')).toBe('5515997402280')
  })
})

describe('buildWhatsAppMessage', () => {
  it('includes program, date, time and notes', () => {
    const message = buildWhatsAppMessage({ copy, plan: scheduledPlan })

    expect(message).toContain('Programa: Jantar romântico')
    expect(message).toContain('Data: 14 de novembro de 2026')
    expect(message).toContain('Horário: 19h30')
    expect(message).toContain('Observações: Sem pressa.')
    expect(message).toContain('Agora é só a gente combinar!')
    expect(message).not.toContain('Minha ideia')
  })

  it('shows the custom idea and pending date', () => {
    const message = buildWhatsAppMessage({
      copy,
      plan: {
        program: {
          title: 'Você escolhe',
          detail: 'Piquenique no parque',
          isCustom: true,
        },
        dateLabel: 'A combinar',
        timeLabel: 'A combinar',
        notes: '',
        isScheduled: false,
      },
    })

    expect(message).toContain('Minha ideia: Piquenique no parque')
    expect(message).toContain('Data: A combinar')
    expect(message).not.toContain('Observações:')
    expect(message).not.toContain('undefined')
  })
})

describe('buildWhatsAppUrl', () => {
  it('encodes the message and keeps the number digits', () => {
    const url = buildWhatsAppUrl('+55 (15) 99740-2280', copy.intro)

    expect(url).toMatch(/^https:\/\/wa\.me\/5515997402280\?text=/)
    expect(decodeURIComponent(url!.split('text=')[1]!)).toBe(copy.intro)
  })

  it('returns null for a missing number', () => {
    expect(buildWhatsAppUrl('', 'oi')).toBeNull()
    expect(buildWhatsAppUrl('123', 'oi')).toBeNull()
  })
})
