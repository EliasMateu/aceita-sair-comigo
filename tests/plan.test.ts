import { describe, expect, it } from 'vitest'
import { buildPlanSummary, getProgramSummary } from '~/utils/plan'
import type { DateOption, DateSelections } from '~/types/date'

const options: DateOption[] = [
  {
    id: 'jantar',
    icon: 'dinner',
    emoji: '🍝',
    title: 'Jantar romântico',
    description: 'Uma comida gostosa.',
    accent: '#A9535F',
  },
  {
    id: 'escolha-dela',
    icon: 'custom',
    emoji: '💕',
    title: 'Você escolhe',
    description: 'Me conta o que você gostaria de fazer!',
    accent: '#9A6577',
  },
]

const base: DateSelections = {
  optionId: 'jantar',
  customIdea: '',
  date: '2026-11-14',
  time: '19:30',
  notes: 'Sem pressa.',
  combineLater: false,
}

describe('getProgramSummary', () => {
  it('returns the selected program', () => {
    const program = getProgramSummary(base, options, 'escolha-dela')
    expect(program.title).toBe('Jantar romântico')
    expect(program.isCustom).toBe(false)
    expect(program.detail).toBe('Uma comida gostosa.')
  })

  it('uses the custom idea for the custom option', () => {
    const program = getProgramSummary(
      { ...base, optionId: 'escolha-dela', customIdea: 'Piquenique' },
      options,
      'escolha-dela',
    )
    expect(program.title).toBe('Você escolhe')
    expect(program.detail).toBe('Piquenique')
    expect(program.isCustom).toBe(true)
  })
})

describe('buildPlanSummary', () => {
  it('formats a scheduled plan', () => {
    const plan = buildPlanSummary(base, options, 'escolha-dela', 'A combinar')
    expect(plan.isScheduled).toBe(true)
    expect(plan.dateLabel).toBe('14 de novembro de 2026')
    expect(plan.timeLabel).toBe('19h30')
    expect(plan.notes).toBe('Sem pressa.')
  })

  it('uses the combine label when the date is pending', () => {
    const plan = buildPlanSummary(
      { ...base, combineLater: true },
      options,
      'escolha-dela',
      'A combinar',
    )
    expect(plan.isScheduled).toBe(false)
    expect(plan.dateLabel).toBe('A combinar')
    expect(plan.timeLabel).toBe('A combinar')
  })
})
