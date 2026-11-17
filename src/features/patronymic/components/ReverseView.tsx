import { useMemo, useState } from 'react'
import { CopyButton } from '../../../shared/ui/CopyButton'
import { useSettingsStore } from '../../../store/useSettingsStore'
import { getFatherName } from '../lib/reverse'
import { withStress } from '../lib/stress'
import { PatronymicInput } from './PatronymicInput'
import { StressToggle } from './StressToggle'

const examples = ['Петрович', 'Ильинична', 'Львовна', 'Никитич']

export function ReverseView() {
  const [value, setValue] = useState('')
  const showStress = useSettingsStore((state) => state.showStress)
  const outcome = useMemo(() => getFatherName(value), [value])

  const error = !outcome.ok && outcome.error.code !== 'empty' ? outcome.error.message : undefined
  const result = outcome.ok ? outcome.result : null

  return (
    <>
      <section className="pt-4 text-center sm:pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Имя отца по отчеству
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-pretty text-slate-600 sm:text-base dark:text-slate-400">
          Введите отчество — например, «Петрович» или «Ильинична», — и сервис подскажет, как звали
          отца. Обратный поиск идёт по словарю.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-7 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="space-y-5">
          <PatronymicInput value={value} onChange={setValue} error={error} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Мужская и женская формы ищутся одинаково
            </p>
            <StressToggle />
          </div>
        </div>

        {!value.trim() ? (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Попробуйте:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setValue(example)}
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
              <span>Отчество:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{result.input}</span>
              {result.matches.length > 1 ? (
                <span>· подходит несколько имён</span>
              ) : null}
            </p>

            <div className={`mt-3 grid gap-4 ${result.matches.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {result.matches.map((match) => (
                <div
                  key={match.name}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Имя отца
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                      {match.name}
                    </p>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-2">
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Сын: {showStress ? withStress(match.male) : match.male}
                      <br />
                      Дочь: {showStress ? withStress(match.female) : match.female}
                    </p>
                    <CopyButton value={match.name} />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Отчество восстановлено по словарю. Если имени нет в базе, обратный поиск бессилен —
              правилами однозначно определить имя нельзя.
            </p>
          </div>
        ) : null}
      </section>
    </>
  )
}
