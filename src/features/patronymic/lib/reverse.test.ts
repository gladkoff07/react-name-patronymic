import { describe, expect, it } from 'vitest'
import { entries } from './dictionary'
import { stripStress } from './normalize'
import { getFatherName } from './reverse'

function resultOf(input: string) {
  const outcome = getFatherName(input)
  if (!outcome.ok) {
    throw new Error(`Ожидался успех для «${input}», получена ошибка: ${outcome.error.code}`)
  }
  return outcome.result
}

function errorOf(input: string) {
  const outcome = getFatherName(input)
  if (outcome.ok) {
    throw new Error(`Ожидалась ошибка для «${input}», получено: ${outcome.result.matches[0]?.name}`)
  }
  return outcome.error
}

describe('обратный режим', () => {
  it('находит отца по мужскому отчеству', () => {
    const result = resultOf('Петрович')
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0]).toEqual({
      name: 'Пётр',
      male: 'Петрович',
      female: 'Петровна',
    })
  })

  it('находит отца по женскому отчеству', () => {
    expect(resultOf('Ильинична').matches[0]?.name).toBe('Илья')
    expect(resultOf('Львовна').matches[0]?.name).toBe('Лев')
  })

  it('не зависит от регистра, ё и знака ударения', () => {
    expect(resultOf('петрович').matches[0]?.name).toBe('Пётр')
    expect(resultOf('Петро́вич').matches[0]?.name).toBe('Пётр')
    expect(resultOf('семеновна').matches[0]?.name).toBe('Семён')
  })

  it('возвращает все имена, если отчество совпало у нескольких', () => {
    const result = resultOf('Данилович')
    expect(result.matches.map((match) => match.name)).toContain('Данила')
  })

  it('каждое отчество из словаря находится обратно', () => {
    for (const entry of entries) {
      const male = getFatherName(entry.male)
      const female = getFatherName(entry.female)

      expect(male.ok, entry.male).toBe(true)
      expect(female.ok, entry.female).toBe(true)
      if (!male.ok || !female.ok) continue

      expect(male.result.matches.map((match) => match.name)).toContain(entry.name)
      expect(female.result.matches.map((match) => match.name)).toContain(entry.name)
    }
  })

  it('сохраняет отчество в аккуратном виде', () => {
    expect(resultOf('  петрович  ').input).toBe('Петрович')
    expect(stripStress(resultOf('Петро́вич').input)).toBe('Петрович')
  })

  it('сообщает, если отчества нет в словаре', () => {
    expect(errorOf('Эльдарович').code).toBe('not_found')
  })

  it('проверяет пустое значение и латиницу', () => {
    expect(errorOf('').code).toBe('empty')
    expect(errorOf('   ').code).toBe('empty')
    expect(errorOf('Petrovich').code).toBe('latin')
  })

  it('отклоняет недопустимые символы и слишком длинное значение', () => {
    expect(errorOf('Петрович!').code).toBe('invalid')
    expect(errorOf('П'.repeat(41)).code).toBe('too_long')
  })
})
