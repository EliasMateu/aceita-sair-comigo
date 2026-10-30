<script setup lang="ts">
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Clock3,
  Download,
  MessageCircle,
  NotebookPen,
  RotateCcw,
} from '@lucide/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { customOptionId, romanticConfig } from '~/config/romantic.config'
import { buildCountdown } from '~/utils/date'
import { getDateOptionIcon } from '~/utils/icons'
import { buildPlanSummary } from '~/utils/plan'
import {
  buildGoogleCalendarUrl,
  buildIcsEvent,
  buildIcsFilename,
  type CalendarEventInput,
} from '~/utils/calendar'
import { zonedDateTimeToUtc } from '~/utils/timezone'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '~/utils/whatsapp'

const emit = defineEmits<{
  restart: []
}>()

const messages = romanticConfig.messages
const calendarSettings = romanticConfig.calendar
const copy = useCopy()
const { selections, selectedOption, goTo } = useDateFlow()

const now = ref(new Date())
let countdownTimer: ReturnType<typeof setInterval> | null = null

const plan = computed(() =>
  buildPlanSummary(
    selections.value,
    romanticConfig.dateOptions,
    customOptionId,
    messages.summaryToCombine,
  ),
)

const programIcon = computed(() =>
  selectedOption.value
    ? getDateOptionIcon(selectedOption.value.icon)
    : CalendarDays,
)

const whatsappMessage = computed(() =>
  buildWhatsAppMessage({
    copy: {
      greeting: messages.whatsappGreeting,
      intro: messages.whatsappIntro,
      programLabel: messages.whatsappProgramLabel,
      customLabel: messages.whatsappCustomLabel,
      dateLabel: messages.whatsappDateLabel,
      timeLabel: messages.whatsappTimeLabel,
      notesLabel: messages.whatsappNotesLabel,
      closing: messages.whatsappClosing,
    },
    plan: plan.value,
  }),
)

const whatsappUrl = computed(() =>
  buildWhatsAppUrl(romanticConfig.whatsappNumber, whatsappMessage.value),
)

const calendarDescription = computed(() => {
  const lines: string[] = []

  if (plan.value.program.title) {
    lines.push(`${messages.summaryProgram}: ${plan.value.program.title}`)
  }

  if (plan.value.program.isCustom && plan.value.program.detail) {
    lines.push(`${messages.summaryCustomIdea}: ${plan.value.program.detail}`)
  }

  if (plan.value.notes) {
    lines.push(`${messages.summaryNotes}: ${plan.value.notes}`)
  }

  lines.push(messages.finaleSubmessage)

  return lines.join('\n')
})

const calendarEvent = computed<CalendarEventInput | null>(() => {
  const { date, time } = selections.value

  if (!plan.value.isScheduled || !date || !time) return null

  return {
    title: calendarSettings.title,
    description: calendarDescription.value,
    location: calendarSettings.location,
    date,
    time,
    timeZone: calendarSettings.timeZone,
    durationMinutes: calendarSettings.defaultDurationMinutes,
  }
})

const googleCalendarUrl = computed(() =>
  calendarEvent.value ? buildGoogleCalendarUrl(calendarEvent.value) : null,
)

const countdownTarget = computed(() => {
  const { date, time } = selections.value
  if (!plan.value.isScheduled || !date || !time) return null
  return zonedDateTimeToUtc(date, time, calendarSettings.timeZone)
})

const countdown = computed(() =>
  countdownTarget.value
    ? buildCountdown(countdownTarget.value, now.value)
    : null,
)

const signature = computed(() =>
  romanticConfig.senderName.trim()
    ? copy.format(messages.finaleSignature)
    : 'com carinho.',
)

