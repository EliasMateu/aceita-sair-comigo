<script setup lang="ts">
import { computed } from 'vue'
import { splitHighlight } from '~/utils/text'

const props = withDefaults(
  defineProps<{
    text: string
    accent?: string
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
    focusable?: boolean
    accentClass?: string
  }>(),
  {
    accent: '',
    as: 'h1',
    focusable: false,
    accentClass: 'accent-italic',
  },
)

const parts = computed(() => splitHighlight(props.text, props.accent))
</script>

<template>
  <component
    :is="as"
    :tabindex="focusable ? -1 : undefined"
    :data-step-heading="focusable ? '' : undefined"
    class="accent-title"
  >
    <template v-if="parts.highlight">
      {{ parts.before }}<em :class="accentClass">{{ parts.highlight }}</em>{{ parts.after }}
    </template>
    <template v-else>{{ text }}</template>
  </component>
</template>

<style scoped>
.accent-title:focus {
  outline: none;
}
</style>
