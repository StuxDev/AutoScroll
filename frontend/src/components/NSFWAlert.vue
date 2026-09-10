<template>
  <v-dialog v-model="isOpen" max-width="480px" persistent>
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">fa-solid fa-triangle-exclamation</v-icon>
        NSFW Content Detected
      </div>

      <v-card-text class="pt-5">
        <p class="text-body-2 mb-4">
          This subreddit contains content marked as <strong>Not Safe For Work (NSFW)</strong>.
          This may include nudity, graphic imagery, or other adult material.
        </p>
        <v-alert type="warning" variant="tonal" density="compact" class="mb-4">
          You must be <strong>18 years of age or older</strong> to view this content.
        </v-alert>
        <p class="text-caption text-medium-emphasis">
          NSFW posts will remain hidden unless you confirm below. Your preference is saved for this session.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="outlined" color="error" @click="decline">
          <v-icon start>fa-solid fa-ban</v-icon>
          Keep Hidden
        </v-btn>
        <v-spacer />
        <v-btn variant="flat" color="primary" @click="accept">
          <v-icon start>fa-solid fa-check</v-icon>
          I'm 18+ — Show All
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:isOpen', 'accept', 'decline'])

const isOpen = ref(props.isOpen)

watch(() => props.isOpen, (newValue) => { isOpen.value = newValue })
watch(isOpen, (newValue) => emit('update:isOpen', newValue))

const accept = () => {
  isOpen.value = false
  emit('accept')
}

const decline = () => {
  isOpen.value = false
  emit('decline')
}
</script>
