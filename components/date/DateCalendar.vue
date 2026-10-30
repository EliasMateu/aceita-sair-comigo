<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, nextTick, ref, useId } from 'vue'
import {
  WEEKDAY_LABELS,
  buildMonthCells,
  compareMonths,
  dateFromISO,
  formatMonthYear,
  isValidISODate,
  monthIndexFromISO,
  shiftMonth,
  todayISO,
  toISODate,
  type MonthCell,
  type YearMonth,
} from '~/utils/date'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    minDate?: string
    maxMonthsAhead?: number
    label?: string
  }>(),
  {
    modelValue: null,
    minDate: () => todayISO(),
    maxMonthsAhead: 18,
    label: 'Escolha o dia do nosso date',
  },
)

const emit = defineEmits<{
  'update:modelValue': [iso: string]
}>()

const root = ref<HTMLElement | null>(null)
const focusedISO = ref<string | null>(null)
const describedBy = useId()
const headingId = useId()

const minDate = computed(() =>
  isValidISODate(props.minDate) ? props.minDate : todayISO(),
)

const baseMonth = computed(() => monthIndexFromISO(minDate.value))
const maxMonth = computed(() =>
  shiftMonth(baseMonth.value.year, baseMonth.value.month, props.maxMonthsAhead),
)
const maxDate = computed(() =>
  toISODate(new Date(maxMonth.value.year, maxMonth.value.month + 1, 0, 12)),
)

const initialMonth = computed<YearMonth>(() => {
  if (props.modelValue && isValidISODate(props.modelValue)) {
    return monthIndexFromISO(props.modelValue)
  }
  return baseMonth.value
})

const view = ref<YearMonth>({
  year: initialMonth.value.year,
  month: initialMonth.value.month,
})

const monthTitle = computed(() => formatMonthYear(view.value.year, view.value.month))
const cells = computed(() => buildMonthCells(view.value.year, view.value.month))
const today = todayISO()

const canGoPrevious = computed(
  () => compareMonths(view.value, baseMonth.value) > 0,
)
const canGoNext = computed(() => compareMonths(view.value, maxMonth.value) < 0)

function isSelectable(cell: MonthCell): boolean {
  return cell.inMonth && cell.iso >= minDate.value && cell.iso <= maxDate.value
}

const tabbableISO = computed<string | null>(() => {
  const inside = (iso: string | null | undefined) =>
    Boolean(iso) &&
    cells.value.some((cell) => cell.inMonth && cell.iso === iso)

  if (focusedISO.value && inside(focusedISO.value)) return focusedISO.value
  if (props.modelValue && inside(props.modelValue)) return props.modelValue

  const first = cells.value.find(isSelectable)
  return first?.iso ?? null
})

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function dayLabel(cell: MonthCell): string {
  const label = dayFormatter.format(dateFromISO(cell.iso))
  const suffix =
    cell.iso === today
      ? ', hoje'
      : cell.iso === props.modelValue
        ? ', dia escolhido'
        : ''
  return `${label}${suffix}`
}

function select(cell: MonthCell): void {
  if (!isSelectable(cell)) return
  focusedISO.value = cell.iso
  emit('update:modelValue', cell.iso)
}

function changeMonth(offset: number): void {
  if (offset < 0 && !canGoPrevious.value) return
  if (offset > 0 && !canGoNext.value) return

  view.value = shiftMonth(view.value.year, view.value.month, offset)
  focusedISO.value = null
}

