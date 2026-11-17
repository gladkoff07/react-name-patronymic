import namesData from '../data/names.json'
import { toLookupKey } from './normalize'

export interface NameEntry {
  name: string
  male: string
  female: string
  aliases?: string[]
}

export const entries: NameEntry[] = namesData.names

export const dictionarySize = entries.length

/** Все канонические имена — для автодополнения. */
export const suggestions: string[] = entries
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'ru'))

const byName = new Map<string, NameEntry>()
const byAlias = new Map<string, NameEntry[]>()
const byMalePatronymic = new Map<string, NameEntry[]>()
const byFemalePatronymic = new Map<string, NameEntry[]>()

for (const entry of entries) {
  byName.set(toLookupKey(entry.name), entry)
  pushToIndex(byMalePatronymic, toLookupKey(entry.male), entry)
  pushToIndex(byFemalePatronymic, toLookupKey(entry.female), entry)

  for (const alias of entry.aliases ?? []) {
    const key = toLookupKey(alias)
    const list = byAlias.get(key) ?? []
    list.push(entry)
    byAlias.set(key, list)
  }
}

export function findByNameKey(key: string): NameEntry | undefined {
  return byName.get(key)
}

/** Уменьшительная форма может вести к нескольким именам: «Слава» → три варианта. */
export function findAliasEntries(key: string): NameEntry[] | undefined {
  return byAlias.get(key)
}

/** Обратный поиск: «Петрович» и «Петровна» → Пётр. */
export function findByPatronymic(value: string): NameEntry[] {
  const key = toLookupKey(value)
  const male = byMalePatronymic.get(key) ?? []
  const female = byFemalePatronymic.get(key) ?? []

  if (male.length === 0) return female
  if (female.length === 0) return male

  return [...new Set([...male, ...female])]
}

function pushToIndex(index: Map<string, NameEntry[]>, key: string, entry: NameEntry) {
  const list = index.get(key) ?? []
  list.push(entry)
  index.set(key, list)
}
