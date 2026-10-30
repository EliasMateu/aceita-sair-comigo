import type { PlanSummary } from './plan'

export interface WhatsAppCopy {
  greeting: string
  intro: string
  programLabel: string
  customLabel: string
  dateLabel: string
  timeLabel: string
  notesLabel: string
  closing: string
}

export interface WhatsAppMessageInput {
  copy: WhatsAppCopy
  plan: PlanSummary
}

/** Keeps only digits, accepting pasted numbers with +, spaces or dashes. */
export function sanitizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function buildWhatsAppMessage({
  copy,
  plan,
}: WhatsAppMessageInput): string {
  const lines: string[] = [copy.greeting, copy.intro, '']

  if (plan.program.title) {
    lines.push(`${copy.programLabel}: ${plan.program.title}`)
  }

  if (plan.program.isCustom && plan.program.detail) {
    lines.push(`${copy.customLabel}: ${plan.program.detail}`)
  }

  lines.push(`${copy.dateLabel}: ${plan.dateLabel}`)
  lines.push(`${copy.timeLabel}: ${plan.timeLabel}`)

  if (plan.notes) {
    lines.push(`${copy.notesLabel}: ${plan.notes}`)
  }

  lines.push('', copy.closing)

  return lines.join('\n')
}

/**
 * Builds a wa.me link. Returns null when the configured number is too short,
 * so the UI can hide the action instead of opening a broken conversation.
 */
export function buildWhatsAppUrl(
  number: string,
  message: string,
): string | null {
  const digits = sanitizeWhatsAppNumber(number)
  if (digits.length < 10) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