function downloadIcs(): void {
  if (!calendarEvent.value) return

  const content = buildIcsEvent(calendarEvent.value)
  if (!content) return

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = buildIcsFilename(selections.value.date)
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function editPlan(): void {
  goTo('summary')
}

onMounted(() => {
  countdownTimer = setInterval(() => {
    now.value = new Date()
  }, 30_000)
})

onBeforeUnmount(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>

<template>
  <section class="finale">
    <FloatingHearts tone="light" />
    <CelebrationConfetti :pieces="34" />

    <span class="finale__halo" aria-hidden="true" />

    <div class="finale__inner page-gutter">
      <header class="finale__header">
        <div class="finale__seal animate-seal-pop" aria-hidden="true">
          <HeartSeal :size="46" />
        </div>

        <p class="eyebrow eyebrow--centered finale__eyebrow animate-fade-up">
          {{ messages.finaleEyebrow }}
        </p>

        <AccentTitle
          :text="copy.format(messages.finaleTitle)"
          :accent="copy.format(messages.finaleTitleAccent)"
          as="h1"
          focusable
          class="title-lg finale__title animate-fade-up"
          style="animation-delay: 80ms"
        />

        <p class="finale__message animate-fade-up" style="animation-delay: 160ms">
          {{ copy.format(messages.finaleMessage) }}
        </p>

        <p class="finale__submessage animate-fade-up" style="animation-delay: 220ms">
          {{ copy.format(messages.finaleSubmessage) }}
        </p>
      </header>

      <div class="paper-panel finale__ticket animate-fade-up" style="animation-delay: 300ms">
        <div class="finale__ticket-head">
          <span
            class="finale__program-icon"
            :style="{ '--program-accent': selectedOption?.accent ?? 'var(--c-rose)' }"
            aria-hidden="true"
          >
            <component :is="programIcon" :size="22" :stroke-width="1.7" />
          </span>

          <div class="finale__program-copy">
            <p class="finale__label">{{ messages.summaryProgram }}</p>
            <p class="finale__program-title">{{ plan.program.title }}</p>
            <p v-if="plan.program.isCustom && plan.program.detail" class="finale__quote">
              “{{ plan.program.detail }}”
            </p>
          </div>
        </div>

        <hr class="hairline finale__rule">

        <div v-if="plan.isScheduled" class="finale__when">
          <div class="finale__when-item">
            <CalendarDays :size="15" aria-hidden="true" />
            <span>{{ plan.dateLabel }}</span>
          </div>
          <div class="finale__when-item">
            <Clock3 :size="15" aria-hidden="true" />
            <span>{{ plan.timeLabel }}</span>
          </div>
        </div>

        <div v-else class="finale__undecided">
          <MessageCircle :size="17" aria-hidden="true" />
          <div>
            <p class="finale__undecided-title">{{ messages.finaleNoDateTitle }}</p>
            <p class="finale__undecided-text">{{ messages.finaleNoDateText }}</p>
          </div>
        </div>

        <div v-if="plan.notes" class="finale__notes">
          <p class="finale__label">
            <NotebookPen :size="12" aria-hidden="true" />
            {{ messages.summaryNotes }}
          </p>
          <p class="finale__notes-text">{{ plan.notes }}</p>
        </div>
      </div>

      <div v-if="countdown" class="finale__countdown animate-fade-up" style="animation-delay: 360ms">
        <p class="finale__countdown-label">{{ messages.countdownLabel }}</p>

        <p v-if="countdown.isPast" class="finale__countdown-state">
          {{ messages.countdownPast }}
        </p>

        <template v-else>
          <p v-if="countdown.isToday" class="finale__countdown-state">
            {{ messages.countdownToday }}
          </p>

          <div
            class="finale__countdown-grid"
            :class="{ 'is-compact': countdown.isToday }"
            role="timer"
            :aria-label="`${messages.countdownLabel}: ${countdown.days} ${messages.countdownDays}, ${countdown.hours} ${messages.countdownHours}, ${countdown.minutes} ${messages.countdownMinutes}`"
          >
            <div v-if="!countdown.isToday" class="finale__countdown-unit">
              <strong>{{ countdown.days }}</strong>
              <span>{{ messages.countdownDays }}</span>
            </div>
            <div class="finale__countdown-unit">
              <strong>{{ countdown.hours }}</strong>
              <span>{{ messages.countdownHours }}</span>
            </div>
            <div class="finale__countdown-unit">
              <strong>{{ countdown.minutes }}</strong>
              <span>{{ messages.countdownMinutes }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="finale__actions animate-fade-up" style="animation-delay: 420ms">
        <BaseButton
          v-if="whatsappUrl"
          as="a"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          class="finale__whatsapp"
        >
          <template #icon-left>
            <MessageCircle :size="18" />
          </template>
          {{ messages.finaleWhatsApp }}
        </BaseButton>

        <p class="finale__hint">{{ messages.finaleWhatsAppHint }}</p>

        <template v-if="plan.isScheduled">
          <div class="finale__calendar-actions">
            <BaseButton
              v-if="googleCalendarUrl"
              as="a"
              variant="secondary"
              size="md"
              :href="googleCalendarUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <template #icon-left>
                <CalendarPlus :size="16" />
              </template>
              {{ messages.finaleGoogle }}
            </BaseButton>

            <BaseButton variant="secondary" size="md" @click="downloadIcs">
              <template #icon-left>
                <Download :size="16" />
              </template>
              {{ messages.finaleIcs }}
            </BaseButton>
          </div>

          <p class="finale__hint finale__hint--calendar">
            {{ messages.finaleCalendarHint }}
          </p>
        </template>

        <div class="finale__secondary-actions">
          <BaseButton variant="quiet" type="button" @click="editPlan">
            <template #icon-left>
              <ArrowLeft :size="15" />
            </template>
            {{ messages.finaleEdit }}
          </BaseButton>

          <BaseButton variant="quiet" type="button" @click="emit('restart')">
            <template #icon-left>
              <RotateCcw :size="14" />
            </template>
            {{ messages.finaleRestart }}
          </BaseButton>
        </div>
      </div>

      <div class="paper-panel paper-panel--plain finale__letter animate-fade-up" style="animation-delay: 480ms">
        <p class="finale__ps-label">{{ messages.finalePsLabel }}</p>
        <p class="hand-note finale__ps">{{ copy.format(messages.finalePs) }}</p>
        <p class="finale__signature">{{ signature }}</p>
      </div>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.finale {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
}

.finale__halo {
  position: absolute;
  z-index: 0;
  top: -8rem;
  left: 50%;
  width: min(110vw, 70rem);
  height: 32rem;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--c-blush) 82%, transparent) 0%,
    transparent 66%
  );
  filter: blur(22px);
  opacity: 0.8;
  transform: translateX(-50%);
  pointer-events: none;
}

