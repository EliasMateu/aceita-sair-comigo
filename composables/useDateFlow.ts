import { computed } from 'vue'
import { customOptionId, romanticConfig } from '~/config/romantic.config'
import type { DateOption, DateSelections, DateFlowState, FlowStep } from '~/types/date'
import {
  isValidISODate,
  isValidTime,
  isISODateInPast,
} from '~/utils/date'
import {
  clearPersistedFlow,
  readPersistedFlow,
  writePersistedFlow,
} from '~/utils/storage'

const validOptionIds = romanticConfig.dateOptions.map((option) => option.id)

export function createInitialFlowState(): DateFlowState {
  return {
    step: 'welcome',
    selections: {
      optionId: null,
      customIdea: '',
      date: null,
      time: null,
      notes: '',
      combineLater: false,
    },
  }
}

export function useDateFlow() {
  const state = useState<DateFlowState>('romantic-date-flow', createInitialFlowState)
  const hydrated = useState<boolean>('romantic-date-flow-hydrated', () => false)

  const selections = computed(() => state.value.selections)
  const selectedOption = computed<DateOption | null>(
    () =>
      romanticConfig.dateOptions.find(
        (option) => option.id === state.value.selections.optionId,
      ) ?? null,
  )
  const isCustomOption = computed(
    () => state.value.selections.optionId === customOptionId,
  )
  const hasChosenDate = computed(
    () =>
      Boolean(state.value.selections.date && state.value.selections.time) &&
      !state.value.selections.combineLater,
  )

  function updateSelections(patch: Partial<DateSelections>): void {
    state.value.selections = { ...state.value.selections, ...patch }
  }

  function goTo(step: FlowStep): void {
    if (
      ['choose', 'schedule', 'summary', 'finale'].includes(step) &&
      !state.value.selections.optionId
    ) {
      state.value.step = 'choose'
      return
    }

    state.value.step = step
  }

  function chooseOption(optionId: string): void {
    if (!validOptionIds.includes(optionId)) return
    updateSelections({ optionId })
  }

  function setCustomIdea(value: string): void {
    updateSelections({ customIdea: value.slice(0, 280) })
  }

  function setNotes(value: string): void {
    updateSelections({ notes: value.slice(0, 600) })
  }

  function setDate(date: string | null): void {
    if (!date) {
      updateSelections({ date: null, time: null })
      return
    }

    if (!isValidISODate(date) || isISODateInPast(date)) return
    updateSelections({ date })
  }

  function setTime(time: string | null): void {
    if (!time) {
      updateSelections({ time: null })
      return
    }

    if (!isValidTime(time)) return
    updateSelections({ time })
  }

  function setCombineLater(value: boolean): void {
    updateSelections({ combineLater: value })
  }

  function acceptInvitation(): void {
    state.value.step = 'celebration'
  }

  function finishCelebration(): void {
    state.value.step = 'choose'
  }

  function declineInvitation(): void {
    state.value.step = 'declined'
  }

  function confirmDate(): void {
    if (!state.value.selections.optionId) {
      state.value.step = 'choose'
      return
    }
    state.value.step = 'finale'
  }

  function reset(): void {
    state.value = createInitialFlowState()
    clearPersistedFlow()
  }

  function hydrate(): void {
    if (hydrated.value || typeof window === 'undefined') return

    const saved = readPersistedFlow(validOptionIds)
    if (saved) {
      state.value = {
        step: saved.step,
        selections: saved.selections,
      }
    }

    hydrated.value = true
  }

  function persist(): void {
    if (!hydrated.value || typeof window === 'undefined') return
    writePersistedFlow(state.value)
  }

  return {
    state,
    hydrated,
    selections,
    selectedOption,
    isCustomOption,
    hasChosenDate,
    updateSelections,
    goTo,
    chooseOption,
    setCustomIdea,
    setNotes,
    setDate,
    setTime,
    setCombineLater,
    acceptInvitation,
    finishCelebration,
    declineInvitation,
    confirmDate,
    reset,
    hydrate,
    persist,
  }
}
