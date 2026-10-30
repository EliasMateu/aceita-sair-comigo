export interface TemplateValues {
  name: string
  sender: string
}

export function fillTemplate(template: string, values: TemplateValues): string {
  return template
    .replaceAll('{nome}', values.name)
    .replaceAll('{remetente}', values.sender)
}

export interface HighlightedText {
  before: string
  highlight: string
  after: string
}

/**
 * Splits a sentence around the first occurrence of a word, so the heading
 * can style that word without ever injecting HTML.
 */
export function splitHighlight(text: string, highlight: string): HighlightedText {
  if (!highlight) {
    return { before: text, highlight: '', after: '' }
  }

  const index = text.indexOf(highlight)

  if (index < 0) {
    return { before: text, highlight: '', after: '' }
  }

  return {
    before: text.slice(0, index),
    highlight,
    after: text.slice(index + highlight.length),
  }
}

export function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}
