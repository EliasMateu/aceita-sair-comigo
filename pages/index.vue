<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type Component } from 'vue'
import DeclinedStep from '~/components/steps/DeclinedStep.vue'
import InvitationStep from '~/components/steps/InvitationStep.vue'
import WelcomeStep from '~/components/steps/WelcomeStep.vue'
import { useDateFlow } from '~/composables/useDateFlow'
import { useReducedMotion } from '~/composables/useReducedMotion'
import type { FlowStep } from '~/types/date'

const { state, hydrate, persist, reset } = useDateFlow()
const reduced = useReducedMotion()

const main = ref<HTMLElement | null>(null)
const resetDialog = ref<{ open: () => void } | null>(null)

const stepComponents: Partial<Record<FlowStep, Component>> = {
  welcome: WelcomeStep,
  invitation: InvitationStep,
  declined: DeclinedStep,
}

const currentComponent = computed(
  () => stepComponents[state.value.step] ?? WelcomeStep,
)

const isNight = computed(() => state.value.step === 'celebration')

function openReset(): void {
  resetDialog.value?.open()
}

function confirmReset(): void {
  reset()
}

function focusesOnEntry(): void {
  const heading = main.value?.querySelector<HTMLElement>('[data-step-heading]')
  heading?.focus({ preventScroll: true })
}

async function handleAfterEnter(): Promise<void> {
  await nextTick()
  focusesOnEntry()
}

watch(
  () => state.value.step,
  async () => {
    await nextTick()
    window.scrollTo({
      top: 0,
      behavior: reduced.value ? 'auto' : 'smooth',
    })
  },
)

onMounted(() => {
  hydrate()
  watch(() => state.value, persist, { deep: true })
})
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--night': isNight }">
    <a class="skip-link" href="#conteudo">Pular para o convite</a>

    <AmbientBackground v-if="!isNight" />

    <AppHeader :tone="isNight ? 'dark' : 'light'" @restart="openReset" />

    <main id="conteudo" ref="main" class="app-main" tabindex="-1">
      <Transition name="scene" mode="out-in" @after-enter="handleAfterEnter">
        <component :is="currentComponent" :key="state.step" />
      </Transition>
    </main>

    <ResetDialog ref="resetDialog" @confirm="confirmReset" />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  background-color: var(--c-paper);
  transition: background-color 620ms var(--ease-soft);
}

.app-shell--night {
  background-color: #24171d;
}

.app-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.app-main:focus {
  outline: none;
}
</style>
