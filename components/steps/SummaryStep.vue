<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircleMore,
  NotebookPen,
  PencilLine,
} from '@lucide/vue'
import { computed } from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { customOptionId, romanticConfig } from '~/config/romantic.config'
import type { FlowStep } from '~/types/date'
import { getDateOptionIcon } from '~/utils/icons'
import { buildPlanSummary } from '~/utils/plan'

const messages = romanticConfig.messages
const copy = useCopy()
const { selections, selectedOption, confirmDate, goTo } = useDateFlow()

const plan = computed(() =>
  buildPlanSummary(
    selections.value,
    romanticConfig.dateOptions,
    customOptionId,
    messages.summaryToCombine,
  ),
)

const programIcon = computed(() =>
  selectedOption.value ? getDateOptionIcon(selectedOption.value.icon) : PencilLine,
)

function editProgram(): void {
  goTo('choose')
}

function editSchedule(): void {
  goTo('schedule')
}

function back(): void {
  goTo('schedule')
}

function handleNavigate(step: FlowStep): void {
  goTo(step)
}
</script>

<template>
  <section class="summary">
    <FloatingHearts tone="light" />

    <div class="summary__inner page-gutter content-wide">
      <header class="summary__header">
        <p class="eyebrow eyebrow--centered summary__eyebrow animate-fade-up">
          {{ messages.summaryEyebrow }}
        </p>

        <AccentTitle
          :text="copy.format(messages.summaryTitle)"
          :accent="copy.format(messages.summaryTitleAccent)"
          as="h1"
          focusable
          class="title-md summary__title animate-fade-up"
          style="animation-delay: 80ms"
        />

        <p class="lede summary__lead animate-fade-up" style="animation-delay: 150ms">
          {{ copy.format(messages.summaryLead) }}
        </p>

        <ProgressIndicator
          class="summary__progress animate-fade-up"
          style="animation-delay: 220ms"
          step="summary"
          @navigate="handleNavigate"
        />
      </header>

      <div class="paper-panel summary__card animate-fade-up" style="animation-delay: 280ms">
        <span class="summary__grain grain-texture" aria-hidden="true" />
        <span class="summary__seal" aria-hidden="true">
          <HeartSeal :size="40" />
        </span>

        <p class="summary__card-eyebrow">O nosso date</p>

        <div class="summary__program">
          <span class="summary__program-icon" :style="{ '--program-accent': selectedOption?.accent ?? 'var(--c-rose)' }" aria-hidden="true">
            <component :is="programIcon" :size="22" :stroke-width="1.7" />
          </span>

          <div class="summary__program-copy">
            <p class="summary__label">{{ messages.summaryProgram }}</p>
            <p class="summary__program-title">{{ plan.program.title }}</p>
            <p v-if="plan.program.isCustom && plan.program.detail" class="summary__quote">
              “{{ plan.program.detail }}”
            </p>
            <p v-else-if="plan.program.detail" class="summary__program-detail">
              {{ plan.program.detail }}
            </p>
          </div>

          <button
            type="button"
            class="summary__edit"
            :aria-label="`${messages.summaryEdit} ${messages.summaryProgram.toLowerCase()}`"
            @click="editProgram"
          >
            <PencilLine :size="13" aria-hidden="true" />
            {{ messages.summaryEdit }}
          </button>
        </div>

        <hr class="hairline summary__rule">

        <dl class="summary__facts">
          <div class="summary__fact">
            <dt class="summary__label">
              <CalendarDays :size="13" aria-hidden="true" />
              {{ messages.summaryDate }}
            </dt>
            <dd class="summary__value" :class="{ 'is-pending': !plan.isScheduled }">
              {{ plan.dateLabel }}
            </dd>
            <button
              type="button"
              class="summary__edit summary__edit--fact"
              :aria-label="`${messages.summaryEdit} ${messages.summaryDate.toLowerCase()}`"
              @click="editSchedule"
            >
              {{ messages.summaryEdit }}
            </button>
          </div>

          <div class="summary__fact">
            <dt class="summary__label">
              <Clock3 :size="13" aria-hidden="true" />
              {{ messages.summaryTime }}
            </dt>
            <dd class="summary__value" :class="{ 'is-pending': !plan.isScheduled }">
              {{ plan.timeLabel }}
            </dd>
            <button
              type="button"
              class="summary__edit summary__edit--fact"
              :aria-label="`${messages.summaryEdit} ${messages.summaryTime.toLowerCase()}`"
              @click="editSchedule"
            >
              {{ messages.summaryEdit }}
            </button>
          </div>
        </dl>

        <div v-if="!plan.isScheduled" class="summary__pending">
          <MessageCircleMore :size="15" aria-hidden="true" />
          <span>{{ messages.summaryToCombineNote }}</span>
        </div>

        <hr class="hairline summary__rule">

        <div class="summary__notes">
          <p class="summary__label">
            <NotebookPen :size="13" aria-hidden="true" />
            {{ messages.summaryNotes }}
          </p>
          <p v-if="plan.notes" class="summary__notes-text">{{ plan.notes }}</p>
          <p v-else class="summary__notes-text is-muted">{{ messages.summaryNone }}</p>
        </div>
      </div>

      <div class="summary__actions animate-fade-up" style="animation-delay: 340ms">
        <p class="summary__note">{{ messages.summaryNote }}</p>

        <BaseButton size="lg" class="summary__confirm" @click="confirmDate">
          {{ messages.summaryConfirm }}
          <template #icon-right>
            <ArrowRight :size="18" />
          </template>
        </BaseButton>

        <BaseButton variant="quiet" type="button" class="summary__back" @click="back">
          <template #icon-left>
            <ArrowLeft :size="15" />
          </template>
          {{ messages.summaryBack }}
        </BaseButton>
      </div>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.summary {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.summary__inner {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-block: clamp(2.3rem, 6vh, 4.2rem) 1.5rem;
}

.summary__header {
  display: flex;
  max-width: 44rem;
  align-items: center;
  flex-direction: column;
  margin-inline: auto;
  text-align: center;
}

.summary__eyebrow {
  margin-bottom: 1.1rem;
}

.summary__title {
  max-width: 38rem;
}

.summary__lead {
  max-width: 34rem;
  margin-top: 0.95rem;
  font-size: 0.98rem;
}

.summary__progress {
  margin-top: 1.35rem;
}

.summary__card {
  max-width: 42rem;
  margin: clamp(1.8rem, 4.5vw, 2.7rem) auto 0;
  padding: clamp(1.4rem, 4vw, 2.3rem);
  overflow: hidden;
}

.summary__grain {
  position: absolute;
  z-index: 0;
  inset: 0;
  pointer-events: none;
}

.summary__seal {
  position: absolute;
  z-index: 1;
  top: 1rem;
  right: 1.1rem;
  transform: rotate(8deg);
}

.summary__card-eyebrow {
  color: var(--c-ink-soft);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.summary__program {
  display: flex;
  align-items: flex-start;
  gap: 0.95rem;
  margin-top: 0.9rem;
  padding-right: 2.6rem;
}

.summary__program-icon {
  display: grid;
  width: 3rem;
  height: 3rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--program-accent) 22%, transparent);
  border-radius: 0.95rem;
  background: color-mix(in srgb, var(--program-accent) 10%, var(--c-paper-soft));
  color: var(--program-accent);
}

