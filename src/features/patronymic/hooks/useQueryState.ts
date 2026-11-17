import { useEffect, useState } from 'react'
import type { GenderFilter } from '../lib/types'

export interface QueryState {
  name: string
  gender: GenderFilter
}

export function parseQuery(search: string): QueryState {
  const params = new URLSearchParams(search)
  const gender = params.get('g')

  return {
    name: params.get('name') ?? '',
    gender: gender === 'male' || gender === 'female' ? gender : 'both',
  }
}

export function buildQuery(state: QueryState): string {
  const params = new URLSearchParams()
  const name = state.name.trim()

  if (name) params.set('name', name)
  if (state.gender !== 'both') params.set('g', state.gender)

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Хранит имя и пол в состоянии React и синхронизирует их с адресной строкой.
 * Ссылку вида `?name=Иван&g=male` можно отправить — при открытии всё восстановится.
 */
export function useQueryState() {
  const [state, setState] = useState<QueryState>(() => parseQuery(window.location.search))

  useEffect(() => {
    const url = `${window.location.pathname}${buildQuery(state)}${window.location.hash}`
    window.history.replaceState(null, '', url)
  }, [state])

  useEffect(() => {
    function handlePopState() {
      setState(parseQuery(window.location.search))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return [state, setState] as const
}
