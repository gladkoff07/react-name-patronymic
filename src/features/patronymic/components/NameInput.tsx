import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { CloseIcon } from '../../../shared/ui/icons'
import { entries, suggestions } from '../lib/dictionary'
import { toLookupKey } from '../lib/normalize'

const inputId = 'father-name'
const errorId = `${inputId}-error`
const listboxId = `${inputId}-listbox`

const optionId = (index: number) => `${inputId}-option-${index}`

interface Suggestion {
  value: string
  hint: string
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

const allSuggestions: Suggestion[] = [
  ...suggestions.map((name) => ({ value: name, hint: maleByName.get(name) ?? '' })),
  ...[...aliasTargets.values()]
    .sort((a, b) => a.alias.localeCompare(b.alias, 'ru'))
    .map(({ alias, names }) => ({ value: alias, hint: names.join(', ') })),
]

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  /** Вызывается, когда пользователь закончил ввод: выбор, Enter или уход из поля. */
  onCommit?: (value: string) => void
  error?: string
}

export function NameInput({ value, onChange, onCommit, error }: NameInputProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<Array<HTMLDivElement | null>>([])

  const filtered = useMemo(() => {
    const query = toLookupKey(value)
    if (!query) return allSuggestions
    return allSuggestions.filter((suggestion) => toLookupKey(suggestion.value).includes(query))
  }, [value])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open || highlighted < 0) return
    optionRefs.current[highlighted]?.scrollIntoView?.({ block: 'nearest' })
  }, [open, highlighted])

  function select(next: string) {
    onChange(next)
    onCommit?.(next)
    setOpen(false)
    setHighlighted(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setHighlighted((current) => Math.min(current + 1, filtered.length - 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setHighlighted((current) => Math.max(current - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      if (open && highlighted >= 0) {
        event.preventDefault()
        const suggestion = filtered[highlighted]
        if (suggestion) select(suggestion.value)
        return
      }
      setOpen(false)
      onCommit?.(value)
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-medium">
          Имя отца
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">например, Иван</span>
      </div>

      <div ref={containerRef} className="relative mt-2">
        <input
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
            setHighlighted(-1)
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            if (containerRef.current?.contains(event.relatedTarget as Node)) return
            onCommit?.(value)
          }}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={open && highlighted >= 0 ? optionId(highlighted) : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          placeholder="Иван"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-lg text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />

        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              setOpen(true)
              setHighlighted(-1)
              inputRef.current?.focus()
            }}
            aria-label="Очистить поле"
            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}

        {open ? (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
            <div
              role="listbox"
              id={listboxId}
              aria-label="Имена"
              className="max-h-72 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]"
            >
              {filtered.length > 0 ? (
                filtered.map((suggestion, index) => {
                  const active = index === highlighted
                  return (
                    <div
                      key={suggestion.value}
                      id={optionId(index)}
                      role="option"
                      aria-selected={active}
                      ref={(element) => {
                        optionRefs.current[index] = element
                      }}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => select(suggestion.value)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-100'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        {highlightMatch(suggestion.value, value)}
                      </span>
                      <span className="max-w-[45%] shrink-0 truncate text-xs text-slate-400 dark:text-slate-500">
                        {suggestion.hint}
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                  Совпадений нет. Можно ввести любое имя — отчество образуем по правилам.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function highlightMatch(name: string, query: string) {
  const normalizedQuery = toLookupKey(query)
  if (!normalizedQuery) return name

  const index = toLookupKey(name).indexOf(normalizedQuery)
  if (index < 0) return name

  return (
    <>
      {name.slice(0, index)}
      <span className="font-semibold text-indigo-600 dark:text-indigo-300">
        {name.slice(index, index + normalizedQuery.length)}
      </span>
      {name.slice(index + normalizedQuery.length)}
    </>
  )
}
