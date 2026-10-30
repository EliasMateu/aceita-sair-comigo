<script setup lang="ts">
import { romanticConfig } from '~/config/romantic.config'
import { buildThemeCss } from '~/utils/theme'

const normalizedSiteUrl = romanticConfig.siteUrl.replace(/\/+$/, '')
const absoluteOgImage = normalizedSiteUrl
  ? `${normalizedSiteUrl}${romanticConfig.ogImage}`
  : romanticConfig.ogImage

useHead({
  style: [
    {
      key: 'romantic-theme',
      textContent: buildThemeCss(romanticConfig.theme),
    },
  ],
  link: normalizedSiteUrl
    ? [{ rel: 'canonical', href: normalizedSiteUrl }]
    : [],
})

useSeoMeta({
  title: romanticConfig.siteTitle,
  description: romanticConfig.siteDescription,
  ogTitle: romanticConfig.siteTitle,
  ogDescription: romanticConfig.siteDescription,
  ogType: 'website',
  ogLocale: 'pt_BR',
  ogImage: absoluteOgImage,
  ogUrl: normalizedSiteUrl || undefined,
  twitterCard: 'summary_large_image',
  twitterTitle: romanticConfig.siteTitle,
  twitterDescription: romanticConfig.siteDescription,
  twitterImage: absoluteOgImage,
})
</script>

<template>
  <NuxtPage />
</template>
