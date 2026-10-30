<script setup lang="ts">
import { ArrowRight, CircleAlert, PenLine } from '@lucide/vue'
import { computed, nextTick, ref } from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'
import type { FlowStep } from '~/types/date'

const messages = romanticConfig.messages
const copy = useCopy()
const { selections, isCustomOption, chooseOption, setCustomIdea, goTo } =
  useDateFlow()

const formRef = ref<HTMLFormElement | null>(null)
const customFieldRef = ref<HTMLTextAreaElement | null>(null)
const optionError = ref('')
const customError = ref('')

const customLength = computed(() => selections.value.customIdea.length)

function handleSelect(optionId: string): void {
  chooseOption(optionId)
  optionError.value = ''
  customError.value = ''
}

function handleCustomInput(event: Event): void {
  const value = (event.target as HTMLTextAreaElement).value
  setCustomIdea(value)

  if (value.trim()) {
    customError.value = ''
  }
}

async function focusFirstOption(): Promise<void> {
  await nextTick()
  formRef.value
    ?.querySelector<HTMLInputElement>('input[name="date-option"]')
    ?.focus({ preventScroll: true })
}

async function submit(): Promise<void> {
  optionError.value = ''
  customError.value = ''

  if (!selections.value.optionId) {
    optionError.value = messages.chooseErrorOption
    await focusFirstOption()
    return
  }

  if (isCustomOption.value && !selections.value.customIdea.trim()) {
    customError.value = messages.chooseCustomError
    await nextTick()
    customFieldRef.value?.focus({ preventScroll: true })
    return
  }

  goTo('schedule')
}

function handleNavigate(step: FlowStep): void {
  goTo(step)
}
</script>

<template>
  <section class="choose">
    <FloatingHearts tone="light" />

    <div class="choose__inner page-gutter content-wide">
      <header class="choose__header">
        <p class="eyebrow eyebrow--centered choose__eyebrow animate-fade-up">
          {{ messages.chooseEyebrow }}
        </p>

        <AccentTitle
          :text="copy.format(messages.chooseTitle)"
          :accent="copy.format(messages.chooseTitleAccent)"
          as="h1"
          focusable
          class="title-md choose__title animate-fade-up"
          style="animation-delay: 80ms"
        />

        <p class="lede choose__lead animate-fade-up" style="animation-delay: 150ms">
          {{ copy.format(messages.chooseLead) }}
        </p>

        <ProgressIndicator
          class="choose__progress animate-fade-up"
          style="animation-delay: 220ms"
          step="choose"
          @navigate="handleNavigate"
        />
      </header>

      <form
        ref="formRef"
        class="choose__form animate-fade-up"
        style="animation-delay: 280ms"
        novalidate
        @submit.prevent="submit"
      >
        <fieldset class="choose__fieldset">
          <legend class="sr-only">{{ messages.chooseTitle }}</legend>

          <ul class="choose__grid">
            <li
              v-for="option in romanticConfig.dateOptions"
              :key="option.id"
              class="choose__item"
            >
              <DateOptionCard
                :option="option"
                :selected="selections.optionId === option.id"
                @select="handleSelect"
              />
            </li>
          </ul>
        </fieldset>

        <Transition name="custom-field">
          <div v-if="isCustomOption" class="paper-panel choose__custom">
            <label for="choose-custom-idea" class="field-label choose__custom-label">
              <PenLine :size="13" aria-hidden="true" />
              {{ messages.chooseCustomLabel }}
            </label>

            <textarea
              id="choose-custom-idea"
              ref="customFieldRef"
              class="field-textarea choose__custom-input"
              :value="selections.customIdea"
              :placeholder="messages.chooseCustomPlaceholder"
              maxlength="280"
              rows="3"
              :aria-invalid="customError ? true : undefined"
              :aria-describedby="
                customError
                  ? 'choose-custom-error choose-custom-count'
                  : 'choose-custom-count'
              "
              @input="handleCustomInput"
            />

            <div class="choose__custom-foot">
              <p
                v-if="customError"
                id="choose-custom-error"
                class="field-error choose__custom-error"
                role="alert"
              >
                <CircleAlert :size="14" aria-hidden="true" />
                {{ customError }}
              </p>

              <span id="choose-custom-count" class="choose__custom-count">
                {{ customLength }}/280
              </span>
            </div>
          </div>
        </Transition>

        <div class="choose__actions">
          <p
            v-if="optionError"
            id="choose-option-error"
            class="field-error choose__option-error"
            role="alert"
          >
            <CircleAlert :size="15" aria-hidden="true" />
            {{ optionError }}
          </p>

          <BaseButton
            type="submit"
            size="lg"
            class="choose__continue"
            :aria-describedby="optionError ? 'choose-option-error' : undefined"
          >
            {{ messages.chooseContinue }}
            <template #icon-right>
              <ArrowRight :size="18" />
            </template>
          </BaseButton>

          <p class="choose__note">
            {{ copy.format(messages.chooseNote) }}
          </p>
        </div>
      </form>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.choose {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.choose__inner {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-block: clamp(2.3rem, 6vh, 4.2rem) 1.5rem;
}

.choose__header {
  display: flex;
  max-width: 44rem;
  align-items: center;
  flex-direction: column;
  margin-inline: auto;
  text-align: center;
}

.choose__eyebrow {
  margin-bottom: 1.1rem;
}

.choose__title {
  max-width: 36rem;
}

.choose__lead {
  max-width: 33rem;
  margin-top: 0.95rem;
  font-size: 0.98rem;
}

.choose__progress {
  margin-top: 1.35rem;
}

.choose__form {
  width: 100%;
  max-width: 68rem;
  margin: clamp(1.8rem, 4.5vw, 2.7rem) auto 0;
}

.choose__fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.choose__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.choose__item {
  display: flex;
  min-width: 0;
}

.choose__custom {
  margin-top: 1rem;
  padding: clamp(1.15rem, 3vw, 1.5rem);
  text-align: left;
}

.choose__custom-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--c-rose-deep);
}

.choose__custom-input {
  min-height: 6.4rem;
}

.choose__custom-foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.55rem;
}

.choose__custom-error {
  flex: 1;
}

.choose__custom-count {
  margin-left: auto;
  color: color-mix(in srgb, var(--c-ink-soft) 68%, transparent);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1.45;
  white-space: nowrap;
}

.choose__actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: clamp(1.5rem, 4vw, 2.1rem);
  text-align: center;
}

.choose__option-error {
  justify-content: center;
}

.choose__continue {
  min-width: 16rem;
}

.choose__note {
  max-width: 32rem;
  color: color-mix(in srgb, var(--c-ink-soft) 86%, transparent);
  font-size: 0.78rem;
  line-height: 1.55;
}

.custom-field-enter-active,
.custom-field-leave-active {
  transition:
    opacity 320ms var(--ease-soft),
    transform 320ms var(--ease-romantic);
}

.custom-field-enter-from,
.custom-field-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 640px) {
  .choose__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media (min-width: 1000px) {
  .choose__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .choose__form {
    max-width: 69rem;
  }
}

@media (max-width: 560px) {
  .choose__inner {
    padding-block: 1.7rem 1rem;
  }

  .choose__eyebrow {
    margin-bottom: 0.9rem;
  }

  .choose__lead {
    font-size: 0.95rem;
  }

  .choose__continue {
    width: 100%;
    min-width: 0;
    max-width: 20rem;
  }

  .choose__custom {
    padding: 1.1rem;
  }
}
</style>
