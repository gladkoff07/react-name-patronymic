import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface SettingsState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  showStress: boolean
  toggleStress: () => void
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: getPreferredTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      showStress: false,
      toggleStress: () => set((state) => ({ showStress: !state.showStress })),
    }),
    { name: 'patronymic:settings' },
  ),
)
