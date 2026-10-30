import type { RomanticTheme } from '~/types/date'

const themeVariableMap: Record<keyof RomanticTheme, string> = {
  paper: '--c-paper',
  paperDeep: '--c-paper-deep',
  paperSoft: '--c-paper-soft',
  cream: '--c-cream',
  ink: '--c-ink',
  inkSoft: '--c-ink-soft',
  blush: '--c-blush',
  rose: '--c-rose',
  roseDeep: '--c-rose-deep',
  red: '--c-red',
  lavender: '--c-lavender',
  lavenderDeep: '--c-lavender-deep',
  gold: '--c-gold',
}

/** Turns the central theme config into overridable CSS custom properties. */
export function buildThemeCss(theme: RomanticTheme): string {
  const declarations = (Object.keys(themeVariableMap) as Array<keyof RomanticTheme>)
    .map((key) => `${themeVariableMap[key]}:${theme[key]};`)
    .join('')

  return `:root{${declarations}}`
}
