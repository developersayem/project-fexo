import { create } from 'zustand'

interface AppState {
  theme: 'light' | 'dark'
  username: string
  settingsLoaded: boolean

  // Actions
  loadSettings: () => Promise<void>
  setTheme: (theme: 'light' | 'dark') => Promise<void>
  setUsername: (username: string) => Promise<void>
  resetSettings: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  username: 'Guest User',
  settingsLoaded: false,

  loadSettings: async () => {
    try {
      const savedTheme = (await window.api.getSetting('theme', 'dark')) as 'light' | 'dark'
      const savedUsername = (await window.api.getSetting('username', 'Guest User')) as string

      set({
        theme: savedTheme,
        username: savedUsername,
        settingsLoaded: true
      })
    } catch (error) {
      console.error('Failed to load settings from Electron main process:', error)
      set({ settingsLoaded: true })
    }
  },

  setTheme: async (theme) => {
    try {
      await window.api.setSetting('theme', theme)
      set({ theme })
    } catch (error) {
      console.error('Failed to save theme setting:', error)
    }
  },

  setUsername: async (username) => {
    try {
      await window.api.setSetting('username', username)
      set({ username })
    } catch (error) {
      console.error('Failed to save username setting:', error)
    }
  },

  resetSettings: async () => {
    try {
      await window.api.clearSettings()
      set({
        theme: 'dark',
        username: 'Guest User'
      })
    } catch (error) {
      console.error('Failed to clear settings:', error)
    }
  }
}))
