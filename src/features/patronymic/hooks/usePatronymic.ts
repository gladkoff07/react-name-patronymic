import { useMemo } from 'react'
import { getPatronymic } from '../lib/engine'

export function usePatronymic(input: string) {
  return useMemo(() => getPatronymic(input), [input])
}