async function focusDate(iso: string): Promise<void> {
  await nextTick()
  root.value
    ?.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`)
    ?.focus({ preventScroll: true })
}

async function moveFocus(iso: string, days: number): Promise<void> {
  const date = dateFromISO(iso)
  if (Number.isNaN(date.getTime())) return

  date.setDate(date.getDate() + days)
  const next = toISODate(date)

  if (next < minDate.value || next > maxDate.value) return

  const nextMonth = monthIndexFromISO(next)
  if (compareMonths(nextMonth, view.value) !== 0) {
    view.value = nextMonth
  }

  focusedISO.value = next
  await focusDate(next)
}

async function handleKeydown(event: KeyboardEvent, cell: MonthCell): Promise<void> {
  const date = dateFromISO(cell.iso)
  let delta: number | null = null
  let monthDelta = 0

  switch (event.key) {
    case 'ArrowLeft':
      delta = -1
      break
    case 'ArrowRight':
      delta = 1
      break
    case 'ArrowUp':
      delta = -7
      break
    case 'ArrowDown':
      delta = 7
      break
    case 'Home':
      delta = -date.getDay()
      break
    case 'End':
      delta = 6 - date.getDay()
      break
    case 'PageUp':
      monthDelta = -1
      break
    case 'PageDown':
      monthDelta = 1
      break
    default:
      return
  }

  event.preventDefault()

  if (monthDelta !== 0) {
    const nextMonth = shiftMonth(
      monthIndexFromISO(cell.iso).year,
      monthIndexFromISO(cell.iso).month,
      monthDelta,
    )
    const nextMonthTitle = compareMonths(nextMonth, baseMonth.value)
    const nextMonthEnd = compareMonths(nextMonth, maxMonth.value)

    if (nextMonthTitle < 0 || nextMonthEnd > 0) return

    view.value = nextMonth
    const day = Math.min(
      date.getDate(),
      new Date(nextMonth.year, nextMonth.month + 1, 0, 12).getDate(),
    )
    const next = toISODate(new Date(nextMonth.year, nextMonth.month, day, 12))
    focusedISO.value = next
    await focusDate(next)
    return
  }

  if (delta !== null) {
    await moveFocus(cell.iso, delta)
  }
}

async function focusFirst(): Promise<void> {
  await nextTick()
  const target =
    root.value?.querySelector<HTMLButtonElement>(
      `[data-date="${tabbableISO.value}"]`,
    ) ??
    root.value?.querySelector<HTMLButtonElement>(
      '.date-calendar__day:not(:disabled)',
    )
  target?.focus({ preventScroll: true })
}

defineExpose({ focusFirst })
</script>

<template>
  <div ref="root" class="date-calendar">
    <div class="date-calendar__head">
      <button
        type="button"
        class="date-calendar__nav"
        aria-label="Mês anterior"
        :disabled="!canGoPrevious"
        @click="changeMonth(-1)"
      >
        <ChevronLeft :size="17" aria-hidden="true" />
      </button>

      <p :id="headingId" class="date-calendar__month" aria-live="polite">
        {{ monthTitle }}
      </p>

      <button
        type="button"
        class="date-calendar__nav"
        aria-label="Próximo mês"
        :disabled="!canGoNext"
        @click="changeMonth(1)"
      >
        <ChevronRight :size="17" aria-hidden="true" />
      </button>
    </div>

    <p :id="describedBy" class="sr-only">
      Use as setas para navegar entre os dias, Home e End para ir ao início ou
      fim da semana, e Page Up ou Page Down para trocar de mês.
    </p>

    <div
      class="date-calendar__weekdays"
      aria-hidden="true"
    >
      <span v-for="weekday in WEEKDAY_LABELS" :key="weekday">{{ weekday }}</span>
    </div>

    <div
      class="date-calendar__grid"
      role="group"
      :aria-label="label"
      :aria-describedby="describedBy"
    >
      <template v-for="cell in cells" :key="cell.iso">
        <span
          v-if="!cell.inMonth"
          class="date-calendar__spacer"
          aria-hidden="true"
        />
        <button
          v-else
          type="button"
          class="date-calendar__day"
          :class="{
            'is-selected': cell.iso === modelValue,
            'is-today': cell.iso === today,
          }"
          :data-date="cell.iso"
          :disabled="!isSelectable(cell)"
          :tabindex="tabbableISO === cell.iso ? 0 : -1"
          :aria-label="dayLabel(cell)"
          :aria-pressed="cell.iso === modelValue"
          :aria-current="cell.iso === today ? 'date' : undefined"
          @click="select(cell)"
          @focus="focusedISO = cell.iso"
          @keydown="handleKeydown($event, cell)"
        >
          <span class="date-calendar__number">{{ cell.day }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.date-calendar {
  width: 100%;
}

.date-calendar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.95rem;
}

.date-calendar__month {
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: 1.2rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.date-calendar__nav {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-rose) 20%, var(--c-paper-deep));
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-paper-soft) 70%, transparent);
  color: var(--c-ink-soft);
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft);
}

.date-calendar__nav:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--c-rose) 44%, var(--c-paper-deep));
  background: var(--c-paper-soft);
  color: var(--c-rose-deep);
}

.date-calendar__nav:disabled {
  opacity: 0.32;
}

.date-calendar__weekdays,
.date-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.28rem;
}

.date-calendar__weekdays {
  margin-bottom: 0.4rem;
  color: color-mix(in srgb, var(--c-ink-soft) 78%, transparent);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
}

.date-calendar__spacer {
  min-height: 2.45rem;
}

.date-calendar__day {
  position: relative;
  display: grid;
  min-height: 2.45rem;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--c-ink);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft),
    transform var(--dur-fast) var(--ease-romantic);
}

.date-calendar__number {
  position: relative;
  z-index: 1;
}

.date-calendar__day::after {
  position: absolute;
  bottom: 0.32rem;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--c-rose);
  content: "";
  opacity: 0;
  transform: translateX(-50%);
}

.date-calendar__day.is-today::after {
  opacity: 1;
}

.date-calendar__day:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--c-rose) 26%, transparent);
  background: color-mix(in srgb, var(--c-blush) 56%, transparent);
  color: var(--c-rose-deep);
}

.date-calendar__day:disabled {
  color: color-mix(in srgb, var(--c-ink-soft) 32%, transparent);
  cursor: not-allowed;
}

.date-calendar__day.is-selected {
  border-color: var(--c-rose-deep);
  background: linear-gradient(145deg, var(--c-rose), var(--c-rose-deep));
  box-shadow: 0 8px 18px -12px color-mix(in srgb, var(--c-rose-deep) 88%, transparent);
  color: var(--c-cream);
}

.date-calendar__day.is-selected::after {
  background: color-mix(in srgb, var(--c-cream) 80%, transparent);
}

@media (max-width: 380px) {
  .date-calendar__weekdays,
  .date-calendar__grid {
    gap: 0.15rem;
  }

  .date-calendar__day,
  .date-calendar__spacer {
    min-height: 2.25rem;
  }

  .date-calendar__day {
    font-size: 0.76rem;
  }
}
</style>
