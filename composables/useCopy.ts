import { romanticConfig } from '~/config/romantic.config'
import { fillTemplate, splitHighlight } from '~/utils/text'

export interface Copy {
  name: string
  sender: string
  format: (template: string) => string
  highlight: (text: string, accent: string) => ReturnType<typeof splitHighlight>
}

export function useCopy(): Copy {
  const name = romanticConfig.recipientName.trim() || 'você'
  const sender = romanticConfig.senderName.trim() || 'eu'

  const format = (template: string): string =>
    fillTemplate(template, { name, sender })

  return {
    name,
    sender,
    format,
    highlight: (text: string, accent: string) =>
      splitHighlight(format(text), format(accent)),
  }
}
