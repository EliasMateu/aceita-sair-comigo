<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'light' | 'dark'
  }>(),
  { tone: 'light' },
)

interface HeartSpec {
  left: string
  top: string
  size: number
  delay: number
  duration: number
  drift: string
  rotate: string
  opacity: number
  filled: boolean
  color: 'rose' | 'gold' | 'lavender' | 'cream'
}

const hearts: HeartSpec[] = [
  { left: '7%', top: '24%', size: 15, delay: -2, duration: 22, drift: '24px', rotate: '18deg', opacity: 0.34, filled: true, color: 'rose' },
  { left: '16%', top: '68%', size: 10, delay: -9, duration: 26, drift: '-16px', rotate: '-22deg', opacity: 0.26, filled: false, color: 'rose' },
  { left: '28%', top: '14%', size: 8, delay: -4, duration: 29, drift: '15px', rotate: '30deg', opacity: 0.24, filled: false, color: 'gold' },
  { left: '46%', top: '78%', size: 13, delay: -13, duration: 24, drift: '20px', rotate: '-16deg', opacity: 0.22, filled: true, color: 'rose' },
  { left: '58%', top: '19%', size: 9, delay: -7, duration: 27, drift: '-20px', rotate: '26deg', opacity: 0.3, filled: false, color: 'lavender' },
  { left: '71%', top: '60%', size: 17, delay: -3, duration: 24, drift: '26px', rotate: '-25deg', opacity: 0.28, filled: true, color: 'rose' },
  { left: '83%', top: '33%', size: 11, delay: -11, duration: 28, drift: '-18px', rotate: '18deg', opacity: 0.34, filled: false, color: 'gold' },
  { left: '91%', top: '76%', size: 14, delay: -6, duration: 21, drift: '18px', rotate: '-18deg', opacity: 0.24, filled: true, color: 'rose' },
  { left: '36%', top: '42%', size: 7, delay: -15, duration: 31, drift: '-12px', rotate: '32deg', opacity: 0.2, filled: true, color: 'lavender' },
  { left: '64%', top: '88%', size: 8, delay: -18, duration: 30, drift: '14px', rotate: '20deg', opacity: 0.2, filled: false, color: 'rose' },
]
</script>

<template>
  <div class="floating-hearts" :class="`floating-hearts--${tone}`" aria-hidden="true">
    <span
      v-for="(heart, index) in hearts"
      :key="index"
      class="floating-hearts__item"
      :style="{
        left: heart.left,
        top: heart.top,
        width: `${heart.size}px`,
        height: `${heart.size}px`,
        '--heart-opacity': heart.opacity,
        '--heart-drift-x': heart.drift,
        '--heart-rotate': heart.rotate,
        '--heart-duration': `${heart.duration}s`,
        '--heart-delay': `${heart.delay}s`,
      }"
      :class="`floating-hearts__item--${heart.color}`"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20.2c-.36 0-.71-.13-.98-.38C6.9 16.07 3 12.58 3 8.62 3 5.9 5.06 4 7.62 4c1.65 0 3.12.87 4.38 2.58C13.26 4.87 14.73 4 16.38 4 18.94 4 21 5.9 21 8.62c0 3.96-3.9 7.45-8.02 11.2-.27.25-.62.38-.98.38Z"
          :fill="heart.filled ? 'currentColor' : 'none'"
          stroke="currentColor"
          :stroke-width="heart.filled ? 0 : 1.3"
        />
      </svg>
    </span>
  </div>
</template>

<style scoped>
.floating-hearts {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-hearts__item {
  position: absolute;
  display: block;
  color: var(--c-rose);
  animation: drift-heart var(--heart-duration) ease-in-out infinite;
  animation-delay: var(--heart-delay);
  opacity: 0;
  will-change: transform, opacity;
}

.floating-hearts__item--gold {
  color: var(--c-gold);
}

.floating-hearts__item--lavender {
  color: var(--c-lavender-deep);
}

.floating-hearts__item--cream {
  color: var(--c-cream);
}

.floating-hearts--dark .floating-hearts__item--rose {
  color: color-mix(in srgb, var(--c-rose) 74%, var(--c-cream));
}

.floating-hearts__item svg {
  width: 100%;
  height: 100%;
}

@media (max-width: 640px) {
  .floating-hearts__item:nth-child(n + 7) {
    display: none;
  }
}
</style>
