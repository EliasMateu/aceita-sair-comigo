<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const root = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
let frame = 0

const dots = [
  { left: '12%', top: '18%', size: 3, opacity: 0.45 },
  { left: '24%', top: '72%', size: 2, opacity: 0.32 },
  { left: '42%', top: '11%', size: 2, opacity: 0.25 },
  { left: '61%', top: '82%', size: 3, opacity: 0.3 },
  { left: '77%', top: '16%', size: 2, opacity: 0.38 },
  { left: '89%', top: '57%', size: 2, opacity: 0.24 },
  { left: '52%', top: '46%', size: 1.5, opacity: 0.28 },
]

function handlePointerMove(event: PointerEvent): void {
  if (reduced.value || event.pointerType !== 'mouse' || frame) return

  frame = window.requestAnimationFrame(() => {
    frame = 0
    const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5
    const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5
    root.value?.style.setProperty('--pointer-x', x.toFixed(3))
    root.value?.style.setProperty('--pointer-y', y.toFixed(3))
  })
}

onMounted(() => {
  if (window.matchMedia('(pointer: fine)').matches && !reduced.value) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  if (frame) window.cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="root" class="ambient" aria-hidden="true">
    <span class="ambient__orb ambient__orb--rose" />
    <span class="ambient__orb ambient__orb--lavender" />
    <span class="ambient__orb ambient__orb--gold" />
    <span class="ambient__ring ambient__ring--one" />
    <span class="ambient__ring ambient__ring--two" />
    <span
      v-for="(dot, index) in dots"
      :key="index"
      class="ambient__dot"
      :style="{
        left: dot.left,
        top: dot.top,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        opacity: dot.opacity,
      }"
    />
    <div class="ambient__grain grain-texture" />
  </div>
</template>

<style scoped>
.ambient {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ambient__orb {
  position: absolute;
  display: block;
  border-radius: 999px;
  filter: blur(2px);
  transition: transform 1.6s var(--ease-soft);
  will-change: transform;
}

.ambient__orb--rose {
  top: -24vw;
  left: -16vw;
  width: min(76vw, 58rem);
  height: min(76vw, 58rem);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--c-blush) 78%, transparent) 0%,
    color-mix(in srgb, var(--c-blush) 28%, transparent) 42%,
    transparent 70%
  );
  opacity: 0.85;
  transform: translate3d(
    calc(var(--pointer-x, 0) * 18px),
    calc(var(--pointer-y, 0) * 18px),
    0
  );
}

.ambient__orb--lavender {
  top: -22vw;
  right: -20vw;
  width: min(70vw, 52rem);
  height: min(70vw, 52rem);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--c-lavender) 72%, transparent) 0%,
    transparent 68%
  );
  opacity: 0.8;
  transform: translate3d(
    calc(var(--pointer-x, 0) * -22px),
    calc(var(--pointer-y, 0) * 14px),
    0
  );
}

.ambient__orb--gold {
  right: 6%;
  bottom: -30vw;
  width: min(58vw, 44rem);
  height: min(58vw, 44rem);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--c-gold) 12%, transparent) 0%,
    transparent 66%
  );
  opacity: 0.55;
  transform: translate3d(
    calc(var(--pointer-x, 0) * 10px),
    calc(var(--pointer-y, 0) * -10px),
    0
  );
}

.ambient__ring {
  position: absolute;
  display: block;
  border: 1px solid color-mix(in srgb, var(--c-rose) 12%, transparent);
  border-radius: 50%;
}

.ambient__ring--one {
  top: 16%;
  right: -14rem;
  width: 32rem;
  height: 32rem;
}

.ambient__ring--two {
  bottom: -18rem;
  left: -10rem;
  width: 27rem;
  height: 27rem;
  border-color: color-mix(in srgb, var(--c-lavender-deep) 10%, transparent);
}

.ambient__dot {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: var(--c-gold);
}

.ambient__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

@media (max-width: 640px) {
  .ambient__ring {
    opacity: 0.55;
  }

  .ambient__orb {
    filter: blur(0);
  }
}
</style>
