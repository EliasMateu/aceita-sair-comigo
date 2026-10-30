<script setup lang="ts">
import { computed } from 'vue'
import type { FlowStep } from '~/types/date'

const props = defineProps<{
  step: FlowStep
}>()

const emit = defineEmits<{
  navigate: [step: FlowStep]
}>()

const steps: Array<{
  step: Extract<FlowStep, 'choose' | 'schedule' | 'summary'>
  label: string
}> = [
  { step: 'choose', label: 'Programa' },
  { step: 'schedule', label: 'O dia' },
  { step: 'summary', label: 'Resumo' },
]

const currentIndex = computed(() => {
  const index = steps.findIndex((item) => item.step === props.step)
  return index >= 0 ? index : 0
})

function isCompleted(index: number): boolean {
  return index < currentIndex.value
}

function handleClick(index: number): void {
  if (!isCompleted(index)) return
  emit('navigate', steps[index]!.step)
}
</script>

<template>
  <nav class="progress" aria-label="Etapas do nosso date">
    <ol class="progress__list">
      <li
        v-for="(item, index) in steps"
        :key="item.step"
        class="progress__item"
        :class="{
          'is-current': index === currentIndex,
          'is-completed': isCompleted(index),
          'is-upcoming': index > currentIndex,
        }"
      >
        <button
          type="button"
          class="progress__button"
          :disabled="index >= currentIndex"
          :aria-current="index === currentIndex ? 'step' : undefined"
          :aria-label="`Etapa ${index + 1} de ${steps.length}: ${item.label}${isCompleted(index) ? ' — voltar' : ''}`"
          @click="handleClick(index)"
        >
          <span class="progress__dot" aria-hidden="true">{{ index + 1 }}</span>
          <span class="progress__label">{{ item.label }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.progress {
  width: min(100%, 28rem);
  margin-inline: auto;
  padding-top: 0.9rem;
}

.progress__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
}

.progress__item {
  position: relative;
  text-align: center;
}

.progress__item:not(:last-child)::after {
  position: absolute;
  z-index: 0;
  top: 0.7rem;
  left: 50%;
  width: 100%;
  height: 1px;
  background: color-mix(in srgb, var(--c-rose) 20%, transparent);
  content: "";
}

.progress__item.is-completed:not(:last-child)::after {
  background: color-mix(in srgb, var(--c-rose) 48%, transparent);
}

.progress__button {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  min-height: 2.9rem;
  align-items: center;
  flex-direction: column;
  gap: 0.35rem;
  border: 0;
  background: transparent;
  color: var(--c-ink-soft);
  font-family: var(--ff-sans);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  line-height: 1;
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease-soft);
}

.progress__button:disabled {
  cursor: default;
}

.progress__button:not(:disabled):hover {
  color: var(--c-rose-deep);
}

.progress__dot {
  display: grid;
  width: 1.42rem;
  height: 1.42rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-rose) 35%, var(--c-paper-deep));
  border-radius: 50%;
  background: var(--c-paper);
  color: var(--c-ink-soft);
  font-size: 0.58rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  transition:
    color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft),
    border-color var(--dur-base) var(--ease-soft),
    box-shadow var(--dur-base) var(--ease-soft);
}

.progress__item.is-completed .progress__dot {
  border-color: var(--c-rose);
  background: color-mix(in srgb, var(--c-rose) 16%, var(--c-paper));
  color: var(--c-rose-deep);
}

.progress__item.is-current .progress__dot {
  border-color: var(--c-rose-deep);
  background: var(--c-rose-deep);
  color: var(--c-cream);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--c-rose) 13%, transparent);
}

.progress__label {
  color: inherit;
}

.progress__item.is-current .progress__label {
  color: var(--c-rose-deep);
}

.progress__item.is-upcoming .progress__label,
.progress__item.is-upcoming .progress__dot {
  opacity: 0.55;
}
</style>
