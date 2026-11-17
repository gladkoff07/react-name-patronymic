import { entries, suggestions } from '../lib/dictionary'
import { toLookupKey } from '../lib/normalize'
import { Combobox } from './Combobox'
import type { ComboboxOption } from './Combobox'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  onCommit?: (value: string) => void
  error?: string
}

const maleByName = new Map(entries.map((entry) => [entry.name, entry.male]))
const canonicalKeys = new Set(entries.map((entry) => toLookupKey(entry.name)))

const aliasTargets = new Map<string, { alias: string; names: string[] }>()
for (const entry of entries) {
  for (const alias of entry.aliases ?? []) {
    const key = toLookupKey(alias)
    if (canonicalKeys.has(key)) continue

    const existing = aliasTargets.get(key)
    if (existing) {
      if (!existing.names.includes(entry.name)) existing.names.push(entry.name)
    } else {
      aliasTargets.set(key, { alias, names: [entry.name] })
    }
  }
}

const options: ComboboxOption[] = [
  ...suggestions.map((name) => ({ value: name, hint: maleByName.get(name) ?? '' })),
  ...[...aliasTargets.values()]
    .sort((a, b) => a.alias.localeCompare(b.alias, 'ru'))
    .map(({ alias, names }) => ({ value: alias, hint: names.join(', ') })),
]

export function NameInput({ value, onChange, onCommit, error }: NameInputProps) {
  return (
    <Combobox
      id="father-name"
      label="Имя отца"
      hint="например, Иван"
      placeholder="Иван"
      value={value}
      onChange={onChange}
      onCommit={onCommit}
      error={error}
      options={options}
      listLabel="Имена"
      emptyText="Совпадений нет. Можно ввести любое имя — отчество образуем по правилам."
    />
  )
}
