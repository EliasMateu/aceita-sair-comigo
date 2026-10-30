<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { useReducedMotion } from '~/composables/useReducedMotion'
import { romanticConfig } from '~/config/romantic.config'

const messages = romanticConfig.messages
const celebration = romanticConfig.celebration
const copy = useCopy()
const reduced = useReducedMotion()
const { finishCelebration } = useDateFlow()

const revealed = ref(false)
let suspenseTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (reduced.value || celebration.suspenseMs <= 0) {
    revealed.value = true
    return
  }

  suspenseTimer = setTimeout(() => {
    revealed.value = true
  }, celebration.suspenseMs)
})

onBeforeUnmount(() => {
  if (suspenseTimer) clearTimeout(suspenseTimer)
})
</script>

<template>
  <section
    class="celebration"
    :style="{ '--reveal-duration': `${celebration.revealMs}ms` }"
  >
    <FloatingHearts tone="dark" />

    <span class="celebration__halo" aria-hidden="true" />
    <span class="celebration__ring celebration__ring--one" aria-hidden="true" />
    <span class="celebration__ring celebration__ring--two" aria-hidden="true" />
    <span class="celebration__grain grain-texture" aria-hidden="true" />

    <CelebrationConfetti :active="revealed" :pieces="celebration.confettiPieces" />

    <div class="celebration__inner page-gutter">
      <p class="eyebrow eyebrow--centered celebration__eyebrow">
        {{ messages.celebrationEyebrow }}
      </p>

      <div
        class="celebration__seal"
        :class="{ 'is-revealed': revealed }"
        aria-hidden="true"
      >
        <span class="celebration__pulse" />
        <HeartSeal :size="54" />
      </div>

      <div class="celebration__stage" aria-live="polite">
        <AccentTitle
          :text="revealed ? messages.celebrationTitle : messages.celebrationSuspense"
          :accent="revealed ? messages.celebrationTitleAccent : ''"
          as="h1"
          focusable
          class="celebration__title"
          :class="{ 'is-suspense': !revealed, 'is-revealed': revealed }"
        />

        <div v-if="!revealed" class="celebration__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <Transition name="celebration-fade">
          <div v-if="revealed" class="celebration__reveal">
            <p class="celebration__message">
              {{ copy.format(messages.celebrationMessage) }}
            </p>
            <p class="celebration__submessage">
              {{ copy.format(messages.celebrationSubmessage) }}
            </p>
          </div>
        </Transition>
      </div>

      <Transition name="celebration-cta">
        <BaseButton
          v-if="revealed"
          variant="inverse"
          size="lg"
          class="celebration__cta"
          @click="finishCelebration"
        >
          {{ messages.celebrationCta }}
          <template #icon-right>
            <ArrowRight :size="18" />
          </template>
        </BaseButton>
      </Transition>
    </div>

    <AppFooter tone="dark" />
  </section>
</template>

<style scoped>
.celebration {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(ellipse at 50% 30%, #47262f 0%, transparent 48%),
    radial-gradient(
      ellipse at 50% 112%,
      color-mix(in srgb, var(--c-rose) 26%, transparent),
      transparent 60%
    ),
    linear-gradient(180deg, #24171d 0%, #1b1116 100%);
  color: #f6dfd9;
}

.celebration__halo {
  position: absolute;
  z-index: 0;
  top: 4%;
  left: 50%;
  width: min(96vw, 64rem);
  height: min(72vh, 42rem);
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--c-rose) 42%, transparent) 0%,
    transparent 62%
  );
  filter: blur(38px);
  opacity: 0.72;
  transform: translateX(-50%);
  animation: breathe 9s ease-in-out infinite;
  pointer-events: none;
}

