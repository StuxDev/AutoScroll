import { watch, onScopeDispose } from 'vue'
import { useTheme } from 'vuetify'
import { useSettingsStore } from '@/stores/settings'

/**
 * Applies the user's theme preference (system/light/dark) to Vuetify and
 * keeps it in sync with OS-level changes while in "system" mode. The
 * initial paint is already handled by resolveInitialTheme() in
 * plugins/vuetify.ts (reading localStorage directly, before Pinia exists) -
 * this composable takes over for changes made after the app has mounted.
 */
export function useAppTheme() {
  const theme = useTheme()
  const settingsStore = useSettingsStore()
  const media = window.matchMedia('(prefers-color-scheme: dark)')

  function applyTheme() {
    const mode = settingsStore.themeMode
    const resolved = mode === 'system'
      ? (media.matches ? 'redditDark' : 'redditLight')
      : (mode === 'dark' ? 'redditDark' : 'redditLight')
    theme.global.name.value = resolved
  }

  applyTheme()

  watch(() => settingsStore.themeMode, applyTheme)

  const onMediaChange = () => {
    if (settingsStore.themeMode === 'system') applyTheme()
  }
  media.addEventListener('change', onMediaChange)
  onScopeDispose(() => media.removeEventListener('change', onMediaChange))
}
