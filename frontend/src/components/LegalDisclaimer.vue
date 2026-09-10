<template>
  <v-dialog v-model="show" max-width="520px" persistent :scrim="true">
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">fa-solid fa-shield-halved</v-icon>
        Before You Continue
      </div>

      <v-card-text class="pt-5">
        <p class="text-body-2 mb-4">
          AutoScroll displays publicly available media from Reddit. By continuing you confirm:
        </p>

        <div class="disclaimer-list mb-4">
          <div v-for="item in items" :key="item" class="disclaimer-item">
            <v-icon color="primary" size="20" class="me-3 mt-1 flex-shrink-0">fa-regular fa-circle-check</v-icon>
            <span class="text-body-2" v-html="item" />
          </div>
        </div>

        <v-alert type="warning" variant="tonal" density="compact" icon="fa-solid fa-triangle-exclamation">
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

const items = [
  'You are <strong>18 years of age or older</strong>',
  'You understand this service may display <strong>adult (NSFW) content</strong>',
  'This service is <strong>not affiliated with Reddit Inc.</strong> in any way',
  "All content is sourced from Reddit's publicly available data",
  'The operator accepts <strong>no liability</strong> for content displayed through this service',
]

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
.disclaimer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.disclaimer-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}
</style>
