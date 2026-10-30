<script setup lang="ts">
import { Undo2 } from '@lucide/vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'

const messages = romanticConfig.messages
const copy = useCopy()
const { goTo } = useDateFlow()
</script>

<template>
  <section class="declined">
    <FloatingHearts tone="light" />

    <div class="declined__inner page-gutter">
      <div class="paper-panel declined__card animate-fade-up">
        <svg
          class="declined__sprig"
          viewBox="0 0 120 180"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M78 174c-6-42-2-78 12-108 8-17 17-30 26-38"
            stroke="currentColor"
            stroke-width="1.1"
            stroke-linecap="round"
          />
          <path
            d="M102 52c-13 1-21-5-23-17 13-1 21 5 23 17Z"
            fill="currentColor"
            opacity=".32"
          />
          <path
            d="M93 76c-14-2-20-10-19-22 13 2 20 10 19 22Z"
            fill="currentColor"
            opacity=".26"
          />
          <path
            d="M84 104c-14 0-21-7-23-19 14 0 21 7 23 19Z"
            fill="currentColor"
            opacity=".22"
          />
          <path
            d="M76 132c-13 2-21-4-25-16 13-2 21 4 25 16Z"
            fill="currentColor"
            opacity=".18"
          />
          <path
            d="M70 155c12-3 21 1 27 12-12 3-21-1-27-12Z"
            fill="currentColor"
            opacity=".14"
          />
        </svg>

        <div class="declined__seal animate-seal-pop" aria-hidden="true">
          <HeartSeal :size="46" />
        </div>

        <p class="eyebrow eyebrow--centered">{{ messages.declineEyebrow }}</p>

        <AccentTitle
          :text="copy.format(messages.declineTitle)"
          :accent="copy.format(messages.declineTitleAccent)"
          as="h1"
          focusable
          class="title-lg declined__title"
        />

        <OrnamentDivider class="declined__divider" />

        <p class="declined__text">
          {{ copy.format(messages.declineText) }}
        </p>

        <p class="hand-note declined__note">
          {{ copy.format(messages.declineNote) }}
        </p>

        <BaseButton variant="secondary" size="md" class="declined__cta" @click="goTo('invitation')">
          <template #icon-left>
            <Undo2 :size="16" />
          </template>
          {{ messages.declineCta }}
        </BaseButton>
      </div>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.declined {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.declined__inner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-block: clamp(2.5rem, 8vh, 5.5rem);
}

.declined__card {
  position: relative;
  width: 100%;
  max-width: 37rem;
  padding: clamp(2.3rem, 6vw, 3.7rem) clamp(1.4rem, 5vw, 3.4rem)
    clamp(2rem, 5vw, 2.8rem);
  text-align: center;
}

.declined__sprig {
  position: absolute;
  z-index: 1;
  top: 1.1rem;
  right: 1.1rem;
  width: 5.2rem;
  color: var(--c-lavender-deep);
  opacity: 0.55;
  transform: rotate(8deg);
  pointer-events: none;
}

.declined__seal {
  display: inline-flex;
  margin-bottom: 1.15rem;
  filter: drop-shadow(
    0 8px 16px color-mix(in srgb, var(--c-rose-deep) 22%, transparent)
  );
}

.declined__title {
  max-width: 28rem;
  margin-inline: auto;
  margin-top: 0.85rem;
}

.declined__divider {
  margin-block: clamp(1.4rem, 4vw, 1.9rem);
}

.declined__text {
  max-width: 27rem;
  margin-inline: auto;
  color: var(--c-ink-soft);
  font-size: clamp(0.98rem, 0.94rem + 0.18vw, 1.06rem);
  line-height: 1.78;
  text-wrap: pretty;
}

.declined__note {
  margin-top: 1.1rem;
  font-size: 1.4rem;
  transform: rotate(-1.5deg);
}

.declined__cta {
  margin-top: clamp(1.5rem, 4vw, 2rem);
}

@media (max-width: 480px) {
  .declined__inner {
    padding-block: 1.5rem 1rem;
  }

  .declined__sprig {
    width: 4rem;
    opacity: 0.4;
  }

  .declined__cta {
    width: 100%;
  }
}
</style>
