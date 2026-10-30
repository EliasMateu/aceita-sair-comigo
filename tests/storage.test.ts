import { describe, expect, it } from 'vitest'
import {
  FLOW_STORAGE_VERSION,
  sanitizePersistedFlow,
  toPersistedFlow,
} from '~/utils/storage'
import type { DateFlowState } from '~/types/date'

const options = ['cinema', 'jantar', 'escolha-dela']
const today = '2026-10-30'

function persisted(overrides: Record<string, unknown> = {}) {
  return {
    version: FLOW_STORAGE_VERSION,
    step: 'schedule',
    selections: {
      optionId: 'jantar',
      customIdea: '',
      date: '2026-11-14',
      time: '19:30',
      notes: 'Sem pressa.',
      combineLater: false,
    },
    ...overrides,
  }
}

describe('sanitizePersistedFlow', () => {
  it('keeps a valid saved plan', () => {
    const result = sanitizePersistedFlow(persisted(), options, today)

    expect(result?.step).toBe('schedule')
    expect(result?.selections.optionId).toBe('jantar')
    expect(result?.selections.date).toBe('2026-11-14')
    expect(result?.selections.time).toBe('19:30')
  })

  it('rejects wrong versions and unknown steps', () => {
    expect(sanitizePersistedFlow(persisted({ version: 99 }), options, today)).toBeNull()
    expect(sanitizePersistedFlow(persisted({ step: 'hacked' }), options, today)).toBeNull()
  })

  it('drops invalid options, past dates and invalid times', () => {
    const result = sanitizePersistedFlow(
      persisted({
        selections: {
          optionId: 'unknown',
          customIdea: '  ideia  ',
          date: '2020-01-01',
          time: '19:30',
          notes: '  nota  ',
          combineLater: true,
        },
      }),
      options,
      today,
    )

    expect(result?.selections.optionId).toBeNull()
    expect(result?.selections.date).toBeNull()
    expect(result?.selections.time).toBeNull()
    expect(result?.selections.customIdea).toBe('ideia')
    expect(result?.selections.notes).toBe('nota')
    expect(result?.selections.combineLater).toBe(true)
  })

  it('resumes celebration at the program choice', () => {
    const result = sanitizePersistedFlow(persisted({ step: 'celebration' }), options, today)
    expect(result?.step).toBe('choose')
  })

  it('requires a program before later steps', () => {
    const result = sanitizePersistedFlow(
      persisted({
        step: 'summary',
        selections: {
          optionId: null,
          customIdea: '',
          date: null,
          time: null,
          notes: '',
          combineLater: false,
        },
      }),
      options,
      today,
    )

    expect(result?.step).toBe('choose')
  })

  it('ignores corrupted structures', () => {
    expect(sanitizePersistedFlow(null, options, today)).toBeNull()
    expect(sanitizePersistedFlow('text', options, today)).toBeNull()
    expect(sanitizePersistedFlow({ version: 1, step: 'schedule' }, options, today)).toBeNull()
  })
})

describe('toPersistedFlow', () => {
  it('normalizes celebration so a refresh does not replay the reveal', () => {
    const state: DateFlowState = {
      step: 'celebration',
      selections: {
        optionId: 'cinema',
        customIdea: '',
        date: null,
        time: null,
        notes: '',
        combineLater: false,
      },
    }

    expect(toPersistedFlow(state).step).toBe('choose')
  })
})
