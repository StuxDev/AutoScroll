<template>
  <v-footer app height="auto" class="footer-wrap">
    <div class="footer-content">
      <div class="footer-links">
        <a
          v-for="item in items"
          :key="item.title"
          class="footer-link"
          :href="item.href"
          rel="noopener noreferrer"
          target="_blank"
          :title="item.title"
        >
          <v-icon :icon="item.icon" size="16" />
          <span>{{ item.title }}</span>
        </a>
      </div>

      <div class="footer-legal">
        Not affiliated with Reddit Inc. &nbsp;·&nbsp;
        For users 18+. &nbsp;·&nbsp;
        &copy; 2024–{{ new Date().getFullYear() }}
        <a href="https://labs.stux.dev" target="_blank" rel="noopener noreferrer">
          Stux.Dev Labs
        </a>
        &nbsp;·&nbsp;
        <span class="version-tag">v{{ appVersion }}</span>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const appVersion = __APP_VERSION__

const items = [
  {
    title: 'Stux.Dev Labs',
    icon: 'mdi-test-tube',
    href: 'https://labs.stux.dev',
  },
]
</script>

<style scoped>
.footer-wrap {
  background-color: rgb(var(--v-theme-surface)) !important;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  padding: 10px 16px;
}

.footer-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
}

.footer-legal {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.35);
  text-align: right;
}

.footer-legal a {
  color: rgba(var(--v-theme-on-surface), 0.45);
  text-decoration: none;
}

.footer-legal a:hover {
  color: rgb(var(--v-theme-primary));
}

.version-tag {
  font-family: monospace;
  opacity: 0.5;
}
</style>
