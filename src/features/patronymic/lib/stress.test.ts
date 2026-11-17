import { describe, expect, it } from 'vitest'
import { entries } from './dictionary'
import { stripStress } from './normalize'
import { hasStress, stressSize, withStress } from './stress'

const STRESS_MARK = '\u0301'

describe('ударения', () => {
  it('добавляет знак ударения после ударной гласной', () => {
    expect(withStress('Иванович')).toBe('Ива́нович')
    expect(withStress('Петровна')).toBe('Петро́вна')
    expect(withStress('Ильич')).toBe('Ильи́ч')
  })

  it('не зависит от регистра и ё', () => {
    expect(withStress('петрович')).toBe('Петро́вич')
    expect(withStress('СЕМЁНОВИЧ')).toBe('Семёнович')
  })

  it('оставляет отчество без изменений, если разметки нет', () => {
    expect(withStress('Эльдарович')).toBe('Эльдарович')
    expect(hasStress('Эльдарович')).toBe(false)
    expect(hasStress('Иванович')).toBe(true)
  })

  it('знак ударения не ломает нормализацию', () => {
    expect(stripStress(withStress('Александрович'))).toBe('Александрович')
  })

  it('разметка валидна: один знак, позиция и буквы сохранены', () => {
    expect(stressSize).toBeGreaterThanOrEqual(160)

    for (const entry of entries) {
      for (const patronymic of [entry.male, entry.female]) {
        const marked = withStress(patronymic)
        expect(stripStress(marked), patronymic).toBe(patronymic)

        if (marked === patronymic) continue

        expect(marked, patronymic).toContain(STRESS_MARK)
        expect(marked.replace(STRESS_MARK, ''), patronymic).toBe(patronymic)
      }
    }
  })
})
