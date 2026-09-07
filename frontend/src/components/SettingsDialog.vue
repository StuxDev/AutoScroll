<template>
  <v-dialog v-model="dialog" max-width="480px">
    <v-card>
      <div class="dialog-header">
        <v-icon class="me-2">mdi-cog</v-icon>
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
.dialog-header {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.setting-section {
  padding: 4px 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
