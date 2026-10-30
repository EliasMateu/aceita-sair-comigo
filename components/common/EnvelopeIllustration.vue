<script setup lang="ts">
import { useId } from 'vue'

const rawId = useId()
const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')
const ids = {
  paper: `${uid}-paper`,
  front: `${uid}-front`,
  flap: `${uid}-flap`,
  wax: `${uid}-wax`,
  shadow: `${uid}-shadow`,
  letterShadow: `${uid}-letter-shadow`,
}
</script>

<template>
  <svg
    class="envelope-scene"
    viewBox="0 0 440 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="ids.paper" x1="110" y1="150" x2="336" y2="318" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--c-paper-soft)" />
        <stop offset="1" stop-color="var(--c-paper-deep)" />
      </linearGradient>
      <linearGradient :id="ids.front" x1="90" y1="160" x2="344" y2="320" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--c-paper-soft)" />
        <stop offset=".68" stop-color="var(--c-cream)" />
        <stop offset="1" stop-color="color-mix(in srgb, var(--c-blush) 72%, var(--c-paper))" />
      </linearGradient>
      <linearGradient :id="ids.flap" x1="220" y1="56" x2="220" y2="160" gradientUnits="userSpaceOnUse">
        <stop stop-color="color-mix(in srgb, var(--c-blush) 76%, var(--c-paper-soft))" />
        <stop offset="1" stop-color="var(--c-blush)" />
      </linearGradient>
      <radialGradient :id="ids.wax" cx="0" cy="0" r="1" gradientTransform="translate(202 230) rotate(52) scale(58)" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--c-rose)" />
        <stop offset=".55" stop-color="var(--c-rose-deep)" />
        <stop offset="1" stop-color="var(--c-red)" />
      </radialGradient>
      <filter :id="ids.shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="var(--c-rose-deep)" flood-opacity=".2" />
      </filter>
      <filter :id="ids.letterShadow" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="var(--c-rose-deep)" flood-opacity=".16" />
      </filter>
    </defs>

    <ellipse cx="220" cy="327" rx="155" ry="14" fill="color-mix(in srgb, var(--c-rose-deep) 14%, transparent)" />

    <g opacity=".55" stroke="var(--c-gold)" stroke-linecap="round">
      <g>
        <path d="M65 286c-14-36-10-77 8-116" stroke-width="1.2" />
        <ellipse cx="54" cy="243" rx="11" ry="5" transform="rotate(32 54 243)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="72" cy="260" rx="10" ry="4.5" transform="rotate(-28 72 260)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="59" cy="214" rx="10" ry="4.5" transform="rotate(38 59 214)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="73" cy="196" rx="8" ry="3.8" transform="rotate(-35 73 196)" fill="var(--c-lavender)" stroke="none" />
      </g>
      <g>
        <path d="M375 286c14-36 10-77-8-116" stroke-width="1.2" />
        <ellipse cx="386" cy="243" rx="11" ry="5" transform="rotate(-32 386 243)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="368" cy="260" rx="10" ry="4.5" transform="rotate(28 368 260)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="381" cy="214" rx="10" ry="4.5" transform="rotate(-38 381 214)" fill="var(--c-lavender)" stroke="none" />
        <ellipse cx="367" cy="196" rx="8" ry="3.8" transform="rotate(35 367 196)" fill="var(--c-lavender)" stroke="none" />
      </g>
    </g>

    <g transform="rotate(-3 220 190)" :filter="`url(#${ids.shadow})`">
      <path
        d="M63 158 220 58l157 100Z"
        :fill="`url(#${ids.flap})`"
        stroke="color-mix(in srgb, var(--c-rose) 32%, transparent)"
        stroke-width="1"
        stroke-linejoin="round"
      />

      <rect
        x="62"
        y="146"
        width="316"
        height="166"
        rx="14"
        :fill="`url(#${ids.paper})`"
        stroke="color-mix(in srgb, var(--c-rose) 32%, transparent)"
      />

      <g class="envelope-letter" :filter="`url(#${ids.letterShadow})`">
        <rect
          x="100"
          y="72"
          width="240"
          height="194"
          rx="3"
          fill="var(--c-paper-soft)"
          stroke="color-mix(in srgb, var(--c-rose) 24%, transparent)"
        />
        <rect
          x="109"
          y="81"
          width="222"
          height="176"
          rx="1.5"
          stroke="color-mix(in srgb, var(--c-gold) 28%, transparent)"
          stroke-dasharray="2 4"
        />
        <text
          x="220"
          y="122"
          text-anchor="middle"
          fill="var(--c-rose-deep)"
          font-family="'Playfair Display', Georgia, serif"
          font-size="21"
          font-style="italic"
          letter-spacing=".2"
        >
          para você
        </text>
        <path d="M178 137h84" stroke="color-mix(in srgb, var(--c-rose) 32%, transparent)" stroke-linecap="round" />
        <text
          x="220"
          y="164"
          text-anchor="middle"
          fill="color-mix(in srgb, var(--c-ink-soft) 82%, transparent)"
          font-family="'Caveat', cursive"
          font-size="16"
        >
          com carinho
        </text>
        <path
          d="M220 187c-1.1 0-2.2-.4-3-.95-5.3-3.8-8-6-8-8.8 0-1.75 1.3-3 3-3 1.1 0 2.1.6 3 1.7.9-1.1 1.9-1.7 3-1.7 1.7 0 3 1.25 3 3 0 2.8-2.7 5-8 8.8-.8.55-1.9.95-3 .95Z"
          fill="color-mix(in srgb, var(--c-rose) 55%, transparent)"
        />
      </g>

      <path
        d="M63 166 220 274l157-108v132c0 8-6 14-14 14H77c-8 0-14-6-14-14V166Z"
        :fill="`url(#${ids.front})`"
        stroke="color-mix(in srgb, var(--c-rose) 34%, transparent)"
      />
      <path
        d="M63 166 220 274l157-108"
        stroke="color-mix(in srgb, var(--c-rose) 22%, transparent)"
        stroke-width="1"
        stroke-linejoin="round"
      />
      <path
        d="M78 181c22 24 64 60 142 111 78-51 120-87 142-111"
        stroke="color-mix(in srgb, var(--c-gold) 24%, transparent)"
        stroke-width=".8"
        stroke-dasharray="3 5"
        stroke-linecap="round"
      />
      <circle cx="83" cy="170" r="2.5" fill="color-mix(in srgb, var(--c-gold) 56%, transparent)" />
      <circle cx="357" cy="170" r="2.5" fill="color-mix(in srgb, var(--c-gold) 56%, transparent)" />

      <g transform="translate(220 252)">
        <circle r="38" :fill="`url(#${ids.wax})`" />
        <circle r="30.5" stroke="color-mix(in srgb, var(--c-cream) 38%, transparent)" stroke-width=".9" stroke-dasharray="2.5 3.5" />
        <circle cx="-10" cy="-14" r="8" fill="color-mix(in srgb, white 16%, transparent)" />
        <path
          d="M0 13.6c-.55 0-1.1-.2-1.5-.48C-6.2 10.02-8 8.15-8 5.78-8 4.1-6.7 2.8-5 2.8c.75 0 1.5.4 2.2 1.18C-2.1 3.2-1.35 2.8-.6 2.8c1.7 0 3 1.3 3 2.98 0 2.37-1.8 4.24-5.5 7.34-.4.28-.95.48-1.5.48Z"
          fill="var(--c-cream)"
          transform="translate(6 6) scale(1.35)"
        />
      </g>
    </g>

    <g fill="var(--c-gold)" opacity=".72">
      <path d="M382 86c.5 5 .9 5.5 5 6-4.1.5-4.5 1-5 6-.5-5-.9-5.5-5-6 4.1-.5 4.5-1 5-6Z" />
      <path d="M55 105c.35 3.4.65 3.7 3.5 4.1-2.85.4-3.15.7-3.5 4.1-.35-3.4-.65-3.7-3.5-4.1 2.85-.4 3.15-.7 3.5-4.1Z" opacity=".6" />
    </g>
    <path
      d="M342 42c1 7 1.5 7.5 8 8.5-6.5 1-7 1.5-8 8.5-1-7-1.5-7.5-8-8.5 6.5-1 7-1.5 8-8.5Z"
      fill="var(--c-rose)"
      opacity=".3"
    />
  </svg>
</template>

<style scoped>
.envelope-scene {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.envelope-letter {
  transform-box: fill-box;
  transform-origin: center bottom;
  transition: transform 700ms var(--ease-romantic);
}

.envelope-scene:hover .envelope-letter {
  transform: translateY(-7px);
}

@media (prefers-reduced-motion: reduce) {
  .envelope-letter {
    transition: none;
  }

  .envelope-scene:hover .envelope-letter {
    transform: none;
  }
}
</style>
