import { useEffect, useState } from 'react'

export type Route = 'direct' | 'reverse' | 'rules'

const routes: Route[] = ['direct', 'reverse', 'rules']

/** Читает раздел из hash-адреса: `#/reverse` → reverse, всё незнакомое → direct. */
export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '').split(/[?/]/)[0]?.toLowerCase() ?? ''
  return routes.includes(clean as Route) ? (clean as Route) : 'direct'
}

export function routeHash(route: Route): string {
  return route === 'direct' ? '#/' : `#/${route}`
}

/** Следит за hash-адресом: ссылки в навигации меняют hash, а не перезагружают страницу. */
export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  useEffect(() => {
    function handleHashChange() {
      setRoute(parseRoute(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}
