import { describe, expect, it } from 'vitest'
import { buildQuery, parseQuery } from './useQueryState'

describe('URL-состояние', () => {
  it('читает имя и пол из ссылки', () => {
    expect(parseQuery('?name=%D0%98%D0%B2%D0%B0%D0%BD&g=male')).toEqual({
      name: 'Иван',
      gender: 'male',
    })
  })

  it('игнорирует неизвестное значение пола', () => {
    expect(parseQuery('?g=other')).toEqual({ name: '', gender: 'both' })
  })

  it('строит короткую ссылку без значений по умолчанию', () => {
    expect(buildQuery({ name: ' Иван ', gender: 'both' })).toBe('?name=%D0%98%D0%B2%D0%B0%D0%BD')
    expect(buildQuery({ name: '', gender: 'female' })).toBe('?g=female')
    expect(buildQuery({ name: '', gender: 'both' })).toBe('')
  })

  it('переживает круговой разбор ссылки', () => {
    const state = { name: 'Пётр', gender: 'female' as const }
    expect(parseQuery(buildQuery(state))).toEqual(state)
  })
})
