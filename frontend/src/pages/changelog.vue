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

const CATEGORY_LABELS: Record<string, string> = {
  Added: 'added',
  Changed: 'changed',
  Fixed: 'fixed',
  Removed: 'removed',
  Deprecated: 'deprecated',
  Security: 'security',
}
const CATEGORY_RE = new RegExp(`^(${Object.keys(CATEGORY_LABELS).join('|')})\\b\\s*(.*)$`)

// Renders a Keep a Changelog "### Added"/"### Fixed"/etc. heading as a
// colored pill badge instead of a plain h3 - falls back (return false)
// to the default heading renderer for anything else, including h2 version
// headers and any non-standard h3 text.
marked.use({
  renderer: {
    heading(token) {
      const text = token.depth === 3 ? token.text.trim() : ''
      const match = text.match(CATEGORY_RE)
      if (match) {
        const [, category, suffix] = match
        const slug = CATEGORY_LABELS[category]
        const suffixHtml = suffix ? `<span class="changelog-label-suffix">${suffix}</span>` : ''
        return `<div class="changelog-label-row"><span class="changelog-label changelog-label-${slug}">${category}</span>${suffixHtml}</div>\n`
      }
      return false
    },
  },
})

const renderedChangelog = marked.parse(body, { async: false }) as string
</script>

<style scoped>
.changelog-content :deep(h2) {
  font-size: 1.15rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.changelog-content :deep(h2:first-of-type) {
  margin-top: 0;
}

.changelog-content :deep(.changelog-label-row) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0 8px;
}

.changelog-content :deep(.changelog-label) {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 999px;
}

.changelog-content :deep(.changelog-label-suffix) {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.changelog-content :deep(.changelog-label-added) {
  color: rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.14);
}

.changelog-content :deep(.changelog-label-changed) {
  color: rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.14);
}

.changelog-content :deep(.changelog-label-fixed) {
  color: rgb(var(--v-theme-warning));
  background: rgba(var(--v-theme-warning), 0.14);
}

.changelog-content :deep(.changelog-label-removed),
.changelog-content :deep(.changelog-label-deprecated) {
  color: rgb(var(--v-theme-error));
  background: rgba(var(--v-theme-error), 0.14);
}

.changelog-content :deep(.changelog-label-security) {
  color: rgb(var(--v-theme-secondary));
  background: rgba(var(--v-theme-secondary), 0.14);
}
</style>
