<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'dark'
  }
})

const title = 'DevOps to DevSecOps Learning Roadmap'
const description = 'A comprehensive learning roadmap for transitioning from DevOps to DevSecOps, personalized for Fawzy Mohamed with Saudi Arabia market focus.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <span class="text-2xl">🚀</span>
          <span class="font-semibold text-lg hidden sm:inline">DevOps Roadmap</span>
        </NuxtLink>
      </template>

      <template #right>
        <UButton
          to="https://github.com"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
        />
      </template>
    </UHeader>

    <UMain class="min-h-screen">
      <UContainer>
        <NuxtPage />
      </UContainer>
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • DevOps Learning Roadmap © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
        />
      </template>
    </UFooter>
  </UApp>
</template>
