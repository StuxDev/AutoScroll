<template>
  <v-app>
    <v-app-bar :elevation="10">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <!-- todo: use router-link in the future -->
          <!-- <router-link to="/">  -->
          <v-img
            alt="AutoScroll"
            class="shrink mr-2"
            cover
            max-width="50"
            src="@/assets/logo-white.png"
            transition="scale-transition"
          />
          <!-- </router-link> -->
          <!-- <router-link to="/"> -->
          <v-img
            alt="AutoScroll"
            class="shrink mt-1"
            cover
            max-width="100"
            src="@/assets/navbar.png"
          />
          <!-- </router-link> -->
        </div>
      </v-app-bar-title>

      <v-btn @click="settingsDialog = true">
        <v-icon size="large">
          mdi-cog
        </v-icon>
      </v-btn>

      <v-dialog v-model="infoDialog" max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            <v-icon size="large">
              mdi-information
            </v-icon>
          </v-btn>
        </template>

        <v-card>
            <v-card-title
              class="text-h5 bg-grey-lighten-2"
              primary-title
            >
              What is this?
            </v-card-title>

            <v-card-text>
              This is a small side project made during 2024. 
              I was inspired by <a
                href="http://www.imagoid.com/"
                target="_blank"
              >Imagoid</a>
              and so created a very simple auto scroller for Reddit image posts. 
              I hope you enjoy, and if you find any issues, you can contact me at <a 
                href="mailto:contact@stuxie.dev"
                target="_blank"
              >contact@stuxie.dev</a> or find me on <a
                href="https://links.stuxie.dev"
                target="_blank"
              >social media</a>!
            </v-card-text>
            
            <v-divider />
            <br>

            <v-card-text>
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-subtitle-1">Proxy Status:</span>
                <v-chip
                  :color="statusColor"
                  :prepend-icon="statusIcon"
                  size="small"
                >
                  {{ statusText }}
                </v-chip>
              </div>

              <div
                v-if="galleryStore.proxyStatusDetails"
                class="text-caption text-medium-emphasis ml-4"
              >
                <div><span class="text-subtitle-2">• Rate Limiting:</span> {{ galleryStore.proxyStatusDetails.firestore === 'available' ? '✓ Active' : '✗ Unavailable' }}</div>
                <div><span class="text-subtitle-2">• Reddit API:</span> {{ galleryStore.proxyStatusDetails.reddit === 'available' ? '✓ Reachable' : '✗ Unreachable' }}</div>
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
              <div style="font-size: 12px;" class="text-caption text-medium-emphasis ml-4">
                <span class="text-subtitle-2">• Privacy policy:</span> 
                This service does not collect any analytical or any other identifiable data. 
                <br>
                <span class="text-subtitle-2">• Cookie policy:</span> 
                This service does not set or use any cookies.
                <br>
                <span class="text-subtitle-2">• Disclaimer:</span> 
                This project is not affiliated with Reddit in any way. 
                All data is from Reddit's API. 
                I hold no responsibility for any content displayed through this service.
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                href="https://labs.stux.dev"
                target="_blank"
              >
                See more labs
              </v-btn>
              <v-btn
                color="primary"
                @click="infoDialog = false"
              >
                Close
              </v-btn>
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
    if (isOpen) {
      galleryStore.checkProxyStatus()
    }
  })
</script>
<style lang="sass">
.v-card-title
  background-color: #FF1F1F !important;
  color: white !important;

.v-card-text
  padding: 24px;
.v-card-text a
  color: #FF1F1F;

.v-card-actions
  padding: .7rem .5rem .5rem;
</style>
