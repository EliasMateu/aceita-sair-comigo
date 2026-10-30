<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'quiet'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    as?: 'button' | 'a'
    href?: string
    target?: string
    rel?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    as: 'button',
    href: undefined,
    target: undefined,
    rel: undefined,
    type: 'button',
    block: false,
    disabled: false,
  },
)

const classes = computed(() => [
  `base-btn--${props.variant}`,
  `base-btn--${props.size}`,
  { 'base-btn--block': props.block, 'base-btn--disabled': props.disabled },
])
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :href="as === 'a' ? href : undefined"
    :target="as === 'a' ? target : undefined"
    :rel="as === 'a' ? rel : undefined"
    :disabled="as === 'button' ? disabled : undefined"
    :aria-disabled="as === 'a' && disabled ? 'true' : undefined"
    :tabindex="as === 'a' && disabled ? -1 : undefined"
    class="base-btn"
    :class="classes"
  >
    <span v-if="$slots['icon-left']" class="base-btn__icon" aria-hidden="true">
      <slot name="icon-left" />
    </span>
    <span class="base-btn__label"><slot /></span>
    <span v-if="$slots['icon-right']" class="base-btn__icon base-btn__icon--right" aria-hidden="true">
      <slot name="icon-right" />
    </span>
    <span v-if="variant === 'primary' || variant === 'inverse'" class="base-btn__shine" aria-hidden="true" />
  </component>
</template>

<style scoped>
.base-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.62rem;
  width: auto;
  border: 1px solid transparent;
  border-radius: 999px;
  font-family: var(--ff-sans);
  font-size: 0.98rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  isolation: isolate;
  overflow: hidden;
  transition:
    transform var(--dur-fast) var(--ease-romantic),
    box-shadow var(--dur-base) var(--ease-romantic),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft);
}

.base-btn--sm {
  min-height: 2.6rem;
  padding: 0.6rem 1.05rem;
  font-size: 0.82rem;
}

.base-btn--md {
  min-height: 3.05rem;
  padding: 0.8rem 1.35rem;
}

.base-btn--lg {
  min-height: 3.5rem;
  padding: 0.95rem 1.7rem;
  font-size: 1.02rem;
}

.base-btn--block {
  width: 100%;
}

.base-btn__label {
  position: relative;
  z-index: 1;
}

.base-btn__icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex: 0 0 auto;
  transition: transform var(--dur-base) var(--ease-romantic);
}

.base-btn:hover:not(.base-btn--disabled) .base-btn__icon--right {
  transform: translateX(3px);
}

.base-btn:hover:not(.base-btn--disabled) .base-btn__icon:not(.base-btn__icon--right) {
  transform: rotate(-6deg) scale(1.06);
}

.base-btn__shine {
  position: absolute;
  top: -30%;
  bottom: -30%;
  left: -65%;
  width: 42%;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, white 28%, transparent),
    transparent
  );
  transform: skewX(-18deg);
  transition: left 760ms var(--ease-romantic);
  pointer-events: none;
}

.base-btn:hover:not(.base-btn--disabled) .base-btn__shine {
  left: 125%;
}

.base-btn--primary {
  color: var(--c-cream);
  border-color: color-mix(in srgb, var(--c-rose-deep) 50%, transparent);
  background-image: linear-gradient(
    135deg,
    var(--c-rose) 0%,
    var(--c-rose-deep) 56%,
    var(--c-red) 100%
  );
  box-shadow:
    0 18px 32px -20px color-mix(in srgb, var(--c-rose-deep) 78%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 32%, transparent);
}

.base-btn--primary:hover:not(.base-btn--disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 22px 42px -20px color-mix(in srgb, var(--c-rose-deep) 82%, transparent),
    inset 0 1px 0 color-mix(in srgb, white 40%, transparent);
}

.base-btn--primary:active:not(.base-btn--disabled) {
  transform: translateY(0) scale(0.992);
}

.base-btn--secondary {
  color: var(--c-ink);
  border-color: color-mix(in srgb, var(--c-rose) 32%, var(--c-paper-deep));
  background: color-mix(in srgb, var(--c-paper-soft) 76%, transparent);
  box-shadow: 0 12px 26px -24px color-mix(in srgb, var(--c-ink) 42%, transparent);
}

.base-btn--secondary:hover:not(.base-btn--disabled) {
  border-color: color-mix(in srgb, var(--c-rose) 55%, var(--c-paper-deep));
  background: var(--c-paper-soft);
  transform: translateY(-2px);
}

.base-btn--inverse {
  color: var(--c-ink);
  border-color: color-mix(in srgb, white 50%, transparent);
  background: var(--c-cream);
  box-shadow:
    0 20px 44px -24px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 white;
}

.base-btn--inverse:hover:not(.base-btn--disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 24px 54px -24px rgba(0, 0, 0, 0.62),
    inset 0 1px 0 white;
}

.base-btn--ghost,
.base-btn--quiet {
  color: var(--c-ink-soft);
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.base-btn--ghost {
  border-color: color-mix(in srgb, var(--c-rose) 26%, transparent);
}

.base-btn--ghost:hover:not(.base-btn--disabled),
.base-btn--quiet:hover:not(.base-btn--disabled) {
  color: var(--c-rose-deep);
  background: color-mix(in srgb, var(--c-blush) 42%, transparent);
}

.base-btn--quiet {
  padding-inline: 0.4rem;
  font-size: 0.86rem;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--c-rose) 34%, transparent);
  text-underline-offset: 4px;
}

.base-btn--disabled {
  opacity: 0.45;
  pointer-events: none;
  box-shadow: none;
}

.base-btn:focus-visible {
  outline: 2px solid var(--c-rose-deep);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .base-btn,
  .base-btn__icon,
  .base-btn__shine {
    transition: none;
  }
}
</style>
