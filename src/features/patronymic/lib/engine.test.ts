import { describe, expect, it } from 'vitest'
import { findByPatronymic } from './dictionary'
import { getPatronymic } from './engine'
import { applyRules } from './rules'

function resultOf(input: string) {
  const outcome = getPatronymic(input)
  if (!outcome.ok) {
    throw new Error(`Ожидался успех для «${input}», получена ошибка: ${outcome.error.code}`)
  }
  return outcome.result
}

function errorOf(input: string) {
  const outcome = getPatronymic(input)
  if (outcome.ok) {
    throw new Error(`Ожидалась ошибка для «${input}», получен результат: ${outcome.result.male}`)
  }
  return outcome.error
}

describe('словарь', () => {
  it('образует простые отчества', () => {
    const result = resultOf('Иван')
    expect(result.male).toBe('Иванович')
    expect(result.female).toBe('Ивановна')
    expect(result.source).toBe('dictionary')
    expect(result.name).toBe('Иван')
  })

  it.each([
    ['Пётр', 'Петрович', 'Петровна'],
    ['Лев', 'Львович', 'Львовна'],
    ['Яков', 'Яковлевич', 'Яковлевна'],
    ['Павел', 'Павлович', 'Павловна'],
    ['Дмитрий', 'Дмитриевич', 'Дмитриевна'],
    ['Василий', 'Васильевич', 'Васильевна'],
    ['Анатолий', 'Анатольевич', 'Анатольевна'],
    ['Юрий', 'Юрьевич', 'Юрьевна'],
    ['Георгий', 'Георгиевич', 'Георгиевна'],
    ['Игорь', 'Игоревич', 'Игоревна'],
    ['Илья', 'Ильич', 'Ильинична'],
    ['Никита', 'Никитич', 'Никитична'],
    ['Кузьма', 'Кузьмич', 'Кузьминична'],
    ['Фома', 'Фомич', 'Фоминична'],
    ['Лука', 'Лукич', 'Лукинична'],
    ['Савва', 'Саввич', 'Саввична'],
    ['Гаврила', 'Гаврилович', 'Гавриловна'],
    ['Данила', 'Данилович', 'Даниловна'],
    ['Иннокентий', 'Иннокентьевич', 'Иннокентьевна'],
    ['Арсений', 'Арсеньевич', 'Арсеньевна'],
    ['Афанасий', 'Афанасьевич', 'Афанасьевна'],
    ['Кирилл', 'Кириллович', 'Кирилловна'],
    ['Филипп', 'Филиппович', 'Филипповна'],
  ])('%s → %s / %s', (name, male, female) => {
    const result = resultOf(name)
    expect(result.male).toBe(male)
    expect(result.female).toBe(female)
  })

  it('не зависит от регистра и лишних пробелов', () => {
    const result = resultOf('  иВаН  ')
    expect(result.input).toBe('Иван')
    expect(result.male).toBe('Иванович')
  })

  it('находит имя без ё и сохраняет ё в отчестве', () => {
    expect(resultOf('петр').name).toBe('Пётр')
    expect(resultOf('петр').male).toBe('Петрович')
    expect(resultOf('артем').male).toBe('Артёмович')
    expect(resultOf('семен').female).toBe('Семёновна')
  })
})

describe('уменьшительные формы', () => {
  it('распознаёт однозначную форму', () => {
    const result = resultOf('Ваня')
    expect(result.source).toBe('alias')
    expect(result.name).toBe('Иван')
    expect(result.male).toBe('Иванович')
    expect(result.alternatives ?? []).toHaveLength(0)
  })

  it('предлагает варианты для неоднозначной формы', () => {
    const result = resultOf('Слава')
    expect(result.source).toBe('alias')
    expect(result.name).toBe('Вячеслав')
    expect(result.alternatives?.map((item) => item.name).sort()).toEqual([
      'Станислав',
      'Ярослав',
    ])
  })
})

describe('правила для имён вне словаря', () => {
  it.each([
    ['Игорь', 'Игоревич', 'Игоревна'],
    ['Никита', 'Никитич', 'Никитична'],
    ['Гаврила', 'Гаврилович', 'Гавриловна'],
  ])('правило для %s даёт %s / %s', (name, male, female) => {
    const ruled = applyRules(name)
    expect(ruled?.male).toBe(male)
    expect(ruled?.female).toBe(female)
  })

  it('применяет правило, если имени нет в словаре', () => {
    const result = resultOf('Эльдар')
    expect(result.source).toBe('rule')
    expect(result.male).toBe('Эльдарович')
    expect(result.female).toBe('Эльдаровна')
  })

  it('обрабатывает мягкий знак', () => {
    expect(resultOf('Равиль').male).toBe('Равилевич')
  })

  it('обрабатывает имена на -ий вне словаря', () => {
    const result = resultOf('Вилентий')
    expect(result.male).toBe('Вилентиевич')
    expect(result.source).toBe('rule')
  })

  it('обрабатывает дефисные и составные имена', () => {
    expect(resultOf('Мамед-Али').male).toBe('Мамед-Алиевич')
    expect(resultOf('Абдул-Хамид').male).toBe('Абдул-Хамидович')
    expect(resultOf('Мамед Али').male).toBe('Мамед Алиевич')
  })

  it('правило срабатывает для имени на -и', () => {
    expect(resultOf('Хабиби').male).toBe('Хабибиевич')
  })
})

describe('ошибки ввода', () => {
  it('пустое значение', () => {
    expect(errorOf('').code).toBe('empty')
    expect(errorOf('   ').code).toBe('empty')
  })

  it('латиница', () => {
    expect(errorOf('Ivan').code).toBe('latin')
    expect(errorOf('Иван Ivan').code).toBe('latin')
  })

  it('недопустимые символы', () => {
    expect(errorOf('Иван123').code).toBe('invalid')
    expect(errorOf('Иван!').code).toBe('invalid')
  })

  it('слишком длинное имя', () => {
    expect(errorOf('И'.repeat(41)).code).toBe('too_long')
  })

  it('неизвестное окончание', () => {
    expect(errorOf('Ио').code).toBe('unknown')
  })
})

describe('обратный поиск', () => {
  it('находит имя отца по отчеству', () => {
    expect(findByPatronymic('Петрович')[0]?.name).toBe('Пётр')
    expect(findByPatronymic('ильич')[0]?.name).toBe('Илья')
  })

  it('находит отчество по женской форме', () => {
    expect(findByPatronymic('Петровна')[0]?.name).toBe('Пётр')
  })

  it('возвращает пустой список для незнакомого отчества', () => {
    expect(findByPatronymic('Эльдарович')).toEqual([])
  })
})
