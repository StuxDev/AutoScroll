// stores/settings.ts
import { defineStore } from 'pinia';

export type ThemeMode = 'system' | 'light' | 'dark';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    slideshowInterval: parseInt(localStorage.getItem('slideshowInterval') || '5'),
    sortOption: localStorage.getItem('sortOption') || 'hot',
    agreedToNSFW: localStorage.getItem('agreedToNSFW') === 'true',
    themeMode: (localStorage.getItem('themeMode') as ThemeMode | null) || 'system',
  }),
  actions: {
    setSlideshowInterval(interval: number) {
      this.slideshowInterval = interval;
      localStorage.setItem('slideshowInterval', interval.toString());
    },
    setSortOption(option: string) {
      this.sortOption = option;
      localStorage.setItem('sortOption', option);
    },
    setAgreedToNSFW(value: boolean) {
      this.agreedToNSFW = value;
      localStorage.setItem('agreedToNSFW', value.toString());
    },
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode;
      localStorage.setItem('themeMode', mode);
    },
  },
});
