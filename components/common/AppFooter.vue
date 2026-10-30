<script setup lang="ts">
import { ref } from 'vue'
import { Heart } from '@lucide/vue'
import { romanticConfig } from '~/config/romantic.config'

withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)

const messages = romanticConfig.messages
const open = ref(false)

function toggle(): void {
  open.value = !open.value
}
</script>

<template>
  <footer class="site-footer" :class="`site-footer--${tone}`">
    <p class="site-footer__note">
      {{ messages.footerNote }}
      <span aria-hidden="true">·</span>
      <span>💗</span>
    </p>

    <div class="site-footer__secret">
      <button
        type="button"
        class="secret-toggle"
        :aria-expanded="open"
        aria-controls="footer-secret"
        @click="toggle"
      >
        <Heart :size="12" :fill="open ? 'currentColor' : 'none'" aria-hidden="true" />
        {{ open ? messages.secretClose : messages.secretHint }}
      </button>
      <Transition name="secret">
        <p v-if="open" id="footer-secret" class="secret-note" role="status">
          {{ messages.secretNote }}
        </p>
      </Transition>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.4rem var(--page-gutter) 1.8rem;
  color: color-mix(in srgb, var(--c-ink-soft) 72%, transparent);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
}

.site-footer__note {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.site-footer__secret {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 1.7rem;
}

.secret-toggle {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.3rem;
  border: 0;
  background: transparent;
  color: color-mix(in srgb, var(--c-ink-soft) 64%, transparent);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color var(--dur-fast) var(--ease-soft);
}

.secret-toggle:hover {
  color: var(--c-rose-deep);
}

.secret-note {
  max-width: 22rem;
  margin-top: 0.1rem;
  color: var(--c-rose-deep);
  font-family: var(--ff-hand);
  font-size: 1.18rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.2;
  text-transform: none;
}

.site-footer--dark {
  color: color-mix(in srgb, #f6dfd9 62%, transparent);
}

.site-footer--dark .secret-toggle {
  color: color-mix(in srgb, #f6dfd9 56%, transparent);
}

.site-footer--dark .secret-toggle:hover,
.site-footer--dark .secret-note {
  color: color-mix(in srgb, #f6dfd9 92%, transparent);
}

.secret-enter-active,
.secret-leave-active {
  transition:
    opacity 300ms var(--ease-soft),
    transform 300ms var(--ease-romantic);
}

.secret-enter-from,
.secret-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
