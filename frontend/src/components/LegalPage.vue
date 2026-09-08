<template>
  <div class="legal-page">
    <div class="legal-header">
      <div class="legal-eyebrow"><RouterLink :to="eyebrowTo">{{ eyebrow }}</RouterLink></div>
      <h1>{{ title }}</h1>
      <p class="legal-lead">{{ lead }}</p>
      <div v-if="meta" class="legal-meta">{{ meta }}</div>
    </div>

    <div class="legal-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'

const props = withDefaults(defineProps<{
  title: string
  lead: string
  meta?: string
  eyebrow?: string
  eyebrowTo?: string
  titleSuffix?: string
}>(), {
  eyebrow: 'Legal',
  eyebrowTo: '/legal',
  titleSuffix: 'Legal',
})

useTitle(`${props.title} | ${props.titleSuffix} - AutoScroll`)
</script>

<style>
.legal-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 20px 72px;
}

.legal-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.5);
  margin-bottom: 10px;
}

.legal-eyebrow a {
  color: inherit;
  text-decoration: none;
}

.legal-eyebrow a:hover {
  color: rgb(var(--v-theme-primary));
}

.legal-page h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 12px;
  color: rgb(var(--v-theme-on-surface));
}

.legal-lead {
  font-size: 1.05rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin: 0 0 8px;
}

.legal-meta {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.45);
  margin-bottom: 32px;
}

.legal-body h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 40px 0 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  color: rgb(var(--v-theme-on-surface));
}

.legal-body > h2:first-child {
  margin-top: 0;
}

.legal-body h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 20px 0 8px;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.legal-body p,
.legal-body li {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.legal-body p {
  margin: 0 0 14px;
}

.legal-body ol,
.legal-body ul {
  padding-left: 1.3em;
  margin: 0 0 14px;
}

.legal-body li {
  margin-bottom: 6px;
}

.legal-body li::marker {
  color: rgb(var(--v-theme-primary));
}

.legal-body a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.legal-body a:hover {
  text-decoration: underline;
}

.legal-body hr {
  border: none;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  margin: 32px 0;
}

.legal-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85em;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 4px;
  padding: 2px 6px;
}

.legal-body pre {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 8px;
  padding: 14px 16px;
  overflow-x: auto;
  margin: 0 0 14px;
}

.legal-body pre code {
  background: none;
  padding: 0;
}

.legal-body strong {
  color: rgb(var(--v-theme-on-surface));
}

.legal-body .info-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
}

.legal-body .info-row {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.legal-body .info-row:last-child {
  border-bottom: none;
}

.legal-body .info-label {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 2px;
  color: rgb(var(--v-theme-on-surface));
}

.legal-body .info-value {
  display: block;
  font-size: 0.88rem;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
