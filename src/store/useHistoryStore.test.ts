import { beforeEach, describe, expect, it } from 'vitest'
import { HISTORY_LIMIT, useHistoryStore } from './useHistoryStore'

function entry(name: string) {
  return { name, male: `${name}ович`, female: `${name}овна`, source: 'dictionary' as const }
}

describe('история запросов', () => {
  beforeEach(() => {
    useHistoryStore.getState().clear()
  })

  it('добавляет имя и поднимает повтор наверх без дублей', () => {
    const { add } = useHistoryStore.getState()
    add(entry('Иван'))
    add(entry('Пётр'))
    add(entry('иван'))

    const entries = useHistoryStore.getState().entries
    expect(entries.map((item) => item.name)).toEqual(['иван', 'Пётр'])
  })

  it('ограничивает длину истории', () => {
    const { add } = useHistoryStore.getState()
    for (let index = 0; index < HISTORY_LIMIT + 3; index += 1) {
      add(entry(`Имя${index}`))
    }

    expect(useHistoryStore.getState().entries).toHaveLength(HISTORY_LIMIT)
    expect(useHistoryStore.getState().entries[0].name).toBe(`Имя${HISTORY_LIMIT + 2}`)
  })

  it('удаляет один элемент и очищает всё', () => {
    const { add, remove } = useHistoryStore.getState()
    add(entry('Иван'))
    add(entry('Пётр'))

    remove('иван')
    expect(useHistoryStore.getState().entries.map((item) => item.name)).toEqual(['Пётр'])

    useHistoryStore.getState().clear()
    expect(useHistoryStore.getState().entries).toHaveLength(0)
  })
})
