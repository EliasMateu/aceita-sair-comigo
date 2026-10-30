<script setup lang="ts">
import { Heart } from '@lucide/vue'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'

const messages = romanticConfig.messages
const copy = useCopy()
const { acceptInvitation, declineInvitation } = useDateFlow()

const maxDodges = romanticConfig.noButton.maxDodges
const MARGIN = 16

const noButtonRef = ref<HTMLButtonElement | null>(null)
const acceptButtonRef = ref<HTMLElement | null>(null)
const attempts = ref(0)
const isFloating = ref(false)
const isExhausted = ref(false)
const message = ref('')

const floatingPosition = reactive({ left: 0, top: 0 })
const buttonSize = reactive({ width: 0, height: 0 })

let lastPointerDodge = 0

const floatingStyle = computed(() => ({
  left: `${floatingPosition.left}px`,
  top: `${floatingPosition.top}px`,
  width: `${buttonSize.width}px`,
  height: `${buttonSize.height}px`,
}))

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min: number, max: number): number {
  if (max <= min) return min
  return min + Math.random() * (max - min)
}

function rectanglesOverlap(
  a: { left: number; top: number; width: number; height: number },
  b: DOMRect,
  padding = 12,
): boolean {
  return !(
    a.left + a.width + padding < b.left ||
    a.left > b.right + padding ||
    a.top + a.height + padding < b.top ||
    a.top > b.bottom + padding
  )
}

function choosePosition(): { left: number; top: number } {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const maxLeft = Math.max(MARGIN, viewportWidth - buttonSize.width - MARGIN)
  const maxTop = Math.max(MARGIN, viewportHeight - buttonSize.height - MARGIN)
  const acceptRect = acceptButtonRef.value?.getBoundingClientRect() ?? null
  const minDistance = Math.min(
    180,
    Math.max(70, Math.min(viewportWidth, viewportHeight) * 0.22),
  )

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const candidate = {
      left: randomBetween(MARGIN, maxLeft),
      top: randomBetween(MARGIN, maxTop),
    }
    const candidateBox = {
      ...candidate,
      width: buttonSize.width,
      height: buttonSize.height,
    }
    const isFarEnough =
      Math.hypot(
        candidate.left - floatingPosition.left,
        candidate.top - floatingPosition.top,
      ) >= minDistance
    const avoidsAccept = !acceptRect || !rectanglesOverlap(candidateBox, acceptRect)

    if (isFarEnough && avoidsAccept) {
      return candidate
    }
  }

  return {
    left: randomBetween(MARGIN, maxLeft),
    top: randomBetween(MARGIN, maxTop),
  }
}

function ensureInViewport(): void {
  if (!isFloating.value) return

  const maxLeft = Math.max(
    MARGIN,
    window.innerWidth - buttonSize.width - MARGIN,
  )
  const maxTop = Math.max(
    MARGIN,
    window.innerHeight - buttonSize.height - MARGIN,
  )

  floatingPosition.left = clamp(floatingPosition.left, MARGIN, maxLeft)
  floatingPosition.top = clamp(floatingPosition.top, MARGIN, maxTop)
}

async function dodge(options: { focusAfter?: boolean } = {}): Promise<void> {
  if (isExhausted.value) return

  if (!isFloating.value) {
    const rect = noButtonRef.value?.getBoundingClientRect()
    if (!rect) return

    buttonSize.width = Math.min(rect.width, window.innerWidth - MARGIN * 2)
    buttonSize.height = rect.height
    floatingPosition.left = rect.left
    floatingPosition.top = rect.top
    isFloating.value = true

    await nextTick()
    void noButtonRef.value?.getBoundingClientRect()
  }

  attempts.value = Math.min(attempts.value + 1, maxDodges)

  if (attempts.value >= maxDodges) {
    isExhausted.value = true
    message.value = messages.noDodgeExhausted
  } else {
    const index = (attempts.value - 1) % messages.noDodgeMessages.length
    message.value = messages.noDodgeMessages[index] ?? ''
  }

  const nextPosition = choosePosition()
  floatingPosition.left = nextPosition.left
  floatingPosition.top = nextPosition.top

  if (options.focusAfter) {
    await nextTick()
    noButtonRef.value?.focus({ preventScroll: true })
  }
}

function handlePointerEnter(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || isExhausted.value) return

  const now = Date.now()
  if (now - lastPointerDodge < 360) return
  lastPointerDodge = now
  void dodge()
}

