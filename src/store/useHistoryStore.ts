import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toLookupKey } from '../features/patronymic/lib/normalize'
import type { ResultSource } from '../features/patronymic/lib/types'

export interface HistoryEntry {
  name: string
  male: string
  female: string
  source: ResultSource
}

interface HistoryState {
  entries: HistoryEntry[]
  add: (entry: HistoryEntry) => void
  remove: (name: string) => void
  clear: () => void
}

export const HISTORY_LIMIT = 8

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      add: (entry) =>
        set((state) => {
          const key = toLookupKey(entry.name)
          const rest = state.entries.filter((item) => toLookupKey(item.name) !== key)
          return { entries: [entry, ...rest].slice(0, HISTORY_LIMIT) }
        }),
      remove: (name) =>
        set((state) => ({
          entries: state.entries.filter((item) => toLookupKey(item.name) !== toLookupKey(name)),
        })),
      clear: () => set({ entries: [] }),
    }),
    { name: 'patronymic:history' },
  ),
)
