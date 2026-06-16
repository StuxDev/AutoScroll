<template>
  <v-dialog v-model="show" max-width="520px" persistent :scrim="true">
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">mdi-shield-alert</v-icon>
        Before You Continue
      </div>

      <v-card-text class="pt-5">
        <p class="text-body-2 mb-4">
          AutoScroll displays publicly available media from Reddit. By continuing you confirm:
        </p>

        <v-list density="compact" class="disclaimer-list mb-4">
          <v-list-item prepend-icon="mdi-check-circle-outline" color="primary">
            <v-list-item-title class="text-body-2">
              You are <strong>18 years of age or older</strong>
            </v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle-outline" color="primary">
            <v-list-item-title class="text-body-2">
              You understand this service may display <strong>adult (NSFW) content</strong>
            </v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle-outline" color="primary">
            <v-list-item-title class="text-body-2">
              This service is <strong>not affiliated with Reddit Inc.</strong> in any way
            </v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle-outline" color="primary">
            <v-list-item-title class="text-body-2">
              All content is sourced from Reddit's publicly available data
            </v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle-outline" color="primary">
            <v-list-item-title class="text-body-2">
              The operator accepts <strong>no liability</strong> for content displayed through this service
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-alert type="warning" variant="tonal" density="compact" icon="mdi-alert">
          NSFW content is hidden by default. You will be asked separately before any adult content is shown.
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          color="error"
          variant="outlined"
          @click="decline"
        >
          Leave
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="accept"
        >
          I Understand — Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'autoscroll_legal_accepted'

const show = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    show.value = true
  }
})

const accept = () => {
  localStorage.setItem(STORAGE_KEY, '1')
  show.value = false
}

const decline = () => {
  window.location.href = 'https://www.google.com'
}
</script>

<style scoped>
.dialog-header {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.disclaimer-list {
  background: transparent;
}
</style>
