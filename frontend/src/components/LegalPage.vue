<template>
  <div class="legal-page">
    <div class="legal-header">
      <div class="legal-eyebrow"><RouterLink to="/legal">Legal</RouterLink></div>
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

const props = defineProps<{
  title: string
  lead: string
  meta?: string
}>()

useTitle(`${props.title} | Legal - AutoScroll`)
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
  margin: 32px 0 12px;
  color: rgb(var(--v-theme-on-surface));
}

.legal-body p,
.legal-body li {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.legal-body ol,
.legal-body ul {
  padding-left: 1.3em;
}

.legal-body a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.legal-body a:hover {
  text-decoration: underline;
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