.finale__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--content-narrow);
  flex: 1;
  margin-inline: auto;
  padding-block: clamp(2.4rem, 7vh, 4.6rem) 2rem;
}

.finale__header {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.finale__seal {
  margin-bottom: 1.05rem;
}

.finale__eyebrow {
  margin-bottom: 1rem;
}

.finale__title {
  max-width: 34rem;
}

.finale__message {
  max-width: 33rem;
  margin-top: 1rem;
  color: var(--c-ink-soft);
  font-size: clamp(0.98rem, 0.92rem + 0.3vw, 1.1rem);
  line-height: 1.7;
  text-wrap: pretty;
}

.finale__submessage {
  max-width: 30rem;
  margin-top: 0.4rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-hand);
  font-size: clamp(1.3rem, 1.1rem + 0.8vw, 1.6rem);
  font-weight: 500;
  line-height: 1.2;
}

.finale__ticket {
  margin-top: clamp(1.7rem, 4vw, 2.4rem);
  padding: clamp(1.2rem, 3.2vw, 1.7rem);
}

.finale__ticket-head {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}

.finale__program-icon {
  display: grid;
  width: 2.9rem;
  height: 2.9rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--program-accent) 22%, transparent);
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--program-accent) 10%, var(--c-paper-soft));
  color: var(--program-accent);
}

.finale__program-copy {
  min-width: 0;
}

.finale__label {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  color: color-mix(in srgb, var(--c-ink-soft) 82%, transparent);
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.4;
  text-transform: uppercase;
}

.finale__program-title {
  margin-top: 0.16rem;
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: clamp(1.3rem, 3vw, 1.65rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.12;
}

.finale__quote {
  margin-top: 0.28rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-hand);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
}

.finale__rule {
  margin-block: 1.05rem;
}

