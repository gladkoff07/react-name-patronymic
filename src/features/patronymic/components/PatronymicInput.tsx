import { entries } from '../lib/dictionary'
import { Combobox } from './Combobox'
import type { ComboboxOption } from './Combobox'

interface PatronymicInputProps {
  value: string
  onChange: (value: string) => void
  onCommit?: (value: string) => void
  error?: string
}

const options: ComboboxOption[] = entries
  .flatMap((entry) => [
    { value: entry.male, hint: entry.name },
    { value: entry.female, hint: entry.name },
  ])
  .sort((a, b) => a.value.localeCompare(b.value, 'ru'))

export function PatronymicInput({ value, onChange, onCommit, error }: PatronymicInputProps) {
  return (
    <Combobox
      id="patronymic"
      label="Отчество"
      hint="например, Петрович"
      placeholder="Петрович"
      value={value}
      onChange={onChange}
      onCommit={onCommit}
      error={error}
      options={options}
      listLabel="Отчества"
      emptyText="Такого отчества нет в словаре. Обратный поиск работает только по словарю."
    />
  )
}
