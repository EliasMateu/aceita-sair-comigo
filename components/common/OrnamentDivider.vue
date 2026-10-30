<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'rose' | 'cream' | 'gold'
  }>(),
  { tone: 'rose' },
)
</script>

<template>
  <div class="ornament-divider" :class="`ornament-divider--${tone}`" aria-hidden="true">
    <span class="ornament-divider__line" />
    <svg class="ornament-divider__heart" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.2c-.36 0-.71-.13-.98-.38C6.9 16.07 3 12.58 3 8.62 3 5.9 5.06 4 7.62 4c1.65 0 3.12.87 4.38 2.58C13.26 4.87 14.73 4 16.38 4 18.94 4 21 5.9 21 8.62c0 3.96-3.9 7.45-8.02 11.2-.27.25-.62.38-.98.38Z"
        fill="currentColor"
      />
    </svg>
    <span class="ornament-divider__line" />
  </div>
</template>

<style scoped>
.ornament-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  width: min(100%, 15rem);
  margin-inline: auto;
  color: color-mix(in srgb, var(--c-rose) 66%, transparent);
}

.ornament-divider--cream {
  color: color-mix(in srgb, var(--c-cream) 60%, transparent);
}

.ornament-divider--gold {
  color: color-mix(in srgb, var(--c-gold) 78%, transparent);
}

.ornament-divider__line {
  height: 1px;
  flex: 1;
  background: currentColor;
  opacity: 0.55;
}

.ornament-divider__heart {
  width: 0.8rem;
  height: 0.8rem;
  flex: 0 0 auto;
  opacity: 0.95;
}
</style>
