<script setup lang="ts">
import { ref } from 'vue'
import { romanticConfig } from '~/config/romantic.config'

const emit = defineEmits<{
  confirm: []
}>()

const messages = romanticConfig.messages
const dialog = ref<HTMLDialogElement | null>(null)

function open(): void {
  if (dialog.value && !dialog.value.open) {
    dialog.value.showModal()
  }
}

function close(): void {
  dialog.value?.close()
}

function confirmReset(): void {
  emit('confirm')
  close()
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) {
    close()
  }
}

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    class="reset-dialog"
    aria-labelledby="reset-dialog-title"
    aria-describedby="reset-dialog-description"
    @click="handleBackdropClick"
  >
    <div class="reset-dialog__panel paper-panel paper-panel--plain">
      <HeartSeal :size="46" />
      <h2 id="reset-dialog-title" class="reset-dialog__title">
        {{ messages.restartTitle }}
      </h2>
      <p id="reset-dialog-description" class="reset-dialog__text">
        {{ messages.restartText }}
      </p>
      <div class="reset-dialog__actions">
        <BaseButton variant="secondary" size="md" autofocus @click="close">
          {{ messages.restartCancel }}
        </BaseButton>
        <BaseButton variant="primary" size="md" @click="confirmReset">
          {{ messages.restartConfirm }}
        </BaseButton>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.reset-dialog__panel {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.85rem;
  padding: 2rem;
  text-align: center;
}

.reset-dialog__title {
  margin-top: 0.25rem;
  font-size: 1.8rem;
  font-weight: 500;
}

.reset-dialog__text {
  max-width: 24rem;
  color: var(--c-ink-soft);
  font-size: 0.92rem;
  line-height: 1.65;
}

.reset-dialog__actions {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.7rem;
}

@media (min-width: 420px) {
  .reset-dialog__actions {
    flex-direction: row-reverse;
  }
}
</style>