.summary__program-copy {
  min-width: 0;
  flex: 1;
}

.summary__label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: color-mix(in srgb, var(--c-ink-soft) 86%, transparent);
  font-size: 0.61rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.4;
  text-transform: uppercase;
}

.summary__program-title {
  margin-top: 0.18rem;
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: clamp(1.45rem, 3.4vw, 1.9rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.1;
}

.summary__program-detail {
  margin-top: 0.3rem;
  color: var(--c-ink-soft);
  font-size: 0.85rem;
  line-height: 1.55;
  text-wrap: pretty;
}

.summary__quote {
  margin-top: 0.4rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-hand);
  font-size: 1.32rem;
  font-weight: 500;
  line-height: 1.2;
  text-wrap: pretty;
}

.summary__edit {
  display: inline-flex;
  min-height: 2.4rem;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.3rem;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: color-mix(in srgb, var(--c-ink-soft) 82%, transparent);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft);
}

.summary__edit:hover {
  border-color: color-mix(in srgb, var(--c-rose) 45%, transparent);
  color: var(--c-rose-deep);
}

.summary__rule {
  margin-block: 1.25rem;
}

.summary__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.summary__fact {
  position: relative;
  padding: 0.85rem 0.95rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 13%, var(--c-paper-deep));
  border-radius: 1rem;
  background: color-mix(in srgb, var(--c-paper-soft) 54%, transparent);
}

.summary__value {
  margin: 0.28rem 0 0;
  padding-right: 3.2rem;
  color: var(--c-ink);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.4;
}

.summary__value.is-pending {
  color: var(--c-rose-deep);
}

.summary__edit--fact {
  position: absolute;
  right: 0.45rem;
  bottom: 0.42rem;
  padding-inline: 0.25rem;
  font-size: 0.64rem;
}

.summary__pending {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.75rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.8rem;
  background: color-mix(in srgb, var(--c-blush) 48%, transparent);
  color: var(--c-rose-deep);
  font-size: 0.76rem;
  font-weight: 700;
}

.summary__notes {
  min-height: 3.6rem;
}

.summary__notes-text {
  margin-top: 0.3rem;
  color: var(--c-ink);
  font-size: 0.9rem;
  line-height: 1.65;
  white-space: pre-line;
  text-wrap: pretty;
}

.summary__notes-text.is-muted {
  color: color-mix(in srgb, var(--c-ink-soft) 72%, transparent);
  font-style: italic;
}

.summary__actions {
  display: flex;
  max-width: 42rem;
  align-items: center;
  flex-direction: column;
  gap: 0.6rem;
  margin: 1.5rem auto 0;
  text-align: center;
}

.summary__note {
  max-width: 32rem;
  color: color-mix(in srgb, var(--c-ink-soft) 84%, transparent);
  font-size: 0.76rem;
  line-height: 1.55;
}

.summary__confirm {
  min-width: 16rem;
}

.summary__back {
  margin-top: 0.1rem;
}

@media (max-width: 560px) {
  .summary__inner {
    padding-block: 1.7rem 1rem;
  }

  .summary__eyebrow {
    margin-bottom: 0.9rem;
  }

  .summary__lead {
    font-size: 0.95rem;
  }

  .summary__program {
    padding-right: 0;
  }

  .summary__edit {
    margin-left: auto;
  }

  .summary__program-icon {
    width: 2.6rem;
    height: 2.6rem;
  }

  .summary__facts {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary__value {
    padding-right: 3.4rem;
  }

  .summary__confirm {
    width: 100%;
    min-width: 0;
  }
}
</style>
