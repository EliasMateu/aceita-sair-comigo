<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { useCopy } from '~/composables/useCopy'
import { useDateFlow } from '~/composables/useDateFlow'
import { romanticConfig } from '~/config/romantic.config'

const messages = romanticConfig.messages
const copy = useCopy()
const { goTo } = useDateFlow()
</script>

<template>
  <section class="welcome">
    <FloatingHearts tone="light" />

    <div class="welcome__inner page-gutter content-wide">
      <div class="welcome__copy">
        <p class="eyebrow welcome__eyebrow animate-fade-up">
          {{ messages.welcomeEyebrow }}
        </p>

        <AccentTitle
          :text="copy.format(messages.welcomeTitle)"
          :accent="copy.format(messages.welcomeTitleAccent)"
          as="h1"
          focusable
          class="title-xl welcome__title animate-fade-up"
          style="animation-delay: 90ms"
        />

        <p class="lede welcome__lead animate-fade-up" style="animation-delay: 170ms">
          {{ copy.format(messages.welcomeLead) }}
        </p>

        <div class="welcome__actions animate-fade-up" style="animation-delay: 260ms">
          <BaseButton
            size="lg"
            class="welcome__cta"
            @click="goTo('invitation')"
          >
            {{ messages.welcomeCta }}
            <template #icon-right>
              <ArrowRight :size="18" />
            </template>
          </BaseButton>

          <p class="welcome__note">
            <span class="hand-note">{{ messages.welcomeNote }}</span>
          </p>
        </div>

        <div class="welcome__music animate-fade-up" style="animation-delay: 340ms">
          <MusicPlayer variant="invite" />
        </div>
      </div>

      <div class="welcome__art animate-fade-in" style="animation-delay: 220ms">
        <span class="welcome__halo" aria-hidden="true" />
        <span class="welcome__orbit" aria-hidden="true" />
        <div class="welcome__envelope animate-float-soft">
          <EnvelopeIllustration />
        </div>

        <div class="welcome__art-note" aria-hidden="true">
          <span class="hand-note">feito com calma,<br>pensando em você.</span>
          <svg viewBox="0 0 72 34" fill="none" class="welcome__arrow">
            <path
              d="M4 5c10 16 31 23 55 16"
              stroke="currentColor"
              stroke-width="1.1"
              stroke-linecap="round"
            />
            <path
              d="m52 15 8 6-5 8"
              stroke="currentColor"
              stroke-width="1.1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <span class="welcome__spark welcome__spark--one" aria-hidden="true">✦</span>
        <span class="welcome__spark welcome__spark--two" aria-hidden="true">✦</span>
      </div>
    </div>

    <AppFooter />
  </section>
</template>

<style scoped>
.welcome {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-h));
  flex-direction: column;
  overflow: hidden;
}

.welcome__inner {
  display: grid;
  flex: 1;
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  padding-block: clamp(2.2rem, 6vh, 5.5rem) 1rem;
}

.welcome__copy {
  position: relative;
  z-index: 1;
  max-width: 40rem;
}

.welcome__eyebrow {
  margin-bottom: clamp(1.2rem, 3vh, 2rem);
}

.welcome__title {
  margin-bottom: clamp(1.2rem, 3vh, 1.8rem);
  color: var(--c-ink);
}

.welcome__lead {
  max-width: 27rem;
  margin-bottom: 0;
}

.welcome__actions {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: clamp(1.7rem, 4vh, 2.6rem);
}

.welcome__cta {
  width: fit-content;
  min-width: 15rem;
}

.welcome__note {
  padding-left: 0.45rem;
  margin-top: 0.35rem;
  font-size: 1.32rem;
}

.welcome__music {
  margin-top: clamp(1.6rem, 4vh, 2.4rem);
}

.welcome__art {
  position: relative;
  width: min(78vw, 28rem);
  margin-inline: auto;
}

.welcome__halo {
  position: absolute;
  z-index: 0;
  top: 9%;
  left: 7%;
  width: 86%;
  height: 80%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--c-blush) 92%, white 8%) 0%,
    color-mix(in srgb, var(--c-lavender) 42%, transparent) 48%,
    transparent 72%
  );
  filter: blur(8px);
  opacity: 0.8;
}

.welcome__orbit {
  position: absolute;
  top: 3%;
  left: 1%;
  width: 98%;
  height: 94%;
  border: 1px solid color-mix(in srgb, var(--c-rose) 14%, transparent);
  border-radius: 50%;
  transform: rotate(-12deg);
}

.welcome__orbit::after {
  position: absolute;
  right: 12%;
  bottom: 12%;
  width: 0.45rem;
  height: 0.45rem;
  border: 1px solid color-mix(in srgb, var(--c-rose) 42%, transparent);
  border-radius: 50%;
  content: "";
  background: var(--c-paper);
}

.welcome__envelope {
  position: relative;
  z-index: 1;
}

.welcome__art-note {
  position: absolute;
  z-index: 2;
  right: -1rem;
  bottom: -0.4rem;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  color: var(--c-rose-deep);
  opacity: 0.9;
  text-align: right;
  transform: rotate(-4deg);
}

.welcome__art-note .hand-note {
  font-size: 1.18rem;
  line-height: 1.05;
}

.welcome__arrow {
  width: 3.8rem;
  height: auto;
  margin-top: 0.4rem;
  margin-right: 2.1rem;
  color: color-mix(in srgb, var(--c-rose) 55%, transparent);
  transform: rotate(-8deg);
}

.welcome__spark {
  position: absolute;
  z-index: 2;
  color: var(--c-gold);
  font-size: 0.75rem;
  opacity: 0.7;
}

.welcome__spark--one {
  top: 18%;
  left: 2%;
}

.welcome__spark--two {
  top: 46%;
  right: 0;
  font-size: 0.52rem;
  opacity: 0.5;
}

@media (min-width: 1024px) {
  .welcome__inner {
    grid-template-columns: minmax(0, 1.04fr) minmax(22rem, 0.96fr);
    padding-block: clamp(3rem, 7vh, 6rem) 2rem;
  }

  .welcome__art {
    width: min(100%, 33rem);
  }

  .welcome__art-note {
    right: -0.4rem;
    bottom: 0.6rem;
  }
}

@media (max-width: 1023px) {
  .welcome__inner {
    justify-items: center;
    padding-top: clamp(1.8rem, 5vh, 3rem);
    text-align: center;
  }

  .welcome__copy {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .welcome__title {
    max-width: 34rem;
  }

  .welcome__lead {
    margin-inline: auto;
  }

  .welcome__actions {
    align-items: center;
  }

  .welcome__note {
    padding-left: 0;
    text-align: center;
  }

  .welcome__art {
    width: min(66vw, 20rem);
  }

  .welcome__art-note {
    right: -2.4rem;
    bottom: -0.2rem;
  }

  .welcome__art-note .hand-note {
    font-size: 1.05rem;
  }
}

@media (max-width: 480px) {
  .welcome__inner {
    padding-top: 1.3rem;
  }

  .welcome__cta {
    width: 100%;
    min-width: 0;
  }

  .welcome__art {
    width: min(72vw, 17rem);
  }

  .welcome__art-note {
    right: -1.4rem;
    bottom: -1rem;
  }

  .welcome__arrow {
    display: none;
  }

  .welcome__eyebrow {
    margin-bottom: 1rem;
  }

  .welcome__music {
    width: 100%;
  }
}
</style>
