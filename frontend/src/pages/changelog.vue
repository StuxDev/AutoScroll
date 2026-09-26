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

// Canonical section order - sections are sorted into this order at render
// time, whatever order CHANGELOG.md lists them in. Unknown types go last.
const CATEGORY_LABELS: Record<string, string> = {
  Added: 'added',
  Changed: 'changed',
  Fixed: 'fixed',
  Removed: 'removed',
  Security: 'security',
  Deprecated: 'deprecated',
}
const CATEGORIES = Object.keys(CATEGORY_LABELS)
const CATEGORY_RE = new RegExp(`^(${CATEGORIES.join('|')})\\b\\s*(.*)$`)

// Reorders each release's "### <Category>" blocks into CATEGORIES order.
// Non-category h3 blocks keep their source order after the categories; lines
// before a release's first h3 stay put. Releases are delimited by h1/h2/hr.
function sortSections (md: string): string {
  const out: string[] = []
  let blocks: { rank: number, lines: string[] }[] = []
  const flush = () => {
    // Array.prototype.sort is stable, so equal ranks keep source order
    blocks.sort((a, b) => a.rank - b.rank)
    for (const block of blocks) out.push(...block.lines)
    blocks = []
  }
  for (const line of md.split(/\r?\n/)) {
    const h3 = line.match(/^###\s+(.+)$/)
    if (/^#{1,2}\s/.test(line) || line.trim() === '---') {
      flush()
      out.push(line)
    } else if (h3) {
      const cm = h3[1].trim().match(CATEGORY_RE)
      blocks.push({ rank: cm ? CATEGORIES.indexOf(cm[1]) : CATEGORIES.length, lines: [line] })
    } else if (blocks.length > 0) {
      blocks[blocks.length - 1].lines.push(line)
    } else {
      out.push(line)
    }
  }
  flush()
  return out.join('\n')
}

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

const renderedChangelog = marked.parse(sortSections(body), { async: false }) as string
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

.changelog-content :deep(.changelog-label) {
  color: var(--cl);
  background: color-mix(in srgb, var(--cl) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--cl) 45%, transparent);
}

/* Fixed type palette & order: Added, Changed, Fixed, Removed, Security, Deprecated */
.changelog-content :deep(.changelog-label-added) { --cl: #2ecc71; }
.changelog-content :deep(.changelog-label-changed) { --cl: #3ba7ff; }
.changelog-content :deep(.changelog-label-fixed) { --cl: #ffa64d; }
.changelog-content :deep(.changelog-label-removed) { --cl: #ff4d4d; }
.changelog-content :deep(.changelog-label-security) { --cl: #b06bff; }
.changelog-content :deep(.changelog-label-deprecated) { --cl: #8a8a94; }

/* Same hues, darkened for contrast on the light theme */
.v-theme--redditLight .changelog-content :deep(.changelog-label-added) { --cl: #1e8449; }
.v-theme--redditLight .changelog-content :deep(.changelog-label-changed) { --cl: #1a6fc0; }
.v-theme--redditLight .changelog-content :deep(.changelog-label-fixed) { --cl: #b8650f; }
.v-theme--redditLight .changelog-content :deep(.changelog-label-removed) { --cl: #c62828; }
.v-theme--redditLight .changelog-content :deep(.changelog-label-security) { --cl: #7b3fc4; }
.v-theme--redditLight .changelog-content :deep(.changelog-label-deprecated) { --cl: #5f5f68; }
</style>