.finale__when {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.finale__when-item {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.5rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 14%, var(--c-paper-deep));
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-paper-soft) 56%, transparent);
  color: var(--c-ink);
  font-size: 0.82rem;
  font-weight: 700;
}

.finale__when-item svg {
  color: var(--c-rose-deep);
}

.finale__undecided {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.8rem 0.9rem;
  border: 1px dashed color-mix(in srgb, var(--c-rose) 32%, var(--c-paper-deep));
  border-radius: 0.95rem;
  background: color-mix(in srgb, var(--c-blush) 34%, transparent);
  color: var(--c-rose-deep);
}

.finale__undecided svg {
  flex: 0 0 auto;
  margin-top: 0.16rem;
}

.finale__undecided-title {
  font-size: 0.83rem;
  font-weight: 800;
  line-height: 1.4;
}

.finale__undecided-text {
  margin-top: 0.12rem;
  color: color-mix(in srgb, var(--c-ink-soft) 88%, transparent);
  font-size: 0.76rem;
  line-height: 1.5;
}

.finale__notes {
  margin-top: 0.95rem;
  padding-top: 0.85rem;
  border-top: 1px solid color-mix(in srgb, var(--c-rose) 12%, transparent);
}

.finale__notes-text {
  margin-top: 0.2rem;
  color: var(--c-ink-soft);
  font-size: 0.85rem;
  line-height: 1.55;
  white-space: pre-line;
}

.finale__countdown {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 13%, var(--c-paper-deep));
  border-radius: 1.25rem;
  background: color-mix(in srgb, var(--c-paper-soft) 48%, transparent);
  text-align: center;
}

.finale__countdown-label {
  color: color-mix(in srgb, var(--c-ink-soft) 82%, transparent);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.finale__countdown-state {
  margin-top: 0.3rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-hand);
  font-size: 1.45rem;
  font-weight: 500;
  line-height: 1.2;
}

.finale__countdown-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  max-width: 24rem;
  margin: 0.7rem auto 0;
}

.finale__countdown-grid.is-compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: 16rem;
}

.finale__countdown-unit {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.08rem;
  padding: 0.55rem 0.4rem;
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--c-blush) 44%, transparent);
}

.finale__countdown-unit strong {
  color: var(--c-rose-deep);
  font-family: var(--ff-display);
  font-size: 1.55rem;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  line-height: 1;
}

.finale__countdown-unit span {
  color: var(--c-ink-soft);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.finale__actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: clamp(1.5rem, 4vw, 2.1rem);
  text-align: center;
}

.finale__whatsapp {
  width: 100%;
  max-width: 22rem;
}

.finale__hint {
  max-width: 29rem;
  color: color-mix(in srgb, var(--c-ink-soft) 86%, transparent);
  font-size: 0.74rem;
  line-height: 1.55;
}

.finale__calendar-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.55rem;
}

.finale__hint--calendar {
  font-size: 0.7rem;
}

.finale__secondary-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.35rem 1rem;
  margin-top: 0.45rem;
}

.finale__letter {
  margin-top: clamp(1.7rem, 4vw, 2.4rem);
  padding: clamp(1.2rem, 3.2vw, 1.7rem);
  text-align: left;
}

.finale__ps-label {
  color: var(--c-rose-deep);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.finale__ps {
  margin-top: 0.35rem;
  color: var(--c-ink);
  font-size: clamp(1.4rem, 1.2rem + 0.8vw, 1.7rem);
  line-height: 1.18;
}

.finale__signature {
  margin-top: 0.65rem;
  color: var(--c-ink-soft);
  font-family: var(--ff-hand);
  font-size: 1.18rem;
  text-align: right;
}

@media (min-width: 900px) {
  .finale__inner {
    max-width: 52rem;
  }
}

@media (max-width: 560px) {
  .finale__inner {
    padding-block: 1.8rem 1.2rem;
  }

  .finale__ticket-head {
    gap: 0.7rem;
  }

  .finale__program-icon {
    width: 2.55rem;
    height: 2.55rem;
  }

  .finale__calendar-actions {
    width: 100%;
    flex-direction: column;
  }

  .finale__calendar-actions :deep(.base-btn) {
    width: 100%;
  }
}
</style>