function handleNoClick(event: MouseEvent): void {
  if (isExhausted.value) {
    declineInvitation()
    return
  }

  void dodge({ focusAfter: event.detail === 0 })
}

function giveUpDodging(): void {
  isExhausted.value = true
  message.value = messages.noDodgeExhausted

  void nextTick(() => {
    noButtonRef.value?.focus({ preventScroll: true })
  })
}

function handleResize(): void {
  ensureInViewport()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.visualViewport?.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.visualViewport?.removeEventListener('resize', handleResize)
})
</script>

<template>
  <section class="invitation">
    <FloatingHearts tone="light" />

    <div class="invitation__inner page-gutter">
      <p class="eyebrow eyebrow--centered invitation__eyebrow animate-fade-up">
        {{ messages.invitationEyebrow }}
      </p>

      <div class="invitation__seal animate-seal-pop" aria-hidden="true">
        <HeartSeal :size="54" />
      </div>

      <div class="paper-panel invitation__card animate-fade-up" style="animation-delay: 80ms">
        <span class="invitation__edition" aria-hidden="true">convite · n.º 01</span>

        <AccentTitle
          :text="copy.format(messages.invitationTitle)"
          :accent="copy.format(messages.invitationTitleAccent)"
          as="h1"
          focusable
          class="title-md invitation__title"
        />

        <p class="lede invitation__lead">
          {{ copy.format(messages.invitationLead) }}
        </p>

        <OrnamentDivider class="invitation__divider" />

        <AccentTitle
          :text="copy.format(messages.invitationQuestion)"
          :accent="copy.format(messages.invitationQuestionAccent)"
          as="h2"
          class="invitation__question"
        />

        <div class="invitation__actions">
          <BaseButton
            id="accept-invitation"
            ref="acceptButtonRef"
            size="lg"
            class="invitation__yes"
            @click="acceptInvitation"
          >
            {{ messages.yesLabel }}
            <template #icon-right>
              <Heart :size="18" fill="currentColor" />
            </template>
          </BaseButton>

          <span class="invitation__no-slot">
            <button
              v-if="!isFloating"
              ref="noButtonRef"
              type="button"
              class="no-button"
              :aria-describedby="`${'no-dodge-help'} invitation-message`"
              @pointerenter="handlePointerEnter"
              @click="handleNoClick"
            >
              {{ messages.noLabel }}
              <span aria-hidden="true">🙈</span>
            </button>
            <span v-else class="no-button no-button--ghost" aria-hidden="true">
              {{ messages.noLabel }}
              <span aria-hidden="true">🙈</span>
            </span>
          </span>
        </div>

        <p
          id="invitation-message"
          class="invitation__message"
          role="status"
          aria-live="polite"
        >
          {{ message }}
        </p>

        <p id="no-dodge-help" class="sr-only">
          Brincadeira: este botão foge quando você tenta clicar. Se preferir,
          use a opção “{{ messages.noHelp }}” para pará-lo e responder com calma.
        </p>

        <button type="button" class="calm-link" @click="giveUpDodging">
          {{ messages.noHelp }}
        </button>

        <p class="hand-note invitation__note">
          {{ messages.invitationNote }}
        </p>
      </div>
    </div>

    <AppFooter />
  </section>

  <Teleport to="body">
    <button
      v-if="isFloating"
      ref="noButtonRef"
      type="button"
      class="no-button no-button--floating"
      :class="{ 'is-tired': isExhausted }"
      :style="floatingStyle"
      title="O botão está fugindo 👀"
      aria-describedby="no-dodge-help invitation-message"
      @pointerenter="handlePointerEnter"
      @click="handleNoClick"
    >
      {{ messages.noLabel }}
      <span aria-hidden="true">🙈</span>
    </button>
  </Teleport>
</template>

<style scoped>
.invitation {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.invitation__inner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-block: clamp(2.5rem, 7vh, 4.5rem);
}

.invitation__eyebrow {
  margin-bottom: 2.4rem;
}

.invitation__seal {
  position: relative;
  z-index: 2;
  margin-bottom: -1.6rem;
  filter: drop-shadow(
    0 8px 18px color-mix(in srgb, var(--c-rose-deep) 25%, transparent)
  );
}

.invitation__card {
  width: 100%;
  max-width: 44rem;
  padding: clamp(2.2rem, 6vw, 3.7rem) clamp(1.35rem, 5vw, 3.5rem)
    clamp(1.8rem, 4vw, 2.5rem);
  text-align: center;
}

