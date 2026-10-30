<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import {
  LoaderCircle,
  Music2,
  Pause,
  Play,
  Volume2,
} from '@lucide/vue'
import { useMusic } from '~/composables/useMusic'
import { romanticConfig } from '~/config/romantic.config'

const props = withDefaults(
  defineProps<{
    variant?: 'compact' | 'invite'
  }>(),
  { variant: 'compact' },
)

const messages = romanticConfig.messages
const { settings, state, available, hasError, toggle, setVolume } = useMusic()

const root = ref<HTMLElement | null>(null)
const volumeOpen = ref(false)
const volumeSlider = ref<HTMLInputElement | null>(null)
const errorId = useId()

const volumePercent = computed(() => Math.round(state.value.volume * 100))
const toggleLabel = computed(() =>
  state.value.playing ? messages.musicPause : messages.musicActivate,
)
const equalizerBars = [0, 1, 2, 3]

function handleVolumeInput(event: Event): void {
  const target = event.target as HTMLInputElement
  setVolume(Number(target.value) / 100)
}

function toggleVolumePanel(): void {
  volumeOpen.value = !volumeOpen.value
}

function closeVolumePanel(): void {
  volumeOpen.value = false
}

function handleDocumentPointer(event: PointerEvent): void {
  if (!root.value?.contains(event.target as Node)) {
    closeVolumePanel()
  }
}

watch(volumeOpen, async (open) => {
  if (open) {
    document.addEventListener('pointerdown', handleDocumentPointer)
    await nextTick()
    volumeSlider.value?.focus()
  } else {
    document.removeEventListener('pointerdown', handleDocumentPointer)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointer)
})
</script>

<template>
  <div
    v-if="available"
    ref="root"
    class="music-player"
    :class="`music-player--${props.variant}`"
    @keydown.esc="closeVolumePanel"
  >
    <template v-if="props.variant === 'compact'">
      <div class="music-compact" role="group" aria-label="Música de fundo">
        <button
          type="button"
          class="music-compact__toggle"
          :aria-pressed="state.playing"
          :aria-label="toggleLabel"
          :title="hasError ? messages.musicUnavailable : toggleLabel"
          :aria-describedby="hasError ? errorId : undefined"
          @click="toggle"
        >
          <LoaderCircle
            v-if="state.loading"
            :size="15"
            class="animate-spin"
            aria-hidden="true"
          />
          <Pause v-else-if="state.playing" :size="15" aria-hidden="true" />
          <Play v-else :size="15" aria-hidden="true" />
          <span class="music-compact__label">
            {{ state.playing ? messages.musicPlaying : messages.musicLabel }}
          </span>
          <span
            v-if="state.playing"
            class="equalizer equalizer--compact"
            aria-hidden="true"
          >
            <span
              v-for="bar in equalizerBars"
              :key="bar"
              :style="{ animationDelay: `${bar * 120}ms` }"
            />
          </span>
        </button>
        <button
          type="button"
          class="music-compact__volume"
          :aria-label="messages.musicVolume"
          :aria-expanded="volumeOpen"
          title="Volume"
          @click="toggleVolumePanel"
        >
          <Volume2 :size="15" aria-hidden="true" />
        </button>
      </div>

      <Transition name="volume-pop">
        <div v-if="volumeOpen" class="volume-panel">
          <label for="music-volume" class="volume-panel__label">
            {{ messages.musicVolume }}
          </label>
          <div class="volume-panel__row">
            <Volume2 :size="14" aria-hidden="true" class="volume-panel__icon" />
            <input
              id="music-volume"
              ref="volumeSlider"
              class="volume-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              :value="volumePercent"
              :aria-label="messages.musicVolume"
              @input="handleVolumeInput"
            >
            <output class="volume-panel__value" for="music-volume">
              {{ volumePercent }}%
            </output>
          </div>
          <p class="volume-panel__now">{{ settings.title }}</p>
        </div>
      </Transition>

      <p v-if="hasError" :id="errorId" class="sr-only" role="status">
        {{ messages.musicUnavailable }}
      </p>
    </template>

    <template v-else>
      <button
        type="button"
        class="music-invite"
        :class="{ 'is-playing': state.playing }"
        :aria-pressed="state.playing"
        :aria-label="toggleLabel"
        @click="toggle"
      >
        <span class="music-invite__orb" aria-hidden="true">
          <LoaderCircle
            v-if="state.loading"
            :size="18"
            class="animate-spin"
          />
          <Pause v-else-if="state.playing" :size="18" />
          <Play v-else :size="18" />
        </span>
        <span class="music-invite__copy">
          <span class="music-invite__prompt">
            {{ state.playing ? settings.title : messages.musicInvite }}
          </span>
          <span class="music-invite__action">
            <Music2 :size="12" aria-hidden="true" />
            {{ state.playing ? messages.musicPlaying : messages.musicActivate }}
          </span>
        </span>
        <span v-if="state.playing" class="equalizer" aria-hidden="true">
          <span
            v-for="bar in equalizerBars"
            :key="bar"
            :style="{ animationDelay: `${bar * 120}ms` }"
          />
        </span>
      </button>
      <p v-if="hasError" class="music-invite__error" role="status">
        {{ messages.musicUnavailable }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.music-player {
  position: relative;
}

.music-player--compact {
  display: flex;
  align-items: center;
}

.music-compact {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-height: 2.55rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 22%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-paper-soft) 58%, transparent);
  box-shadow: 0 8px 20px -18px color-mix(in srgb, var(--c-ink) 40%, transparent);
  backdrop-filter: blur(12px);
}

