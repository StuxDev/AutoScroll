<template>
  <div class="legal-page legal-hub">
    <div class="legal-header">
      <div class="legal-eyebrow">Legal</div>
      <h1>Boring Legal Stuff</h1>
      <p class="legal-lead">The stuff nobody reads but everybody needs. All of it, in one place, in plain English.</p>
    </div>

    <div class="legal-grid">
      <RouterLink v-for="d in docs" :key="d.slug" :to="`/legal/${d.slug}`" class="legal-card">
        <div class="legal-card-icon">
          <v-icon :icon="d.icon" size="22" />
        </div>
        <div class="legal-card-text">
          <div class="legal-card-name">{{ d.name }}</div>
          <div class="legal-card-desc">{{ d.desc }}</div>
        </div>
      </RouterLink>
    </div>

    <p class="legal-contact">Questions about any of this? Contact <a href="mailto:legal@stux.dev">legal@stux.dev</a>.</p>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('Legal - AutoScroll')

const docs = [
  { slug: 'privacy', icon: 'mdi-shield-lock-outline', name: 'Privacy Policy', desc: 'What little we collect, and how the proxy actually works.' },
  { slug: 'terms', icon: 'mdi-file-document-outline', name: 'Terms and Ethics', desc: "Use it responsibly, and respect Reddit's own rules." },
  { slug: 'cookies', icon: 'mdi-cookie-outline', name: 'Cookies Policy', desc: 'localStorage only — no tracking cookies, ever.' },
  { slug: 'imprint', icon: 'mdi-domain', name: 'Imprint', desc: 'Who operates AutoScroll and how to reach them.' },
  { slug: 'disclaimer', icon: 'mdi-information-outline', name: 'Disclaimer', desc: 'Copyright, accuracy, and the Reddit affiliation question.' },
  { slug: 'opt-out', icon: 'mdi-account-cancel-outline', name: 'Opt-Out Preferences', desc: "There's nothing to sell, so nothing to opt out of." },
]
</script>

<style>
.legal-hub .legal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.legal-hub .legal-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.legal-hub .legal-card:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.legal-hub .legal-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  background-color: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-primary));
}

.legal-hub .legal-card-name {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.legal-hub .legal-card-desc {
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.legal-hub .legal-contact {
  margin-top: 32px;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.legal-hub .legal-contact a {
  color: rgb(var(--v-theme-primary));
}
</style>
