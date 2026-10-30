<script setup lang="ts">
import { RotateCcw } from '@lucide/vue'
import { computed } from 'vue'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'

withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)

const emit = defineEmits<{
  restart: []
}>()

const { state } = useDateFlow()
const showRestart = computed(() => state.value.step !== 'welcome')
</script>

<template>
  <header class="site-header" :class="`site-header--${tone}`">
    <div class="site-header__inner">
      <div class="brand" :aria-label="romanticConfig.siteTitle">
        <HeartSeal :size="33" class="brand__seal" />
        <span class="brand__copy">
          <span class="brand__name">Um convite</span>
          <span class="brand__sub">só entre nós</span>
        </span>
      </div>

      <div class="site-header__actions">
        <MusicPlayer variant="compact" />
        <Transition name="reset-fade">
          <button
            v-if="showRestart"
            type="button"
            class="header-icon-button"
            aria-label="Recomeçar a experiência"
            title="Recomeçar"
            @click="emit('restart')"
          >
            <RotateCcw :size="16" aria-hidden="true" />
          </button>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  z-index: 50;
  top: 0;
  border-bottom: 1px solid transparent;
  background:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--c-paper) 80%, transparent),
      color-mix(in srgb, var(--c-paper) 46%, transparent)
    );
  backdrop-filter: blur(16px) saturate(115%);
  transition:
    background-color 500ms var(--ease-soft),
    border-color 500ms var(--ease-soft);
}

.site-header--dark {
  background:
    linear-gradient(
      to bottom,
      color-mix(in srgb, #24171d 88%, transparent),
      color-mix(in srgb, #24171d 58%, transparent)
    );
}

.site-header--dark::after {
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, #e8b6bf 24%, transparent),
    transparent
  );
}

.site-header--dark .brand__name {
  color: #fff4ed;
}

.site-header--dark .brand__sub {
  color: color-mix(in srgb, #f6dfd9 72%, transparent);
}

.site-header--dark .header-icon-button {
  border-color: color-mix(in srgb, #f6dfd9 18%, transparent);
  background: color-mix(in srgb, #fff4ed 7%, transparent);
  color: color-mix(in srgb, #f6dfd9 82%, transparent);
}

.site-header--dark .header-icon-button:hover {
  border-color: color-mix(in srgb, #f6dfd9 32%, transparent);
  background: color-mix(in srgb, #fff4ed 13%, transparent);
  color: #fff4ed;
}

.site-header::after {
  position: absolute;
  right: var(--page-gutter);
  bottom: 0;
  left: var(--page-gutter);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--c-rose) 15%, transparent),
    transparent
  );
  content: "";
  pointer-events: none;
}

.site-header__inner {
  display: flex;
  width: 100%;
  max-width: var(--content-wide);
  min-height: var(--header-h);
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-inline: auto;
  padding-inline: var(--page-gutter);
}

.brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.7rem;
}

.brand__seal {
  flex: 0 0 auto;
}

.brand__copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1;
}

.brand__name {
  overflow: hidden;
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: 1.12rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: -0.02em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brand__sub {
  margin-top: 0.32rem;
  color: var(--c-ink-soft);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.site-header__actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 0.5rem;
}

.header-icon-button {
  display: inline-grid;
  width: 2.55rem;
  height: 2.55rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--c-rose) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-paper-soft) 54%, transparent);
  color: var(--c-ink-soft);
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft),
    transform var(--dur-base) var(--ease-romantic);
}

.header-icon-button:hover {
  border-color: color-mix(in srgb, var(--c-rose) 36%, transparent);
  background: var(--c-paper-soft);
  color: var(--c-rose-deep);
  transform: rotate(-14deg);
}

.reset-fade-enter-active,
.reset-fade-leave-active {
  transition:
    opacity 200ms var(--ease-soft),
    transform 200ms var(--ease-romantic);
}

.reset-fade-enter-from,
.reset-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

@media (max-width: 480px) {
  .brand__sub {
    display: none;
  }

  .brand__name {
    font-size: 1.02rem;
  }

  .brand__seal {
    width: 29px;
    height: 29px;
  }

  .site-header__actions {
    gap: 0.4rem;
  }

  .header-icon-button {
    width: 2.45rem;
    height: 2.45rem;
  }
}
</style>
