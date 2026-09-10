<template>
  <v-dialog v-model="dialog" max-width="480px">
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">fa-solid fa-gear</v-icon>
        Settings
      </div>

      <v-card-text>
        <div class="setting-section">
          <div class="setting-label">Slideshow interval</div>
          <v-slider
            v-model="settingsStore.slideshowInterval"
            min="1"
            max="30"
            step="1"
            thumb-label
            hide-details
            color="primary"
            @update:model-value="settingsStore.setSlideshowInterval"
          />
          <div class="text-caption text-medium-emphasis text-center mt-1">
            {{ settingsStore.slideshowInterval }} seconds between slides
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="setting-section">
          <div class="setting-label">Theme</div>
          <v-btn-toggle
            :model-value="settingsStore.themeMode"
            @update:model-value="settingsStore.setThemeMode"
            color="primary"
            variant="outlined"
            density="comfortable"
            divided
            mandatory
          >
            <v-btn value="system" prepend-icon="fa-solid fa-circle-half-stroke">System</v-btn>
            <v-btn value="light" prepend-icon="fa-solid fa-sun">Light</v-btn>
            <v-btn value="dark" prepend-icon="fa-solid fa-moon">Dark</v-btn>
          </v-btn-toggle>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const settingsStore = useSettingsStore()
const dialog = ref(props.modelValue)

watch(() => props.modelValue, (v) => { dialog.value = v })
watch(dialog, (v) => emit('update:modelValue', v))
</script>

<style scoped>
.setting-section {
  padding: 4px 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
