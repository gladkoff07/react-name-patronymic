import { useSettingsStore } from '../../../store/useSettingsStore'
import { trackEvent } from '../../../shared/lib/analytics'

/** Компактный переключатель «показывать ударения» для карточек результата. */
export function StressToggle() {
  const showStress = useSettingsStore((state) => state.showStress)
  const toggleStress = useSettingsStore((state) => state.toggleStress)

  return (
    <button
      type="button"
      onClick={() => {
        toggleStress()
        trackEvent('stress_toggle', { enabled: !showStress })
      }}
      aria-pressed={showStress}
      title="Показывать знак ударения в отчествах"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
        showStress
          ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-300'
          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        а́
      </span>
      Ударения
    </button>
  )
}
