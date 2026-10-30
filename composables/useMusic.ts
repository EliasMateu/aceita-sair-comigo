import { computed, onMounted } from 'vue'
import { romanticConfig } from '~/config/romantic.config'

const VOLUME_STORAGE_KEY = 'aceita-sair-comigo:volume'

interface MusicState {
  playing: boolean
  loading: boolean
  error: string | null
  volume: number
}

let audio: HTMLAudioElement | null = null

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return romanticConfig.music.volume
  return Math.min(1, Math.max(0, value))
}

function readStoredVolume(): number | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(VOLUME_STORAGE_KEY)
    if (raw === null) return null
    const value = Number(raw)
    return Number.isFinite(value) ? clampVolume(value) : null
  } catch {
    return null
  }
}

function storeVolume(value: number): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(VOLUME_STORAGE_KEY, String(value))
  } catch {
    // Optional preference; the player works without it.
  }
}

function updateMediaSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: romanticConfig.music.title,
      artist: romanticConfig.music.artist,
      album: 'Um convite, só pra você',
    })
    navigator.mediaSession.playbackState = 'playing'
  } catch {
    // Metadata is a progressive enhancement.
  }
}

export function useMusic() {
  const settings = romanticConfig.music
  const state = useState<MusicState>('romantic-music', () => ({
    playing: false,
    loading: false,
    error: null,
    volume: settings.volume,
  }))

  const available = computed(() => settings.enabled && Boolean(settings.src))
  const hasError = computed(() => state.value.error !== null)

  onMounted(() => {
    const stored = readStoredVolume()
    if (stored !== null) {
      state.value.volume = stored
      if (audio) audio.volume = stored
    }
  })

  function ensureAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined' || !available.value) return null
    if (audio) return audio

    audio = new Audio(settings.src)
    audio.loop = true
    audio.preload = 'metadata'
    audio.volume = clampVolume(state.value.volume)

    audio.addEventListener('play', () => {
      state.value.playing = true
      state.value.loading = false
    })
    audio.addEventListener('pause', () => {
      state.value.playing = false
    })
    audio.addEventListener('waiting', () => {
      state.value.loading = true
    })
    audio.addEventListener('canplay', () => {
      state.value.loading = false
    })
    audio.addEventListener('error', () => {
      state.value.loading = false
      state.value.playing = false
      state.value.error = romanticConfig.messages.musicUnavailable
    })

    return audio
  }

  async function play(): Promise<void> {
    if (!available.value || state.value.loading) return
    const element = ensureAudio()
    if (!element) return

    state.value.error = null
    state.value.loading = true
    element.volume = clampVolume(state.value.volume)

    try {
      await element.play()
      updateMediaSession()
    } catch {
      state.value.error = romanticConfig.messages.musicUnavailable
      state.value.playing = false
    } finally {
      state.value.loading = false
    }
  }

  function pause(): void {
    if (audio) {
      audio.pause()
    } else {
      state.value.playing = false
    }

    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'paused'
      } catch {
        // Optional.
      }
    }
  }

  function toggle(): void {
    if (state.value.playing) {
      pause()
    } else {
      void play()
    }
  }

  function setVolume(value: number): void {
    const volume = clampVolume(value)
    state.value.volume = volume
    if (audio) audio.volume = volume
    storeVolume(volume)
  }

  return {
    settings,
    state,
    available,
    hasError,
    play,
    pause,
    toggle,
    setVolume,
  }
}
