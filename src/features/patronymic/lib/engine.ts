import { findAliasEntries, findByNameKey } from './dictionary'
import { hasLatinLetters, isCyrillicName, toDisplayName, toLookupKey } from './normalize'
import { applyRules } from './rules'
import type { NameEntry } from './dictionary'
import type { PatronymicAlternative, PatronymicOutcome, PatronymicResult } from './types'

const MAX_LENGTH = 40

export function getPatronymic(rawInput: string): PatronymicOutcome {
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return fail('empty', 'Введите имя отца — например, Иван.')
  }

  if (trimmed.length > MAX_LENGTH) {
    return fail('too_long', `Имя не должно быть длиннее ${MAX_LENGTH} символов.`)
  }

  if (hasLatinLetters(trimmed)) {
    return fail('latin', 'Похоже, имя набрано латиницей. Переключите раскладку на русскую.')
  }

  if (!isCyrillicName(trimmed)) {
    return fail('invalid', 'В имени допустимы только русские буквы, дефис и пробел.')
  }

  const input = toDisplayName(trimmed)
  const key = toLookupKey(input)

  const exact = findByNameKey(key)
  if (exact) {
    return ok({
      input,
      name: exact.name,
      male: exact.male,
      female: exact.female,
      source: 'dictionary',
    })
  }

  const aliasEntries = findAliasEntries(key)
  if (aliasEntries && aliasEntries.length > 0) {
    const [primary, ...rest] = aliasEntries
    return ok({
      input,
      name: primary.name,
      male: primary.male,
      female: primary.female,
      source: 'alias',
      alternatives: rest.map(toAlternative),
    })
  }

  const ruled = applyRules(input)
  if (ruled) {
    return ok({
      input,
      name: input,
      male: ruled.male,
      female: ruled.female,
      source: 'rule',
      ruleId: ruled.ruleId,
    })
  }

  return fail(
    'unknown',
    'Не удалось образовать отчество. Проверьте имя или добавьте его в словарь.',
  )
}

function toAlternative(entry: NameEntry): PatronymicAlternative {
  return { name: entry.name, male: entry.male, female: entry.female }
}

function ok(result: PatronymicResult): PatronymicOutcome {
  return { ok: true, result }
}

function fail(code: 'empty' | 'latin' | 'invalid' | 'too_long' | 'unknown', message: string): PatronymicOutcome {
  return { ok: false, error: { code, message } }
}
