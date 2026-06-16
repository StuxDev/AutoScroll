<template>
  <v-app>
    <v-app-bar :elevation="0" class="reddit-bar" border="b">
      <v-app-bar-title>
        <div class="d-flex align-center brand">
          <v-img
            alt="AutoScroll"
            class="shrink mr-2"
            cover
            max-width="32"
            src="@/assets/logo-white.png"
            transition="scale-transition"
          />
          <span class="brand-name">AutoScroll</span>
          <span class="brand-sub d-none d-sm-inline">for Reddit</span>
        </div>
      </v-app-bar-title>

      <v-btn icon @click="settingsDialog = true" title="Settings">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>

      <v-dialog v-model="infoDialog" max-width="520">
        <template #activator="{ props: activatorProps }">
          <v-btn icon v-bind="activatorProps" title="About">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        <v-card>
          <div class="dialog-header">
            <v-icon class="me-2">mdi-information</v-icon>
            About AutoScroll
          </div>

          <v-card-text>
            <p class="mb-3">
              A side project inspired by <a href="http://www.imagoid.com/" target="_blank">Imagoid</a> —
              a clean auto-scrolling gallery for Reddit image posts. Enter any subreddit to browse
              its media in a slideshow.
            </p>
            <p>
              Questions or issues? Reach out at
              <a href="mailto:contact@stuxie.dev" target="_blank">contact@stuxie.dev</a>
              or on <a href="https://links.stuxie.dev" target="_blank">social media</a>.
            </p>
          </v-card-text>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2">Proxy Status</span>
              <v-chip :color="statusColor" :prepend-icon="statusIcon" size="small">
                {{ statusText }}
              </v-chip>
            </div>

            <div v-if="galleryStore.proxyStatusDetails" class="text-caption text-medium-emphasis ml-2">
              <div>
                <span class="font-weight-medium">Rate Limiting:</span>
                {{ galleryStore.proxyStatusDetails.firestore === 'available' ? '✓ Active' : '✗ Unavailable' }}
              </div>
              <div>
                <span class="font-weight-medium">Content API (Apify):</span>
                {{ galleryStore.proxyStatusDetails.reddit === 'available' ? '✓ Reachable' : '✗ Unreachable' }}
              </div>
            </div>

            <v-alert
              v-if="galleryStore.proxyStatus === 'degraded'"
              type="warning"
              density="compact"
              class="mt-3"
            >
              Proxy is partially available. Some features may not work correctly.
            </v-alert>
          </v-card-text>

          <v-divider />

          <v-card-text>
            <p class="text-subtitle-2 mb-2">Legal</p>
            <div class="text-caption text-medium-emphasis">
              <div class="mb-1">
                <span class="font-weight-medium">Not affiliated:</span>
                This service is not affiliated with Reddit Inc. in any way.
              </div>
              <div class="mb-1">
                <span class="font-weight-medium">Privacy:</span>
                No personal data or cookies are collected or stored.
              </div>
              <div class="mb-1">
                <span class="font-weight-medium">Content:</span>
                All content is sourced from Reddit's public data. The operator accepts no liability for content displayed.
              </div>
              <div>
                <span class="font-weight-medium">Age:</span>
                This service is intended for users aged 18 and over.
              </div>
            </div>
          </v-card-text>

          <v-divider />

          <v-divider />

          <v-card-text class="py-3">
            <div class="version-row">
              <span class="version-item">
                <v-icon size="14" class="me-1">mdi-monitor</v-icon>
                Frontend <code>v{{ appVersion }}</code>
              </span>
              <span class="version-item">
                <v-icon size="14" class="me-1">mdi-server</v-icon>
                Backend
                <code v-if="galleryStore.backendVersion">v{{ galleryStore.backendVersion }}</code>
                <span v-else class="text-disabled">—</span>
              </span>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" href="https://labs.stux.dev" target="_blank" variant="text">
              More projects
            </v-btn>
            <v-btn color="primary" variant="flat" @click="infoDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <SettingsDialog v-model="settingsDialog" />
    <LegalDisclaimer />
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import LegalDisclaimer from '@/components/LegalDisclaimer.vue'
import { useGalleryStore } from '@/stores/gallery'

const appVersion = __APP_VERSION__

const settingsDialog = ref(false)
const infoDialog = ref(false)
const galleryStore = useGalleryStore()

const statusColor = computed(() => {
  switch (galleryStore.proxyStatus) {
    case 'operational': return 'success'
    case 'degraded': return 'warning'
    case 'unavailable': return 'error'
    case 'checking': return 'info'
    default: return 'grey'
  }
})

const statusIcon = computed(() => {
  switch (galleryStore.proxyStatus) {
    case 'operational': return 'mdi-check-circle'
    case 'degraded': return 'mdi-alert-circle'
    case 'unavailable': return 'mdi-close-circle'
    case 'checking': return 'mdi-loading mdi-spin'
    default: return 'mdi-help-circle'
  }
})

const statusText = computed(() => {
  switch (galleryStore.proxyStatus) {
    case 'operational': return 'Fully Operational'
    case 'degraded': return 'Partially Available'
    case 'unavailable': return 'Unavailable'
    case 'checking': return 'Checking...'
    default: return 'Unknown'
  }
})

watch(infoDialog, (isOpen) => {
  if (isOpen) galleryStore.checkProxyStatus()
})
</script>

<style>
.v-card-text a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}
.v-card-text a:hover {
  text-decoration: underline;
}
</style>

<style scoped>
.reddit-bar {
  background-color: rgb(var(--v-theme-surface)) !important;
}

.brand {
  gap: 4px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  letter-spacing: -0.3px;
}

.brand-sub {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.45);
  margin-left: 6px;
  margin-top: 2px;
}

.dialog-header {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.version-row {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.version-item {
  display: flex;
  align-items: center;
}

.version-item code {
  font-family: monospace;
  font-size: 11px;
  background: rgba(var(--v-theme-on-surface), 0.07);
  border-radius: 4px;
  padding: 1px 5px;
  margin-left: 4px;
}
</style>
