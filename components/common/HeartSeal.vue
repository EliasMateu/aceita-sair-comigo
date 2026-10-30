<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
  }>(),
  { size: 48 },
)
</script>

<template>
  <span
    class="heart-seal"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <span class="heart-seal__wax">
      <svg viewBox="0 0 24 24" fill="none" class="heart-seal__heart">
        <path
          d="M12 20.2c-.36 0-.71-.13-.98-.38C6.9 16.07 3 12.58 3 8.62 3 5.9 5.06 4 7.62 4c1.65 0 3.12.87 4.38 2.58C13.26 4.87 14.73 4 16.38 4 18.94 4 21 5.9 21 8.62c0 3.96-3.9 7.45-8.02 11.2-.27.25-.62.38-.98.38Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </span>
</template>

<style scoped>
.heart-seal {
  position: relative;
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  filter: drop-shadow(
    0 5px 8px color-mix(in srgb, var(--c-rose-deep) 38%, transparent)
  );
}

.heart-seal__wax {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  border-radius: 47% 53% 50% 50% / 52% 47% 53% 48%;
  background:
    radial-gradient(
      circle at 32% 24%,
      color-mix(in srgb, var(--c-rose) 76%, white 24%),
      transparent 32%
    ),
    radial-gradient(
      circle at 62% 72%,
      color-mix(in srgb, var(--c-rose-deep) 88%, var(--c-red)),
      var(--c-rose-deep) 58%,
      color-mix(in srgb, var(--c-red) 82%, black) 100%
    );
  box-shadow:
    inset 0 1px 2px color-mix(in srgb, white 42%, transparent),
    inset 0 -4px 8px color-mix(in srgb, black 20%, transparent);
  color: var(--c-cream);
  transform: rotate(-5deg);
}

.heart-seal__wax::before {
  position: absolute;
  inset: 14%;
  border: 1px dashed color-mix(in srgb, var(--c-cream) 40%, transparent);
  border-radius: 50%;
  content: "";
}

.heart-seal__wax::after {
  position: absolute;
  top: 10%;
  left: 18%;
  width: 34%;
  height: 18%;
  border-radius: 50%;
  background: color-mix(in srgb, white 28%, transparent);
  content: "";
  filter: blur(2px);
  transform: rotate(-20deg);
}

.heart-seal__heart {
  position: relative;
  z-index: 1;
  width: 42%;
  height: 42%;
  transform: translateY(1px);
}
</style>
