import { InfoCard } from '../../../shared/ui/InfoCard'
import { CloseIcon } from '../../../shared/ui/icons'
import { useHistoryStore } from '../../../store/useHistoryStore'
import { useSettingsStore } from '../../../store/useSettingsStore'
import { GenderToggle } from './GenderToggle'
import { NameInput } from './NameInput'
import { ResultCard } from './ResultCard'
import { StressToggle } from './StressToggle'
import { usePatronymic } from '../hooks/usePatronymic'
import { useQueryState } from '../hooks/useQueryState'
import { dictionarySize } from '../lib/dictionary'
import { getPatronymic } from '../lib/engine'
import { withStress } from '../lib/stress'
import type { GenderFilter } from '../lib/types'

const examples = ['Иван', 'Пётр', 'Илья', 'Никита']

export function DirectView() {
  const [query, setQuery] = useQueryState()
  const name = query.name
  const gender = query.gender
  const showStress = useSettingsStore((state) => state.showStress)
  const historyEntries = useHistoryStore((state) => state.entries)
  const addHistory = useHistoryStore((state) => state.add)
  const removeHistory = useHistoryStore((state) => state.remove)
  const clearHistory = useHistoryStore((state) => state.clear)
  const outcome = usePatronymic(name)

  const error = !outcome.ok && outcome.error.code !== 'empty' ? outcome.error.message : undefined
  const result = outcome.ok ? outcome.result : null

  function setName(next: string) {
    setQuery((current) => ({ ...current, name: next }))
  }

  function setGender(next: GenderFilter) {
    setQuery((current) => ({ ...current, gender: next }))
  }

  function commit(value: string) {
    const next = getPatronymic(value)
    if (!next.ok) return

    const { name: canonical, male, female, source } = next.result
    addHistory({ name: canonical, male, female, source })
  }

  function pick(value: string) {
    setName(value)
    commit(value)
  }

  return (
    <>
      <section className="pt-4 text-center sm:pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Отчество по имени отца
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-pretty text-slate-600 sm:text-base dark:text-slate-400">
          Введите имя отца — сервис образует отчество для сына и дочери. Исключения вроде
          «Пётр&nbsp;→&nbsp;Петрович» и «Илья&nbsp;→&nbsp;Ильич» уже учтены.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-7 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="space-y-5">
          <NameInput value={name} onChange={setName} onCommit={commit} error={error} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <GenderToggle value={gender} onChange={setGender} />
            <div className="flex items-center gap-3">
              <StressToggle />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                В словаре: {dictionarySize}
              </p>
            </div>
          </div>
        </div>

        {!name.trim() ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Попробуйте:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => pick(example)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                {example}
              </button>
            ))}
          </div>
        ) : null}

        {result ? (
          <div className="mt-6">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <span>Отец:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{result.name}</span>
            </p>

            <div className={`mt-3 grid gap-4 ${gender === 'both' ? 'sm:grid-cols-2' : ''}`}>
              {gender !== 'female' ? (
                <ResultCard
                  label="Сын"
                  patronymic={result.male}
                  source={result.source}
                  display={showStress ? withStress(result.male) : undefined}
                />
              ) : null}
              {gender !== 'male' ? (
                <ResultCard
                  label="Дочь"
                  patronymic={result.female}
                  source={result.source}
                  display={showStress ? withStress(result.female) : undefined}
                />
              ) : null}
            </div>

            {showStress && result.source === 'rule' ? (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Для имён вне словаря ударение не размечено — показана форма без знака.
              </p>
            ) : null}

            {result.alternatives && result.alternatives.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-indigo-300/70 bg-indigo-50/60 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/5">
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                  Возможно, вы имели в виду:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.alternatives.map((alternative) => (
                    <button
                      key={alternative.name}
                      type="button"
                      onClick={() => pick(alternative.name)}
                      className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:border-indigo-500/30 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                    >
                      {alternative.name}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-indigo-700/70 dark:text-indigo-300/70">
                  «{result.input}» — уменьшительная форма, которая встречается у нескольких имён.
                </p>
              </div>
            ) : null}

            {result.source === 'rule' ? (
              <p className="mt-4 text-xs text-amber-700 dark:text-amber-300">
                Имени пока нет в словаре — отчество образовано по общим правилам. Проверьте
                результат вручную.
              </p>
            ) : null}
          </div>
        ) : null}

        {historyEntries.length > 0 ? (
          <div className="mt-6 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Недавние:</span>
              {historyEntries.map((entry) => (
                <span
                  key={entry.name}
                  title={`${entry.name} · ${entry.male}`}
                  className="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => pick(entry.name)}
                    className="px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {entry.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHistory(entry.name)}
                    aria-label={`Удалить «${entry.name}» из истории`}
                    className="px-2 py-1 text-slate-400 transition hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:hover:text-rose-400"
                  >
                    <CloseIcon className="size-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-slate-400 underline-offset-2 transition hover:text-slate-700 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none dark:hover:text-slate-200"
              >
                очистить
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <InfoCard
          title="Словарь и правила"
          text="Популярные имена берутся из словаря, остальные — по правилам словообразования."
        />
        <InfoCard
          title="Ё, регистр и дефис"
          text="«петр», «ПЁТР» и «Пётр» дают один результат. Дефисные имена поддерживаются."
        />
        <InfoCard
          title="Без сервера"
          text="Всё считается в браузере: запросы никуда не отправляются, работает офлайн."
        />
      </section>
    </>
  )
}
