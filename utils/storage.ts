import type { DateFlowState, FlowStep, PersistedDateFlow } from '~/types/date'
import { isValidISODate, isValidTime, isISODateInPast, todayISO } from './date'

export const FLOW_STORAGE_KEY = 'aceita-sair-comigo:flow:v1'
export const FLOW_STORAGE_VERSION = 1

const FLOW_STEPS: readonly FlowStep[] = [
  'welcome',
  'invitation',
  'declined',
  'celebration',
  'choose',
  'schedule',
  'summary',
  'finale',
]

const POST_INVITATION_STEPS: readonly FlowStep[] = [
  'choose',
  'schedule',
  'summary',
  'finale',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function readNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

/**
 * Validates anything read from localStorage before it reaches the UI.
 * Corrupted, outdated or manipulated data is simply ignored.
 */
export function sanitizePersistedFlow(
  value: unknown,
  validOptionIds: readonly string[],
  today = todayISO(),
): PersistedDateFlow | null {
  if (!isRecord(value) || value.version !== FLOW_STORAGE_VERSION) return null
  if (typeof value.step !== 'string') return null
  if (!FLOW_STEPS.includes(value.step as FlowStep)) return null
  if (!isRecord(value.selections)) return null

  const raw = value.selections
  const optionIdRaw = readNullableString(raw.optionId)
  const optionId =
    optionIdRaw && validOptionIds.includes(optionIdRaw) ? optionIdRaw : null

  const dateRaw = readNullableString(raw.date)
  const timeRaw = readNullableString(raw.time)
  const date = dateRaw && isValidISODate(dateRaw) ? dateRaw : null
  const validDate = date && !isISODateInPast(date, today) ? date : null
  const time = validDate && timeRaw && isValidTime(timeRaw) ? timeRaw : null

  const step = value.step as FlowStep
  const normalizedStep: FlowStep =
    step === 'celebration'
      ? 'choose'
      : POST_INVITATION_STEPS.includes(step) && !optionId
        ? 'choose'
        : step

  return {
    version: FLOW_STORAGE_VERSION,
    step: normalizedStep,
    selections: {
      optionId,
      customIdea: readString(raw.customIdea, 280),
      date: validDate,
      time,
      notes: readString(raw.notes, 600),
      combineLater: raw.combineLater === true,
    },
  }
}

export function toPersistedFlow(state: DateFlowState): PersistedDateFlow {
  return {
    version: FLOW_STORAGE_VERSION,
    step: state.step === 'celebration' ? 'choose' : state.step,
    selections: { ...state.selections },
  }
}

export function readPersistedFlow(
  validOptionIds: readonly string[],
  today = todayISO(),
): PersistedDateFlow | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(FLOW_STORAGE_KEY)
    if (!raw) return null
    return sanitizePersistedFlow(JSON.parse(raw), validOptionIds, today)
  } catch {
    return null
  }
}

export function writePersistedFlow(state: DateFlowState): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      FLOW_STORAGE_KEY,
      JSON.stringify(toPersistedFlow(state)),
    )
  } catch {
    // Storage can be unavailable (private mode, quota). The experience still works.
  }
}

export function clearPersistedFlow(): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(FLOW_STORAGE_KEY)
  } catch {
    // Nothing to do.
  }
}
