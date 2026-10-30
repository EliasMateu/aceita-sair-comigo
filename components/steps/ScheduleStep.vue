<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleAlert,
  Clock3,
  MessageCircleMore,
  NotebookPen,
} from '@lucide/vue'
import { computed, nextTick, ref } from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'
import type { FlowStep } from '~/types/date'
import { formatTimeLabel, todayISO } from '~/utils/date'

const messages = romanticConfig.messages
const schedule = romanticConfig.schedule
const copy = useCopy()
const { selections, setDate, setTime, setNotes, setCombineLater, goTo } =
  useDateFlow()

const formRef = ref<HTMLFormElement | null>(null)
const calendarRef = ref<{ focusFirst: () => Promise<void> } | null>(null)
const timeFieldsetRef = ref<HTMLFieldSetElement | null>(null)
const notesRef = ref<HTMLTextAreaElement | null>(null)
const dateError = ref('')
const timeError = ref('')

const today = todayISO()
const notesLength = computed(() => selections.value.notes.length)
const mode = computed<'date' | 'later'>(() =>
  selections.value.combineLater ? 'later' : 'date',
)

function handleModeChange(value: 'date' | 'later'): void {
  setCombineLater(value === 'later')
  dateError.value = ''
  timeError.value = ''

  if (value === 'date' && !selections.value.time && schedule.defaultTime) {
    setTime(schedule.defaultTime)
  }
}

async function handleDate(iso: string): Promise<void> {
  setDate(iso)
  dateError.value = ''

  if (!selections.value.time && schedule.defaultTime) {
    setTime(schedule.defaultTime)
    timeError.value = ''
  }

  await nextTick()
}

function handleTime(time: string): void {
  setTime(time)
  timeError.value = ''
}

async function submit(): Promise<void> {
  dateError.value = ''
  timeError.value = ''

  if (!selections.value.combineLater) {
    if (!selections.value.date) {
      dateError.value = messages.scheduleErrorDate
      await nextTick()
      await calendarRef.value?.focusFirst()
      return
    }

    if (!selections.value.time) {
      timeError.value = messages.scheduleErrorTime
      await nextTick()
      timeFieldsetRef.value
        ?.querySelector<HTMLInputElement>('input[name="date-time"]')
        ?.focus({ preventScroll: true })
      return
    }
  }

  goTo('summary')
}

async function goBack(): Promise<void> {
  goTo('choose')
}

function handleNavigate(step: FlowStep): void {
  goTo(step)
}
</script>

