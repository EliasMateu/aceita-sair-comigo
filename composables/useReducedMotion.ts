import { onBeforeUnmount, onMounted, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

export function useReducedMotion() {
  const reduced = ref(false)

  onMounted(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia(QUERY)
    reduced.value = mediaQuery.matches

    const update = (event: MediaQueryListEvent) => {
      reduced.value = event.matches
    }

    mediaQuery.addEventListener('change', update)
    onBeforeUnmount(() => mediaQuery.removeEventListener('change', update))
  })

  return reduced
}
