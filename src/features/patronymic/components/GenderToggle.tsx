import type { GenderFilter } from '../lib/types'

interface GenderToggleProps {
  value: GenderFilter
  onChange: (value: GenderFilter) => void
}

const options: Array<{ value: GenderFilter; label: string }> = [
  { value: 'male', label: 'Сын' },
  { value: 'female', label: 'Дочь' },
  { value: 'both', label: 'Оба' },
]

export function GenderToggle({ value, onChange }: GenderToggleProps) {
  return (
    <div
      role="group"
      aria-label="Для кого образуем отчество"
      className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
