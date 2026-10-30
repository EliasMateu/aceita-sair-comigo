import type { DateOption, DateSelections } from '~/types/date'
import { formatDateLong, formatTimeLabel } from './date'

export interface ProgramSummary {
  title: string
  detail: string
  isCustom: boolean
}

export interface PlanSummary {
  program: ProgramSummary
  dateLabel: string
  timeLabel: string
  notes: string
  isScheduled: boolean
}

export function getProgramSummary(
  selections: DateSelections,
  options: readonly DateOption[],
  customOptionId: string,
): ProgramSummary {
  const option = options.find((item) => item.id === selections.optionId)

  if (!option) {
    return { title: '', detail: '', isCustom: false }
  }

  if (option.id === customOptionId) {
    return {
      title: option.title,
      detail: selections.customIdea.trim(),
      isCustom: true,
    }
  }

  return {
    title: option.title,
    detail: option.description,
    isCustom: false,
  }
}

export function buildPlanSummary(
  selections: DateSelections,
  options: readonly DateOption[],
  customOptionId: string,
  toCombineLabel: string,
): PlanSummary {
  const program = getProgramSummary(selections, options, customOptionId)
  const isScheduled = Boolean(
    !selections.combineLater && selections.date && selections.time,
  )

  return {
    program,
    dateLabel:
      isScheduled && selections.date
        ? formatDateLong(selections.date)
        : toCombineLabel,
    timeLabel:
      isScheduled && selections.time
        ? formatTimeLabel(selections.time)
        : toCombineLabel,
    notes: selections.notes.trim(),
    isScheduled,
  }
}
