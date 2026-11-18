import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { CloseIcon } from '../../../shared/ui/icons'
import { toLookupKey } from '../lib/normalize'

export interface ComboboxOption {
  value: string
  /** Пояснение справа: каноническое имя для уменьшительной формы. */
  hint?: string
}

interface ComboboxProps {
  id: string
  label: string
  /** Подсказка рядом с подписью, например «например, Иван». */
  hint?: string
  placeholder: string
  value: string
  options: ComboboxOption[]
  onChange: (value: string) => void
  /** Вызывается, когда пользователь закончил ввод: выбор, Enter или уход из поля. */
  onCommit?: (value: string) => void
  error?: string
  listLabel?: string
  emptyText?: ReactNode
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-lg text-slate-900 shadow-sm transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400'

/** Поле с подсказками: клавиши, клик, очистка и доступность — в одном месте. */
export function Combobox({
  id,
  label,
  hint,
  placeholder,
  value,
  options,
  onChange,
  onCommit,
  error,
  listLabel,
  emptyText,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<Array<HTMLDivElement | null>>([])

  const errorId = `${id}-error`
  const listboxId = `${id}-listbox`
  const optionId = (index: number) => `${id}-option-${index}`

  const filtered = useMemo(() => {
    const query = toLookupKey(value)
    if (!query) return options
    return options.filter((option) => toLookupKey(option.value).includes(query))
  }, [options, value])

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
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {hint ? (
          <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>
        ) : null}
      </div>

      <div ref={containerRef} className="relative mt-2">
        <input
          ref={inputRef}
          id={id}
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
          aria-expanded={open && filtered.length > 0}
          aria-controls={filtered.length > 0 ? listboxId : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={open && highlighted >= 0 ? optionId(highlighted) : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          placeholder={placeholder}
          className={inputClassName}
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
            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}

        {open ? (
          <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
            {filtered.length > 0 ? (
              <div
                role="listbox"
                id={listboxId}
                aria-label={listLabel}
                className="max-h-72 overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]"
              >
                {filtered.map((option, index) => {
                  const active = index === highlighted
                  return (
                    <div
                      key={option.value}
                      id={optionId(index)}
                      role="option"
                      aria-selected={active}
                      ref={(element) => {
                        optionRefs.current[index] = element
                      }}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => select(option.value)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-100'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate">{highlightMatch(option.value, value)}</span>
                      {option.hint ? (
                        <span className="max-w-[45%] shrink-0 truncate text-xs text-slate-500 dark:text-slate-400">
                          {option.hint}
                        </span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p role="status" className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                {emptyText}
              </p>
            )}
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
