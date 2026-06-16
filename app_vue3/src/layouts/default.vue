<template>
  <v-app>
    <v-app-bar :elevation="4">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <v-img
            alt="AutoScroll"
            class="shrink mr-2"
            cover
            max-width="50"
            src="@/assets/logo-white.png"
            transition="scale-transition"
          />
          <v-img
            alt="AutoScroll"
            class="shrink mt-1"
            cover
            max-width="100"
            src="@/assets/navbar.png"
          />
        </div>
      </v-app-bar-title>

      <v-btn icon @click="settingsDialog = true" title="Settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-dialog v-model="infoDialog" max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn icon v-bind="activatorProps" title="About">
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </template>

        <v-card>
          <div class="dialog-header">
            <v-icon class="me-2">mdi-information</v-icon>
            What is this?
          </div>

          <v-card-text>
            This is a small side project made during 2024.
            I was inspired by <a href="http://www.imagoid.com/" target="_blank">Imagoid</a>
            and so created a very simple auto scroller for Reddit image posts.
            I hope you enjoy, and if you find any issues, you can contact me at
            <a href="mailto:contact@stuxie.dev" target="_blank">contact@stuxie.dev</a>
            or find me on <a href="https://links.stuxie.dev" target="_blank">social media</a>!
          </v-card-text>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-1">Proxy Status:</span>
              <v-chip :color="statusColor" :prepend-icon="statusIcon" size="small">
                {{ statusText }}
              </v-chip>
            </div>

            <div v-if="galleryStore.proxyStatusDetails" class="text-caption text-medium-emphasis ml-4">
              <div>
                <span class="text-subtitle-2">• Rate Limiting:</span>
                {{ galleryStore.proxyStatusDetails.firestore === 'available' ? '✓ Active' : '✗ Unavailable' }}
              </div>
              <div>
                <span class="text-subtitle-2">• Content API (Apify):</span>
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
            <span class="text-subtitle-1">Boring Legal Stuff:</span>
            <div class="text-caption text-medium-emphasis ml-4 mt-1">
              <div><span class="text-subtitle-2">• Privacy policy:</span> This service does not collect any analytical or any other identifiable data.</div>
              <div><span class="text-subtitle-2">• Cookie policy:</span> This service does not set or use any cookies.</div>
              <div><span class="text-subtitle-2">• Disclaimer:</span> This project is not affiliated with Reddit in any way. All data is sourced from Reddit. I hold no responsibility for any content displayed through this service.</div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" href="https://labs.stux.dev" target="_blank">See more labs</v-btn>
            <v-btn color="primary" @click="infoDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <SettingsDialog v-model="settingsDialog" />
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import { useGalleryStore } from '@/stores/gallery'

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
/* Scope link colours to our dialogs only — avoids bleeding into the whole app */
.v-card-text a {
  color: rgb(var(--v-theme-primary));
}
</style>

<style scoped>
.dialog-header {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
</style>