.music-compact__toggle,
.music-compact__volume {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--c-ink-soft);
  transition:
    color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft);
}

.music-compact__toggle {
  gap: 0.42rem;
  min-height: 2.5rem;
  padding: 0 0.8rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.music-compact__volume {
  width: 2.45rem;
  min-height: 2.5rem;
  border-left: 1px solid color-mix(in srgb, var(--c-rose) 18%, transparent);
}

.music-compact__toggle:hover,
.music-compact__volume:hover {
  color: var(--c-rose-deep);
  background: color-mix(in srgb, var(--c-blush) 52%, transparent);
}

.music-compact__toggle[aria-pressed="true"] {
  color: var(--c-rose-deep);
}

.music-compact__label {
  line-height: 1;
}

.equalizer {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 0.85rem;
  margin-left: 0.1rem;
}

.equalizer span {
  display: block;
  width: 2px;
  height: 100%;
  border-radius: 999px;
  background: currentColor;
  transform-origin: center;
  animation: equalizer 900ms ease-in-out infinite;
}

.equalizer--compact {
  height: 0.7rem;
}

.volume-panel {
  position: absolute;
  z-index: 60;
  top: calc(100% + 0.55rem);
  right: 0;
  width: 13rem;
  padding: 0.9rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 20%, var(--c-paper-deep));
  border-radius: 1rem;
  background: var(--c-paper-soft);
  box-shadow: var(--shadow-soft);
}

.volume-panel__label {
  display: block;
  margin-bottom: 0.55rem;
  color: var(--c-ink-soft);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.volume-panel__row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.volume-panel__icon {
  flex: 0 0 auto;
  color: var(--c-rose-deep);
}

.volume-panel__value {
  min-width: 2.4rem;
  color: var(--c-ink-soft);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.volume-panel__now {
  overflow: hidden;
  margin-top: 0.6rem;
  color: var(--c-ink-soft);
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.volume-slider {
  width: 100%;
  height: 3px;
  border-radius: 999px;
  outline: none;
  background: color-mix(in srgb, var(--c-rose) 26%, var(--c-paper-deep));
  appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid var(--c-paper-soft);
  border-radius: 50%;
  background: var(--c-rose-deep);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--c-rose-deep) 34%, transparent);
  appearance: none;
}

.volume-slider::-moz-range-thumb {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid var(--c-paper-soft);
  border-radius: 50%;
  background: var(--c-rose-deep);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--c-rose-deep) 34%, transparent);
}

.volume-slider:focus-visible {
  outline: 2px solid var(--c-rose-deep);
  outline-offset: 5px;
}

.volume-pop-enter-active,
.volume-pop-leave-active {
  transition:
    opacity 180ms var(--ease-soft),
    transform 180ms var(--ease-romantic);
}

.volume-pop-enter-from,
.volume-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* Invite variant */
.music-invite {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: fit-content;
  max-width: 100%;
  padding: 0.65rem 0.95rem 0.65rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 20%, transparent);
  border-radius: 1.15rem;
  background: color-mix(in srgb, var(--c-paper-soft) 54%, transparent);
  color: var(--c-ink);
  text-align: left;
  box-shadow: 0 16px 36px -34px color-mix(in srgb, var(--c-ink) 48%, transparent);
  backdrop-filter: blur(10px);
  transition:
    border-color var(--dur-base) var(--ease-soft),
    background-color var(--dur-base) var(--ease-soft),
    transform var(--dur-base) var(--ease-romantic);
}

.music-invite:hover {
  border-color: color-mix(in srgb, var(--c-rose) 38%, transparent);
  background: color-mix(in srgb, var(--c-paper-soft) 76%, transparent);
  transform: translateY(-1px);
}

.music-invite.is-playing {
  border-color: color-mix(in srgb, var(--c-rose) 32%, transparent);
}

.music-invite__orb {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--c-rose), var(--c-rose-deep));
  color: var(--c-cream);
  box-shadow: 0 8px 16px -10px color-mix(in srgb, var(--c-rose-deep) 78%, transparent);
}

.music-invite__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.14rem;
}

.music-invite__prompt {
  overflow: hidden;
  color: var(--c-ink);
  font-family: var(--ff-hand);
  font-size: 1.24rem;
  font-weight: 500;
  line-height: 1.1;
  text-overflow: ellipsis;
}

.music-invite__action {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-sans);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1.3;
  text-transform: uppercase;
}

.music-invite__error {
  max-width: 24rem;
  margin-top: 0.45rem;
  color: var(--c-rose-deep);
  font-size: 0.72rem;
  line-height: 1.45;
}

@media (max-width: 860px) {
  .music-compact__label {
    display: none;
  }

  .music-compact__toggle {
    padding-inline: 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .equalizer span {
    animation: none;
    transform: scaleY(0.8);
  }
}
</style>
