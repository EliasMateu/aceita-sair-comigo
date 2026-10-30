export type FlowStep =
  | 'welcome'
  | 'invitation'
  | 'declined'
  | 'celebration'
  | 'choose'
  | 'schedule'
  | 'summary'
  | 'finale'

export type DateOptionIcon =
  | 'film'
  | 'dinner'
  | 'dessert'
  | 'coffee'
  | 'surprise'
  | 'custom'

export interface DateOption {
  id: string
  icon: DateOptionIcon
  emoji: string
  title: string
  description: string
  accent: string
}

export interface DateSelections {
  optionId: string | null
  customIdea: string
  date: string | null
  time: string | null
  notes: string
  combineLater: boolean
}

export interface DateFlowState {
  step: FlowStep
  selections: DateSelections
}

export interface PersistedDateFlow extends DateFlowState {
  version: number
}

export interface RomanticTheme {
  paper: string
  paperDeep: string
  paperSoft: string
  cream: string
  ink: string
  inkSoft: string
  blush: string
  rose: string
  roseDeep: string
  red: string
  lavender: string
  lavenderDeep: string
  gold: string
}

export interface ScheduleSettings {
  timeSlots: string[]
  defaultTime: string | null
  maxMonthsAhead: number
}

export interface MusicSettings {
  enabled: boolean
  src: string
  title: string
  artist: string
  volume: number
}

export interface CalendarSettings {
  title: string
  description: string
  defaultDurationMinutes: number
  timeZone: string
  location: string
}

export interface CelebrationSettings {
  suspenseMs: number
  revealMs: number
  confettiPieces: number
}

export interface RomanticMessages {
  welcomeEyebrow: string
  welcomeTitle: string
  welcomeTitleAccent: string
  welcomeLead: string
  welcomeCta: string
  welcomeNote: string
  invitationEyebrow: string
  invitationTitle: string
  invitationTitleAccent: string
  invitationLead: string
  invitationQuestion: string
  invitationQuestionAccent: string
  invitationNote: string
  yesLabel: string
  noLabel: string
  noDodgeMessages: string[]
  declineEyebrow: string
  declineTitle: string
  declineTitleAccent: string
  declineText: string
  declineNote: string
  declineCta: string
  celebrationEyebrow: string
  celebrationSuspense: string
  celebrationTitle: string
  celebrationTitleAccent: string
  celebrationMessage: string
  celebrationSubmessage: string
  celebrationCta: string
  chooseEyebrow: string
  chooseTitle: string
  chooseTitleAccent: string
  chooseLead: string
  chooseContinue: string
  chooseCustomLabel: string
  chooseCustomPlaceholder: string
  chooseCustomError: string
  chooseErrorOption: string
  chooseNote: string
  scheduleEyebrow: string
  scheduleTitle: string
  scheduleTitleAccent: string
  scheduleLead: string
  scheduleModeDate: string
  scheduleModeDateHint: string
  scheduleModeLater: string
  scheduleModeLaterHint: string
  scheduleLaterTitle: string
  scheduleLaterText: string
  scheduleDateLabel: string
  scheduleTimeLabel: string
  scheduleTimeHint: string
  scheduleNotesLabel: string
  scheduleNotesPlaceholder: string
  scheduleContinue: string
  scheduleBack: string
  scheduleErrorDate: string
  scheduleErrorTime: string
  scheduleSavedNote: string
  summaryEyebrow: string
  summaryTitle: string
  summaryTitleAccent: string
  summaryLead: string
  summaryProgram: string
  summaryDate: string
  summaryTime: string
  summaryNotes: string
  summaryNone: string
  summaryCustomIdea: string
  summaryToCombine: string
  summaryToCombineNote: string
  summaryConfirm: string
  summaryNote: string
  summaryEdit: string
  summaryBack: string
  finaleEyebrow: string
  finaleTitle: string
  finaleTitleAccent: string
  finaleMessage: string
  finaleSubmessage: string
  finalePsLabel: string
  finalePs: string
  finaleSignature: string
  finaleWhatsApp: string
  finaleWhatsAppHint: string
  finaleGoogle: string
  finaleIcs: string
  finaleCalendarHint: string
  finaleNoDateTitle: string
  finaleNoDateText: string
  finaleEdit: string
  finaleRestart: string
  countdownLabel: string
  countdownDays: string
  countdownHours: string
  countdownMinutes: string
  countdownToday: string
  countdownPast: string
  footerNote: string
  restartTitle: string
  restartText: string
  restartConfirm: string
  restartCancel: string
  musicInvite: string
  musicActivate: string
  musicPause: string
  musicPlaying: string
  musicLabel: string
  musicVolume: string
  musicUnavailable: string
  secretHint: string
  secretNote: string
  secretClose: string
  whatsappGreeting: string
  whatsappIntro: string
  whatsappProgramLabel: string
  whatsappDateLabel: string
  whatsappTimeLabel: string
  whatsappNotesLabel: string
  whatsappCustomLabel: string
  whatsappToCombine: string
  whatsappClosing: string
  notFoundTitle: string
  notFoundText: string
  notFoundCta: string
}

export interface RomanticConfig {
  recipientName: string
  senderName: string
  whatsappNumber: string
  siteUrl: string
  siteTitle: string
  siteDescription: string
  ogImage: string
  messages: RomanticMessages
  theme: RomanticTheme
  dateOptions: DateOption[]
  schedule: ScheduleSettings
  music: MusicSettings
  calendar: CalendarSettings
  celebration: CelebrationSettings
}
