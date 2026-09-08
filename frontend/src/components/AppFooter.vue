<template>
  <v-footer app height="auto" class="footer-wrap">
    <div class="footer-content">
      <div class="footer-legal">
        <span class="nowrap">Not affiliated with Reddit Inc.</span>
        <span class="sep">·</span>
        <span class="nowrap">For users 18+</span>
        <span class="sep">·</span>
        <span class="nowrap"><RouterLink to="/legal">Boring Legal Stuff</RouterLink></span>
        <span class="sep">·</span>
        <span class="nowrap">
          &copy; 2024–{{ new Date().getFullYear() }}
          <a href="https://labs.stux.dev" target="_blank" rel="noopener noreferrer">Stux.Dev Labs</a>
        </span>
        <span class="sep">·</span>
        <span class="nowrap version-tag"><RouterLink to="/changelog">v{{ appVersion }}</RouterLink></span>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const appVersion = __APP_VERSION__
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
  justify-content: center;
}

.footer-legal {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.35);
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0 4px;
  line-height: 1.8;
}

.footer-legal a {
  color: rgba(var(--v-theme-on-surface), 0.45);
  text-decoration: none;
}

.footer-legal a:hover {
  color: rgb(var(--v-theme-primary));
}

.nowrap {
  white-space: nowrap;
}

.sep {
  opacity: 0.4;
}

.version-tag {
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
</style>
