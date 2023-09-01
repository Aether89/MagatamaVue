// Utilities
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => ({
      tooltip: true,
  }),
})
