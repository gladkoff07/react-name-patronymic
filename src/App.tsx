import { useEffect, useState } from 'react'
import { GenderToggle } from './features/patronymic/components/GenderToggle'
import { NameInput } from './features/patronymic/components/NameInput'
import { ResultCard } from './features/patronymic/components/ResultCard'
import { usePatronymic } from './features/patronymic/hooks/usePatronymic'
import { dictionarySize } from './features/patronymic/lib/dictionary'
import type { GenderFilter } from './features/patronymic/lib/types'
import { ThemeToggle } from './shared/ui/ThemeToggle'
import { useSettingsStore } from './store/useSettingsStore'

const examples = ['Иван', 'Пётр', 'Илья', 'Никита']

export default function App() {
  const [name, setName] = useState('')
  const [gender, setGender] = useState<GenderFilter>('both')
  const theme = useSettingsStore((state) => state.theme)
  const outcome = usePatronymic(name)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const error = !outcome.ok && outcome.error.code !== 'empty' ? outcome.error.message : undefined
  const result = outcome.ok ? outcome.result : null

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-indigo-100/90 via-indigo-50/50 to-transparent dark:from-indigo-500/10 dark:via-indigo-500/5"
      />

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-[1.2rem] font-bold text-white shadow-lg shadow-indigo-600/25">
            О
          </span>
          <div className="leading-tight">
            <p className="text-[1.1rem] font-semibold tracking-[0.5px]">Отчество</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">по имени отца</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
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
            <NameInput value={name} onChange={setName} error={error} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <GenderToggle value={gender} onChange={setGender} />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                В словаре: {dictionarySize}
              </p>
            </div>
          </div>

          {!name.trim() ? (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Попробуйте:</span>
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setName(example)}
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
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {result.name}
                </span>
              </p>

              <div
                className={`mt-3 grid gap-4 ${gender === 'both' ? 'sm:grid-cols-2' : ''}`}
              >
                {gender !== 'female' ? (
                  <ResultCard label="Сын" patronymic={result.male} source={result.source} />
                ) : null}
                {gender !== 'male' ? (
                  <ResultCard label="Дочь" patronymic={result.female} source={result.source} />
                ) : null}
              </div>

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
                        onClick={() => setName(alternative.name)}
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
      </main>

      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-500 dark:border-slate-800/70 dark:text-slate-400">
        Сделано для документов, анкет и просто из любопытства.
      </footer>
    </div>
  )
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  )
}