<template>
  <section class="schedule">
    <FloatingHearts tone="light" />

    <div class="schedule__inner page-gutter content-wide">
      <header class="schedule__header">
        <p class="eyebrow eyebrow--centered schedule__eyebrow animate-fade-up">
          {{ messages.scheduleEyebrow }}
        </p>

        <AccentTitle
          :text="copy.format(messages.scheduleTitle)"
          :accent="copy.format(messages.scheduleTitleAccent)"
          as="h1"
          focusable
          class="title-md schedule__title animate-fade-up"
          style="animation-delay: 80ms"
        />

        <p class="lede schedule__lead animate-fade-up" style="animation-delay: 150ms">
          {{ copy.format(messages.scheduleLead) }}
        </p>

        <ProgressIndicator
          class="schedule__progress animate-fade-up"
          style="animation-delay: 220ms"
          step="schedule"
          @navigate="handleNavigate"
        />
      </header>

      <form
        ref="formRef"
        class="schedule__form animate-fade-up"
        style="animation-delay: 280ms"
        novalidate
        @submit.prevent="submit"
      >
        <fieldset class="schedule__mode">
          <legend class="sr-only">Como você prefere escolher o dia?</legend>

          <div class="schedule__mode-grid">
            <label
              class="mode-card"
              :class="{ 'is-selected': mode === 'date' }"
            >
              <input
                class="mode-card__input"
                type="radio"
                name="schedule-mode"
                value="date"
                :checked="mode === 'date'"
                @change="handleModeChange('date')"
              />
              <span class="mode-card__icon" aria-hidden="true">
                <CalendarDays :size="19" :stroke-width="1.8" />
              </span>
              <span class="mode-card__copy">
                <span class="mode-card__title">{{ messages.scheduleModeDate }}</span>
                <span class="mode-card__hint">{{ messages.scheduleModeDateHint }}</span>
              </span>
            </label>

            <label
              class="mode-card"
              :class="{ 'is-selected': mode === 'later' }"
            >
              <input
                class="mode-card__input"
                type="radio"
                name="schedule-mode"
                value="later"
                :checked="mode === 'later'"
                @change="handleModeChange('later')"
              />
              <span class="mode-card__icon" aria-hidden="true">
                <MessageCircleMore :size="19" :stroke-width="1.8" />
              </span>
              <span class="mode-card__copy">
                <span class="mode-card__title">{{ messages.scheduleModeLater }}</span>
                <span class="mode-card__hint">{{ messages.scheduleModeLaterHint }}</span>
              </span>
            </label>
          </div>
        </fieldset>

        <Transition name="schedule-panel" mode="out-in">
          <div v-if="mode === 'date'" key="date" class="schedule__date-layout">
            <div class="paper-panel schedule__calendar-panel">
              <DateCalendar
                ref="calendarRef"
                :model-value="selections.date"
                :min-date="today"
                :max-months-ahead="schedule.maxMonthsAhead"
                :label="messages.scheduleDateLabel"
                @update:model-value="handleDate"
              />

              <p
                v-if="dateError"
                id="schedule-date-error"
                class="field-error schedule__date-error"
                role="alert"
              >
                <CircleAlert :size="14" aria-hidden="true" />
                {{ dateError }}
              </p>
            </div>

            <div class="paper-panel schedule__time-panel">
              <fieldset ref="timeFieldsetRef" class="schedule__time-fieldset">
                <legend class="field-label schedule__time-label">
                  <Clock3 :size="13" aria-hidden="true" />
                  {{ messages.scheduleTimeLabel }}
                </legend>

                <div class="schedule__time-grid">
                  <label
                    v-for="slot in schedule.timeSlots"
                    :key="slot"
                    class="time-chip"
                    :class="{ 'is-selected': selections.time === slot }"
                  >
                    <input
                      class="time-chip__input"
                      type="radio"
                      name="date-time"
                      :value="slot"
                      :checked="selections.time === slot"
                      @change="handleTime(slot)"
                    />
                    {{ formatTimeLabel(slot) }}
                  </label>
                </div>

                <p class="schedule__time-hint">
                  {{ messages.scheduleTimeHint }}
                </p>

                <p
                  v-if="timeError"
                  id="schedule-time-error"
                  class="field-error schedule__time-error"
                  role="alert"
                >
                  <CircleAlert :size="14" aria-hidden="true" />
                  {{ timeError }}
                </p>
              </fieldset>
            </div>
          </div>

          <div v-else key="later" class="paper-panel schedule__later">
            <span class="schedule__later-seal" aria-hidden="true">
              <HeartSeal :size="44" />
            </span>
            <p class="hand-note schedule__later-eyebrow">
              {{ messages.scheduleModeLater }}
            </p>
            <h2 class="schedule__later-title">{{ messages.scheduleLaterTitle }}</h2>
            <p class="schedule__later-text">{{ messages.scheduleLaterText }}</p>
          </div>
        </Transition>

        <div class="paper-panel paper-panel--plain schedule__notes">
          <label for="schedule-notes" class="field-label schedule__notes-label">
            <NotebookPen :size="13" aria-hidden="true" />
            {{ messages.scheduleNotesLabel }}
          </label>

          <textarea
            id="schedule-notes"
            ref="notesRef"
            class="field-textarea schedule__notes-input"
            :value="selections.notes"
            :placeholder="messages.scheduleNotesPlaceholder"
            maxlength="600"
            rows="3"
            @input="setNotes(($event.target as HTMLTextAreaElement).value)"
          />

          <div class="schedule__notes-foot">
            <p class="schedule__notes-hint">
              {{ messages.scheduleSavedNote }}
            </p>
            <span class="schedule__notes-count">{{ notesLength }}/600</span>
          </div>
        </div>

        <div class="schedule__actions">
          <BaseButton variant="quiet" type="button" class="schedule__back" @click="goBack">
            <template #icon-left>
              <ArrowLeft :size="15" />
            </template>
            {{ messages.scheduleBack }}
          </BaseButton>

          <BaseButton type="submit" size="lg" class="schedule__continue">
            {{ messages.scheduleContinue }}
            <template #icon-right>
              <ArrowRight :size="18" />
            </template>
          </BaseButton>
        </div>
      </form>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.schedule {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.schedule__inner {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-block: clamp(2.3rem, 6vh, 4.2rem) 1.5rem;
}

.schedule__header {
  display: flex;
  max-width: 44rem;
  align-items: center;
  flex-direction: column;
  margin-inline: auto;
  text-align: center;
}

.schedule__eyebrow {
  margin-bottom: 1.1rem;
}

.schedule__title {
  max-width: 38rem;
}

.schedule__lead {
  max-width: 34rem;
  margin-top: 0.95rem;
  font-size: 0.98rem;
}

.schedule__progress {
  margin-top: 1.35rem;
}

.schedule__form {
  width: 100%;
  max-width: 62rem;
  margin: clamp(1.8rem, 4.5vw, 2.7rem) auto 0;
}

.schedule__mode {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.schedule__mode-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  max-width: 40rem;
  margin-inline: auto;
}

.mode-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 18%, var(--c-paper-deep));
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--c-paper-soft) 64%, transparent);
  cursor: pointer;
  transition:
    border-color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft),
    box-shadow var(--dur-base) var(--ease-soft);
}

.mode-card__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.mode-card__icon {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--c-paper-deep) 62%, transparent);
  color: var(--c-ink-soft);
  transition:
    color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft);
}

.mode-card__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.06rem;
}