.invitation__edition {
  position: absolute;
  top: 1.5rem;
  right: 1.7rem;
  color: color-mix(in srgb, var(--c-ink-soft) 60%, transparent);
  font-size: 0.53rem;
  font-weight: 800;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.invitation__title {
  max-width: 34rem;
  margin-inline: auto;
}

.invitation__lead {
  max-width: 30rem;
  margin: 1rem auto 0;
  font-size: 0.98rem;
}

.invitation__divider {
  margin-block: clamp(1.6rem, 4vw, 2.2rem);
}

.invitation__question {
  max-width: 32rem;
  margin-inline: auto;
  color: var(--c-ink);
  font-family: var(--ff-display);
  font-size: clamp(1.7rem, 4.8vw, 2.7rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-wrap: balance;
}

.invitation__actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-top: clamp(1.7rem, 4vw, 2.3rem);
}

.invitation__yes {
  width: min(100%, 17rem);
  flex: 0 1 17rem;
}

.invitation__no-slot {
  display: inline-flex;
  width: 9.5rem;
  flex: 0 0 auto;
  justify-content: center;
}

.no-button {
  display: inline-flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.8rem 1.25rem;
  border: 1px dashed color-mix(in srgb, var(--c-rose) 36%, var(--c-paper-deep));
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-paper-soft) 36%, transparent);
  color: var(--c-ink-soft);
  font-size: 0.94rem;
  font-weight: 800;
  line-height: 1.15;
  transition:
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft),
    color var(--dur-fast) var(--ease-soft),
    box-shadow var(--dur-base) var(--ease-romantic);
}

.no-button:hover {
  border-color: color-mix(in srgb, var(--c-rose) 62%, var(--c-paper-deep));
  background: var(--c-paper-soft);
  color: var(--c-rose-deep);
}

.no-button--ghost {
  visibility: hidden;
}

.no-button--floating {
  position: fixed;
  z-index: 80;
  margin: 0;
  border-style: solid;
  border-color: color-mix(in srgb, var(--c-rose) 44%, var(--c-paper-deep));
  background: color-mix(in srgb, var(--c-paper-soft) 96%, white);
  color: var(--c-rose-deep);
  box-shadow:
    0 20px 48px -20px color-mix(in srgb, var(--c-rose-deep) 58%, transparent),
    0 4px 16px -8px color-mix(in srgb, var(--c-ink) 26%, transparent);
  transition:
    left 580ms var(--ease-romantic),
    top 580ms var(--ease-romantic),
    box-shadow var(--dur-base) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft),
    background-color var(--dur-fast) var(--ease-soft);
}

.no-button--floating.is-tired {
  border-color: color-mix(in srgb, var(--c-rose) 62%, var(--c-paper-deep));
  background: var(--c-paper-soft);
}

.invitation__message {
  min-height: 2.9rem;
  padding-top: 1rem;
  color: var(--c-rose-deep);
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.5;
}

.calm-link {
  min-height: 2.5rem;
  padding: 0.2rem 0.3rem;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--c-ink-soft) 24%, transparent);
  background: transparent;
  color: color-mix(in srgb, var(--c-ink-soft) 78%, transparent);
  font-size: 0.69rem;
  font-weight: 700;
  line-height: 1.4;
  transition:
    color var(--dur-fast) var(--ease-soft),
    border-color var(--dur-fast) var(--ease-soft);
}

.calm-link:hover {
  border-color: color-mix(in srgb, var(--c-rose) 45%, transparent);
  color: var(--c-rose-deep);
}

.invitation__note {
  margin-top: 0.8rem;
  font-size: 1.25rem;
  opacity: 0.8;
  transform: rotate(-2deg);
}

@media (max-width: 560px) {
  .invitation__inner {
    padding-block: 1.7rem 1rem;
  }

  .invitation__eyebrow {
    margin-bottom: 2rem;
  }

  .invitation__seal {
    margin-bottom: -1.3rem;
  }

  .invitation__card {
    padding-top: 2.2rem;
  }

  .invitation__edition {
    display: none;
  }

  .invitation__actions {
    flex-direction: column;
    gap: 0.7rem;
  }

  .invitation__yes {
    width: 100%;
    flex: 0 0 auto;
    max-width: 20rem;
  }

  .invitation__no-slot {
    width: 12.5rem;
  }

  .invitation__message {
    min-height: 3.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .no-button--floating {
    transition: none;
  }
}
</style>
