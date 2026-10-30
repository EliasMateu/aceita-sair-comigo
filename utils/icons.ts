import type { Component } from 'vue'
import {
  Coffee,
  Film,
  IceCreamBowl,
  PencilLine,
  Sparkles,
  UtensilsCrossed,
} from '@lucide/vue'
import type { DateOptionIcon } from '~/types/date'

export const dateOptionIcons: Record<DateOptionIcon, Component> = {
  film: Film,
  dinner: UtensilsCrossed,
  dessert: IceCreamBowl,
  coffee: Coffee,
  surprise: Sparkles,
  custom: PencilLine,
}

export function getDateOptionIcon(icon: DateOptionIcon): Component {
  return dateOptionIcons[icon] ?? Sparkles
}
