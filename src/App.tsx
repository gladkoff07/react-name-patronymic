import { useEffect, useRef } from 'react'
import { RouteTabs } from './app/RouteTabs'
import { useDocumentMeta } from './app/seo'
import { useHashRoute } from './app/useHashRoute'
import { DirectView } from './features/patronymic/components/DirectView'
import { ReverseView } from './features/patronymic/components/ReverseView'
import { RulesPage } from './features/patronymic/components/RulesPage'
import { trackEvent } from './shared/lib/analytics'
import { ThemeToggle } from './shared/ui/ThemeToggle'
import { useSettingsStore } from './store/useSettingsStore'

export default function App() {
  const route = useHashRoute()
  const theme = useSettingsStore((state) => state.theme)
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRoute = useRef(true)

  useDocumentMeta(route)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    trackEvent('page_view', { route })
  }, [route])

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false
      return
    }

    // После смены раздела переводим фокус в main — скринридер сообщит новый заголовок.
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo?.({ top: 0 })
  }, [route])

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none"
      >
        Перейти к содержимому
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-indigo-100/90 via-indigo-50/50 to-transparent dark:from-indigo-500/10 dark:via-indigo-500/5"
      />

      <header className="mx-auto w-full max-w-3xl px-4 pt-6">
        <div className="flex items-center justify-between gap-3">
          <a
            href="#/"
            className="flex items-center gap-3 rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-[1.2rem] font-bold text-white shadow-lg shadow-indigo-600/25">
              О
            </span>
            <span className="leading-tight">
              <span className="block text-[1.1rem] font-semibold tracking-[0.5px]">Отчество</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                по имени отца
              </span>
            </span>
          </a>
          <ThemeToggle />
        </div>

        <div className="mt-4">
          <RouteTabs route={route} />
        </div>
      </header>

      <main
        ref={mainRef}
        id="content"
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 focus:outline-none"
      >
        {route === 'direct' ? <DirectView /> : null}
        {route === 'reverse' ? <ReverseView /> : null}
        {route === 'rules' ? <RulesPage /> : null}
      </main>

      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-500 dark:border-slate-800/70 dark:text-slate-400">
        Сделано для документов, анкет и просто из любопытства.
      </footer>
    </div>
  )
}
