import { routeHash } from './useHashRoute'
import type { Route } from './useHashRoute'

const tabs: Array<{ route: Route; label: string }> = [
  { route: 'direct', label: 'Имя → отчество' },
  { route: 'reverse', label: 'Отчество → имя' },
  { route: 'rules', label: 'Правила' },
]

export function RouteTabs({ route }: { route: Route }) {
  return (
    <nav
      aria-label="Разделы"
      className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-800/70"
    >
      {tabs.map((tab) => {
        const active = tab.route === route
        return (
          <a
            key={tab.route}
            href={routeHash(tab.route)}
            aria-current={active ? 'page' : undefined}
            className={`rounded-xl px-2 py-2 text-center text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none sm:text-sm ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </a>
        )
      })}
    </nav>
  )
}