.celebration__ring {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  border: 1px solid color-mix(in srgb, #e8b6bf 14%, transparent);
  border-radius: 50%;
  pointer-events: none;
}

.celebration__ring--one {
  width: min(112vw, 72rem);
  height: min(72vw, 46rem);
  transform: translate(-50%, -50%) rotate(-9deg);
}

.celebration__ring--two {
  width: min(68vw, 36rem);
  height: min(68vw, 36rem);
  border-style: dashed;
  border-color: color-mix(in srgb, #e8b6bf 10%, transparent);
  transform: translate(-50%, -50%) rotate(14deg);
  opacity: 0.7;
}

.celebration__grain {
  position: absolute;
  z-index: 3;
  inset: 0;
  opacity: 0.05;
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.celebration__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-block: clamp(2.6rem, 7vh, 5rem);
  text-align: center;
}

.celebration__eyebrow {
  margin-bottom: clamp(1.7rem, 4.5vh, 2.4rem);
  color: color-mix(in srgb, #f6dfd9 62%, transparent);
}

.celebration__eyebrow::before,
.celebration__eyebrow::after {
  background: color-mix(in srgb, #e8b6bf 46%, transparent);
}

.celebration__seal {
  position: relative;
  display: grid;
  place-items: center;
  margin-bottom: clamp(1.2rem, 3.2vh, 1.7rem);
  animation: celebration-beat 2.4s ease-in-out infinite;
}

.celebration__seal.is-revealed {
  animation: seal-pop 900ms var(--ease-romantic) both;
}

.celebration__pulse {
  position: absolute;
  inset: -0.9rem;
  border: 1px solid color-mix(in srgb, #e8b6bf 30%, transparent);
  border-radius: 50%;
  animation: pulse-ring 2.8s ease-out infinite;
  pointer-events: none;
}

.celebration__stage {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
}

.celebration__title {
  max-width: 52rem;
  color: #fff3ec;
  transition:
    font-size 520ms var(--ease-romantic),
    letter-spacing 520ms var(--ease-romantic);
}

.celebration__title.is-suspense {
  color: color-mix(in srgb, #fbeee7 88%, transparent);
  font-size: clamp(2.5rem, 6.8vw, 4.2rem);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.05;
}

.celebration__title.is-revealed {
  font-size: clamp(2.9rem, 8.4vw, 6.2rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 0.94;
  text-transform: uppercase;
  text-shadow: 0 22px 60px rgba(0, 0, 0, 0.38);
  animation: celebration-bloom var(--reveal-duration, 1200ms) var(--ease-romantic) both;
}

.celebration__title :deep(em) {
  color: #f3b9c3;
  font-style: italic;
  font-weight: 500;
}

.celebration__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.celebration__dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8b6bf;
  opacity: 0.4;
  animation: suspense-dot 1.3s ease-in-out infinite;
}

.celebration__dots span:nth-child(2) {
  animation-delay: 150ms;
}

.celebration__dots span:nth-child(3) {
  animation-delay: 300ms;
}

.celebration__reveal {
  display: flex;
  max-width: 34rem;
  align-items: center;
  flex-direction: column;
  gap: 0.7rem;
  margin-top: clamp(1.2rem, 3.2vh, 1.7rem);
}

.celebration__message {
  color: #f6dfd9;
  font-family: var(--ff-display);
  font-size: clamp(1.15rem, 2.6vw, 1.45rem);
  font-style: italic;
  line-height: 1.4;
  text-wrap: pretty;
}

.celebration__submessage {
  color: color-mix(in srgb, #f6dfd9 64%, transparent);
  font-size: clamp(0.92rem, 2.2vw, 1.02rem);
  line-height: 1.68;
  text-wrap: pretty;
}

.celebration__cta {
  min-width: 16rem;
  margin-top: clamp(1.8rem, 4.5vh, 2.5rem);
}

.celebration-fade-enter-active {
  transition:
    opacity 720ms var(--ease-soft) 160ms,
    transform 720ms var(--ease-romantic) 160ms;
}

.celebration-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.celebration-cta-enter-active {
  transition:
    opacity 600ms var(--ease-soft) 420ms,
    transform 600ms var(--ease-romantic) 420ms;
}

.celebration-cta-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@keyframes celebration-beat {
  0%,
  100% {
    transform: scale(1);
  }

  12% {
    transform: scale(1.06);
  }

  24% {
    transform: scale(1);
  }

  36% {
    transform: scale(1.04);
  }
}

@keyframes celebration-bloom {
  0% {
    opacity: 0.2;
    filter: blur(7px);
    transform: scale(0.96);
  }

  60% {
    opacity: 1;
    filter: blur(0);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

@keyframes suspense-dot {
  0%,
  100% {
    opacity: 0.22;
    transform: translateY(0);
  }

  50% {
    opacity: 0.85;
    transform: translateY(-4px);
  }
}

@media (max-width: 560px) {
  .celebration__inner {
    padding-block: 2rem 1rem;
  }

  .celebration__ring--one {
    display: none;
  }

  .celebration__ring--two {
    width: min(92vw, 26rem);
    height: min(92vw, 26rem);
  }

  .celebration__cta {
    width: 100%;
    min-width: 0;
    max-width: 18rem;
  }

  .celebration__submessage {
    max-width: 21rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration__seal,
  .celebration__pulse,
  .celebration__halo {
    animation: none;
  }

  .celebration__title {
    transition: none;
  }
}
</style>
