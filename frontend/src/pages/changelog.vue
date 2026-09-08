<template>
  <LegalPage
    title="Changelog"
    lead="Every notable change to AutoScroll, newest first."
    eyebrow="Home"
    eyebrow-to="/"
    title-suffix="Changelog"
  >
    <div class="changelog-content" v-html="renderedChangelog" />
  </LegalPage>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import LegalPage from '@/components/LegalPage.vue'
import changelogRaw from '../../../CHANGELOG.md?raw'

// Drop the leading "# Changelog" title/intro blurb (the page's own header
// above already covers that) and the empty "## [Unreleased]" placeholder
// section - both are meaningless to a reader of the rendered page.
const body = changelogRaw
  .replace(/^#\s+Changelog\n[\s\S]*?(?=\n##\s)/, '')
  .replace(/##\s+\[Unreleased\]\s*\n+(?=##\s)/, '')

const renderedChangelog = marked.parse(body, { async: false }) as string
</script>

<style scoped>
.changelog-content :deep(h2) {
  font-size: 1.15rem;
}

.changelog-content :deep(h2:first-of-type) {
  margin-top: 0;
}
</style>
