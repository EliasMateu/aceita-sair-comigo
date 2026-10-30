<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { romanticConfig } from '~/config/romantic.config'

const props = defineProps<{
  error: NuxtError
}>()

const messages = romanticConfig.messages
const statusCode = computed(() => props.error?.statusCode ?? 404)

useHead({
  title: `${messages.notFoundTitle} · ${romanticConfig.siteTitle}`,
})

useSeoMeta({
  robots: 'noindex, nofollow',
})

function goHome(): void {
  void clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <AmbientBackground />

    <header class="error-page__brand">
      <HeartSeal :size="34" />
      <span>Um convite</span>
    </header>

    <main class="error-page__main page-gutter">
      <div class="paper-panel error-card animate-fade-up">
        <span class="error-card__code" aria-hidden="true">
          {{ statusCode }}
        </span>

        <p class="eyebrow eyebrow--centered">
          {{ statusCode === 404 ? 'Página não encontrada' : 'Um imprevisto' }}
        </p>

        <h1 class="title-lg error-card__title">
          {{ messages.notFoundTitle }}
        </h1>

        <svg class="error-card__path" viewBox="0 0 260 70" fill="none" aria-hidden="true">
          <path
            d="M6 48c24-32 42 12 68-4 27-17 37-32 62-19 23 12 30 38 52 26 17-9 28-27 66-31"
            stroke="currentColor"
            stroke-width="1"
            stroke-dasharray="3 6"
            stroke-linecap="round"
          />
          <path
            d="M245 11c-.8 0-1.6-.3-2.2-.72-4-2.9-6-4.5-6-6.6 0-1.3 1-2.3 2.3-2.3.8 0 1.5.45 2.1 1.28.6-.83 1.3-1.28 2.1-1.28 1.3 0 2.3.95 2.3 2.3 0 2.1-2 3.7-6 6.6-.6.42-1.4.72-2.2.72Z"
            fill="currentColor"
          />
        </svg>

        <p class="error-card__text">
          {{ messages.notFoundText }}
        </p>

        <BaseButton @click="goHome">
          <template #icon-left>
            <ArrowLeft :size="17" />
          </template>
          {{ messages.notFoundCta }}
        </BaseButton>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.error-page {
  position: relative;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  overflow: hidden;
}

.error-page__brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem var(--page-gutter);
  color: var(--c-rose-deep);
  font-family: var(--ff-display);
  font-size: 1.1rem;
  font-style: italic;
}

.error-page__main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-block: clamp(2rem, 7vh, 4rem);
}

.error-card {
  width: 100%;
  max-width: 39rem;
  padding: clamp(2.4rem, 6vw, 4rem) clamp(1.4rem, 5vw, 3.4rem);
  text-align: center;
}

.error-card__code {
  display: block;
  margin-bottom: 0.5rem;
  color: color-mix(in srgb, var(--c-rose) 30%, transparent);
  font-family: var(--ff-display);
  font-size: clamp(5rem, 16vw, 9rem);
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.08em;
  user-select: none;
}

.error-card__title {
  max-width: 28rem;
  margin: 0.9rem auto 0;
}

.error-card__path {
  width: min(100%, 16rem);
  height: auto;
  margin: 1.2rem auto 0.4rem;
  color: color-mix(in srgb, var(--c-rose) 58%, transparent);
}

.error-card__text {
  max-width: 25rem;
  margin: 0 auto 1.6rem;
  color: var(--c-ink-soft);
  font-size: 1rem;
  line-height: 1.7;
  text-wrap: pretty;
}
</style>
