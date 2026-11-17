import { CopyButton } from '../../../shared/ui/CopyButton'
import type { ResultSource } from '../lib/types'

interface ResultCardProps {
  label: string
  patronymic: string
  source: ResultSource
}

const sourceMeta: Record<ResultSource, { label: string; className: string }> = {
  dictionary: {
    label: 'словарь',
    className:
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  },
  alias: {
    label: 'уменьшительное имя',
    className:
      'bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20',
  },
  rule: {
    label: 'по правилу',
    className:
      'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  },
}

export function ResultCard({ label, patronymic, source }: ResultCardProps) {
  const meta = sourceMeta[source]

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
      <div>
        <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {patronymic}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.className}`}
        >
          {meta.label}
        </span>
        <CopyButton value={patronymic} />
      </div>
    </div>
  )
}