.mode-card__title {
  color: var(--c-ink);
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.3;
}

.mode-card__hint {
  color: color-mix(in srgb, var(--c-ink-soft) 86%, transparent);
  font-size: 0.68rem;
  line-height: 1.4;
}

.mode-card:has(.mode-card__input:focus-visible) {
  outline: 2px solid var(--c-rose-deep);
  outline-offset: 3px;
}

.mode-card.is-selected {
  border-color: color-mix(in srgb, var(--c-rose) 52%, var(--c-paper-deep));
  background: color-mix(in srgb, var(--c-blush) 46%, var(--c-paper-soft));
  box-shadow: 0 12px 26px -24px color-mix(in srgb, var(--c-rose-deep) 54%, transparent);
}

.mode-card.is-selected .mode-card__icon {
  background: var(--c-rose-deep);
  color: var(--c-cream);
}

.schedule__date-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 1rem;
  margin-top: 1rem;
}

.schedule__calendar-panel,
.schedule__time-panel {
  padding: clamp(1.05rem, 2.4vw, 1.45rem);
}

.schedule__time-fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.schedule__time-label,
.schedule__notes-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--c-rose-deep);
}

.schedule__time-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
}

.time-chip {
  position: relative;
  display: grid;
  min-height: 2.55rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-rose) 18%, var(--c-paper-deep));
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--c-paper-soft) 74%, transparent);
  color: var(--c-ink);
  cursor: pointer;
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft),
    transform var(--dur-fast) var(--ease-romantic);
}

.time-chip__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.time-chip:has(.time-chip__input:focus-visible) {
  outline: 2px solid var(--c-rose-deep);
  outline-offset: 2px;
}

.time-chip:hover {
  border-color: color-mix(in srgb, var(--c-rose) 40%, var(--c-paper-deep));
  background: color-mix(in srgb, var(--c-blush) 40%, var(--c-paper-soft));
  color: var(--c-rose-deep);
}

.time-chip.is-selected {
  border-color: var(--c-rose-deep);
  background: linear-gradient(145deg, var(--c-rose), var(--c-rose-deep));
  box-shadow: 0 8px 18px -14px color-mix(in srgb, var(--c-rose-deep) 78%, transparent);
  color: var(--c-cream);
}

.schedule__time-hint {
  margin-top: 0.85rem;
  color: color-mix(in srgb, var(--c-ink-soft) 84%, transparent);
  font-size: 0.74rem;
  line-height: 1.55;
}

.schedule__date-error,
.schedule__time-error {
  margin-top: 0.65rem;
}

.schedule__later {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1rem;
  padding: clamp(1.6rem, 4vw, 2.4rem);
  text-align: center;
}

.schedule__later-seal {
  margin-bottom: 0.2rem;
  animation: float-soft 7s ease-in-out infinite;
}

.schedule__later-eyebrow {
  color: var(--c-rose-deep);
  font-size: 1.3rem;
}

.schedule__later-title {
  font-size: clamp(1.5rem, 3.4vw, 2.15rem);
  font-weight: 500;
  line-height: 1.1;
}

.schedule__later-text {
  max-width: 34rem;
  margin-top: 0.25rem;
  color: var(--c-ink-soft);
  font-size: 0.93rem;
  line-height: 1.7;
  text-wrap: pretty;
}

.schedule__notes {
  margin-top: 1rem;
  padding: clamp(1.05rem, 2.4vw, 1.45rem);
  border-radius: 1.3rem;
}

.schedule__notes-input {
  min-height: 5.4rem;
}

.schedule__notes-foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.55rem;
}

.schedule__notes-hint {
  color: color-mix(in srgb, var(--c-ink-soft) 78%, transparent);
  font-size: 0.7rem;
  line-height: 1.5;
}

.schedule__notes-count {
  margin-left: auto;
  color: color-mix(in srgb, var(--c-ink-soft) 68%, transparent);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;
}

.schedule__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: clamp(1.5rem, 4vw, 2.1rem);
}

.schedule__back {
  flex: 0 0 auto;
}

.schedule__continue {
  min-width: 15rem;
}

.schedule-panel-enter-active,
.schedule-panel-leave-active {
  transition:
    opacity 280ms var(--ease-soft),
    transform 280ms var(--ease-romantic);
}

.schedule-panel-enter-from,
.schedule-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 860px) {
  .schedule__date-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .schedule__time-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .schedule__inner {
    padding-block: 1.7rem 1rem;
  }

  .schedule__eyebrow {
    margin-bottom: 0.9rem;
  }

  .schedule__lead {
    font-size: 0.95rem;
  }

  .schedule__mode-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.55rem;
  }

  .mode-card {
    padding: 0.75rem 0.9rem;
  }

  .schedule__time-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .schedule__actions {
    align-items: stretch;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .schedule__continue {
    width: 100%;
    min-width: 0;
  }

  .schedule__back {
    align-self: center;
  }

  .schedule__notes-foot {
    gap: 0.5rem;
  }
}
</style>
