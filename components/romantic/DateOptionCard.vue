<script setup lang="ts">
import { Check } from '@lucide/vue'
import { computed } from 'vue'
import type { DateOption } from '~/types/date'
import { getDateOptionIcon } from '~/utils/icons'

const props = withDefaults(
  defineProps<{
    option: DateOption
    selected?: boolean
    name?: string
  }>(),
  {
    selected: false,
    name: 'date-option',
  },
)

const emit = defineEmits<{
  select: [optionId: string]
}>()

const icon = computed(() => getDateOptionIcon(props.option.icon))
</script>

<template>
  <label
    class="option-card"
    :class="{ 'is-selected': selected }"
    :style="{ '--option-accent': option.accent }"
  >
    <input
      class="option-card__input"
      type="radio"
      :name="name"
      :value="option.id"
      :checked="selected"
      @change="emit('select', option.id)"
    />

    <span class="option-card__head">
      <span class="option-card__icon" aria-hidden="true">
        <component :is="icon" :size="21" :stroke-width="1.7" />
      </span>

      <span class="option-card__badge" aria-hidden="true">
        <span class="option-card__emoji">{{ option.emoji }}</span>
        <span class="option-card__check">
          <Check :size="13" :stroke-width="3" />
        </span>
      </span>
    </span>

    <span class="option-card__copy">
      <span class="option-card__title">{{ option.title }}</span>
      <span class="option-card__desc">{{ option.description }}</span>
    </span>
  </label>
</template>

<style scoped>
.option-card {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 10.2rem;
  flex-direction: column;
  padding: 1.15rem 1.2rem;
  border: 1px solid color-mix(in srgb, var(--option-accent) 18%, var(--c-paper-deep));
  border-radius: 1.3rem;
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--c-paper-soft) 96%, white) 0%,
      color-mix(in srgb, var(--c-paper) 82%, var(--option-accent) 4%) 100%
    );
  box-shadow: 0 16px 38px -36px color-mix(in srgb, var(--c-ink) 44%, transparent);
  cursor: pointer;
  isolation: isolate;
  overflow: hidden;
  transition:
    transform var(--dur-base) var(--ease-romantic),
    border-color var(--dur-base) var(--ease-soft),
    box-shadow var(--dur-base) var(--ease-romantic),
    background-color var(--dur-base) var(--ease-soft);
}

.option-card::before {
  position: absolute;
  z-index: 0;
  top: -3.5rem;
  right: -3rem;
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--option-accent) 17%, transparent) 0%,
    transparent 68%
  );
  content: "";
  opacity: 0.65;
  transition:
    opacity var(--dur-base) var(--ease-soft),
    transform var(--dur-slow) var(--ease-romantic);
  pointer-events: none;
}

.option-card__input {
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

.option-card__head,
.option-card__copy {
  position: relative;
  z-index: 1;
}

.option-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.option-card__icon {
  display: grid;
  width: 2.55rem;
  height: 2.55rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--option-accent) 20%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--option-accent) 9%, var(--c-paper-soft));
  color: var(--option-accent);
  transition:
    color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft),
    border-color var(--dur-base) var(--ease-soft),
    transform var(--dur-base) var(--ease-romantic);
}

.option-card__badge {
  position: relative;
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px dashed color-mix(in srgb, var(--option-accent) 30%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--option-accent) 6%, var(--c-paper-soft));
  color: var(--option-accent);
  transition:
    border-color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft),
    box-shadow var(--dur-base) var(--ease-soft);
}

.option-card__emoji {
  font-size: 1rem;
  line-height: 1;
  transition:
    opacity var(--dur-fast) var(--ease-soft),
    transform var(--dur-base) var(--ease-romantic);
}

.option-card__check {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--c-cream);
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity var(--dur-fast) var(--ease-soft),
    transform var(--dur-base) var(--ease-romantic);
}

.option-card__copy {
  display: block;
  margin-top: auto;
  padding-top: 1.25rem;
}

.option-card__title {
  display: block;
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: 1.28rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.1;
  text-wrap: balance;
}

.option-card__desc {
  display: block;
  margin-top: 0.38rem;
  color: color-mix(in srgb, var(--c-ink-soft) 94%, transparent);
  font-size: 0.83rem;
  line-height: 1.55;
  text-wrap: pretty;
}

.option-card:has(.option-card__input:focus-visible) {
  outline: 2px solid var(--c-rose-deep);
  outline-offset: 3px;
}

.option-card.is-selected {
  border-color: color-mix(in srgb, var(--option-accent) 62%, var(--c-paper-deep));
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--option-accent) 8%, var(--c-paper-soft)) 0%,
      color-mix(in srgb, var(--option-accent) 13%, var(--c-paper)) 100%
    );
  box-shadow:
    0 26px 52px -32px color-mix(in srgb, var(--option-accent) 42%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--option-accent) 20%, transparent);
}

.option-card.is-selected::before {
  opacity: 1;
  transform: scale(1.2);
}

.option-card.is-selected .option-card__icon {
  border-color: transparent;
  background: var(--option-accent);
  color: var(--c-cream);
  transform: rotate(-4deg);
}

.option-card.is-selected .option-card__badge {
  border-style: solid;
  border-color: var(--option-accent);
  background: var(--option-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--option-accent) 13%, transparent);
}

.option-card.is-selected .option-card__emoji {
  opacity: 0;
  transform: scale(0.35) rotate(30deg);
}

.option-card.is-selected .option-card__check {
  opacity: 1;
  transform: scale(1);
}

@media (hover: hover) {
  .option-card:hover {
    border-color: color-mix(in srgb, var(--option-accent) 40%, var(--c-paper-deep));
    box-shadow: 0 26px 48px -34px color-mix(in srgb, var(--option-accent) 30%, transparent);
    transform: translateY(-3px);
  }

  .option-card:hover .option-card__icon {
    transform: rotate(-5deg) scale(1.04);
  }

  .option-card:hover::before {
    opacity: 0.95;
    transform: scale(1.08);
  }
}

@media (max-width: 639px) {
  .option-card {
    display: grid;
    min-height: 0;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    column-gap: 0.95rem;
    padding: 1rem 1.05rem;
    border-radius: 1.15rem;
  }

  .option-card__head {
    display: contents;
  }

  .option-card__icon {
    width: 2.35rem;
    height: 2.35rem;
    border-radius: 0.75rem;
  }

  .option-card__badge {
    position: absolute;
    top: 0.85rem;
    right: 0.9rem;
    width: 1.85rem;
    height: 1.85rem;
  }

  .option-card__copy {
    margin-top: 0;
    padding-top: 0.1rem;
    padding-right: 1.9rem;
  }

  .option-card__title {
    font-size: 1.12rem;
  }

  .option-card__desc {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .option-card.is-selected .option-card__icon {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .option-card,
  .option-card::before,
  .option-card__icon,
  .option-card__badge,
  .option-card__emoji,
  .option-card__check {
    transition: none;
  }
}
</style>
