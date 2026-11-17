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
const byPatronymic = new Map<string, NameEntry>()

for (const entry of entries) {
  byName.set(toLookupKey(entry.name), entry)
  byPatronymic.set(toLookupKey(entry.male), entry)

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

/** Обратный поиск: «Петрович» → Пётр. Пригодится для режима «отчество → имя». */
export function findByPatronymic(value: string): NameEntry | undefined {
  return byPatronymic.get(toLookupKey(value))
}
