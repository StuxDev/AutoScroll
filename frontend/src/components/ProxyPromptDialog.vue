<template>
  <v-dialog :model-value="galleryStore.isProxyPromptOpen" max-width="500px" persistent>
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">mdi-server-network</v-icon>
        Having Trouble Fetching Content?
      </div>

      <v-card-text>
        <p>It seems we're having trouble loading content for this subreddit.</p>
        <p>This can happen due to network restrictions or regional access requirements.</p>
        <p>Would you like to try again using our proxy? This routes the request through our server to bypass the issue.</p>
      </v-card-text>

      <v-divider />

      <v-card-text>
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-subtitle-1">Proxy Status:</span>
          <v-chip :color="statusColor" :prepend-icon="statusIcon" style="white-space: normal; height: auto; min-height: 24px;">
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

        <v-alert v-if="galleryStore.proxyStatus === 'degraded'" type="warning" density="compact" class="mt-3">
          Proxy is partially available. Some features may not work correctly.
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="galleryStore.declineProxy">No, Thanks</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="galleryStore.proxyStatus === 'unavailable' || galleryStore.proxyStatus === 'checking'"
          @click="galleryStore.enableProxyAndRetry"
        >
          Yes, Try Again
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useGalleryStore } from '@/stores/gallery'

const galleryStore = useGalleryStore()

watch(() => galleryStore.isProxyPromptOpen, (isOpen) => {
  if (isOpen) galleryStore.checkProxyStatus()
})

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
</script>

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
