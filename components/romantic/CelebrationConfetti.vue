<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    pieces?: number
  }>(),
  {
    active: true,
    pieces: 100,
  },
)

interface ConfettiPiece {
  id: number
  shape: 'rect' | 'heart'
  color: string
  left: string
  top: string
  size: number
  dx: string
  dy: string
  rotate: string
  delay: number
  duration: number
  opacity: number
}

const palette = [
  '#F3C4CB',
  '#E9D8B4',
  '#D8C7E5',
  '#FFF4EA',
  '#C67B86',
  '#E8A0AC',
] as const

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

const computedPieces = computed<ConfettiPiece[]>(() =>
  Array.from({ length: props.pieces }, (_, index) => {
    const r1 = pseudoRandom(index + 1)
    const r2 = pseudoRandom(index + 11)
    const r3 = pseudoRandom(index + 23)
    const r4 = pseudoRandom(index + 37)
    const r5 = pseudoRandom(index + 53)
    const r6 = pseudoRandom(index + 71)
    const r7 = pseudoRandom(index + 97)

    return {
      id: index,
      shape: index % 5 === 0 ? 'heart' : 'rect',
      color: palette[index % palette.length] ?? '#F3C4CB',
      left: `${50 + (r1 - 0.5) * 12}%`,
      top: `${42 + (r2 - 0.5) * 10}%`,
      size: 5 + Math.round(r3 * 7),
      dx: `${(r4 - 0.5) * 92}vw`,
      dy: `${28 + r5 * 70}vh`,
      rotate: `${Math.round((r6 - 0.5) * 1080)}deg`,
      delay: r7 * 0.45,
      duration: 2.6 + r2 * 2.2,
      opacity: 0.6 + r3 * 0.4,
    }
  }),
)
</script>

<template>
  <div v-if="active" class="confetti" aria-hidden="true">
    <template v-for="piece in computedPieces" :key="piece.id">
      <span
        v-if="piece.shape === 'heart'"
        class="confetti__piece confetti__piece--heart"
        :style="{
          left: piece.left,
          top: piece.top,
          color: piece.color,
          fontSize: `${piece.size + 4}px`,
          opacity: piece.opacity,
          '--confetti-x': piece.dx,
          '--confetti-y': piece.dy,
          '--confetti-rotate': piece.rotate,
          '--confetti-delay': `${piece.delay}s`,
          '--confetti-duration': `${piece.duration}s`,
        }"
      >
        ♥
      </span>
      <span
        v-else
        class="confetti__piece confetti__piece--rect"
        :style="{
          left: piece.left,
          top: piece.top,
          width: `${piece.size}px`,
          height: `${piece.size * 0.45}px`,
          backgroundColor: piece.color,
          opacity: piece.opacity,
          '--confetti-x': piece.dx,
          '--confetti-y': piece.dy,
          '--confetti-rotate': piece.rotate,
          '--confetti-delay': `${piece.delay}s`,
          '--confetti-duration': `${piece.duration}s`,
        }"
      />
    </template>
  </div>
</template>

<style scoped>
.confetti {
  position: absolute;
  z-index: 1;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.confetti__piece {
  position: absolute;
  display: block;
  will-change: transform, opacity;
  animation: confetti-burst var(--confetti-duration) cubic-bezier(0.18, 0.7, 0.3, 1)
    var(--confetti-delay) both;
}

.confetti__piece--rect {
  border-radius: 1px;
  transform-origin: center;
}

.confetti__piece--heart {
  font-family: Georgia, serif;
  line-height: 1;
}

@keyframes confetti-burst {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(0deg) scale(0.35);
  }

  6% {
    opacity: var(--confetti-opacity, 1);
  }

  65% {
    opacity: 0.95;
  }

  100% {
    opacity: 0;
    transform: translate3d(var(--confetti-x), var(--confetti-y), 0)
      rotate(var(--confetti-rotate)) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
}
</style>
