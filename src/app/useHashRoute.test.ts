import { describe, expect, it } from 'vitest'
import { parseRoute, routeHash } from './useHashRoute'

describe('hash-маршруты', () => {
  it('читает известные разделы', () => {
    expect(parseRoute('#/')).toBe('direct')
    expect(parseRoute('#/reverse')).toBe('reverse')
    expect(parseRoute('#/rules')).toBe('rules')
    expect(parseRoute('#/rules/')).toBe('rules')
    expect(parseRoute('#/rules?from=footer')).toBe('rules')
  })

  it('понимает адрес без косой черты', () => {
    expect(parseRoute('#reverse')).toBe('reverse')
    expect(parseRoute('reverse')).toBe('reverse')
  })

  it('неизвестный или пустой адрес ведёт на главную', () => {
    expect(parseRoute('')).toBe('direct')
    expect(parseRoute('#')).toBe('direct')
    expect(parseRoute('#/unknown')).toBe('direct')
  })

  it('строит адреса, которые сам же читает', () => {
    for (const route of ['direct', 'reverse', 'rules'] as const) {
      expect(parseRoute(routeHash(route))).toBe(route)
    }
  })
})
