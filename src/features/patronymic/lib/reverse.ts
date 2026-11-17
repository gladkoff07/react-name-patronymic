import { findByPatronymic } from './dictionary'
import { hasLatinLetters, isCyrillicName, toDisplayName } from './normalize'
import type { ReverseErrorCode, ReverseOutcome } from './types'

const MAX_LENGTH = 40

/** Обратный режим: отчество → имя отца. Работает по словарю, без правил. */
export function getFatherName(rawInput: string): ReverseOutcome {
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return fail('empty', 'Введите отчество — например, Петрович.')
  }

  if (trimmed.length > MAX_LENGTH) {
    return fail('too_long', `Отчество не должно быть длиннее ${MAX_LENGTH} символов.`)
  }

  if (hasLatinLetters(trimmed)) {
    return fail('latin', 'Похоже, отчество набрано латиницей. Переключите раскладку на русскую.')
  }

  if (!isCyrillicName(trimmed)) {
    return fail('invalid', 'В отчестве допустимы только русские буквы, дефис и пробел.')
  }

  const input = toDisplayName(trimmed)
  const matches = findByPatronymic(input)

  if (matches.length === 0) {
    return fail(
      'not_found',
      'Такого отчества нет в словаре. Обратный поиск работает только для имён из словаря — правилами его не восстановить.',
    )
  }

  return {
    ok: true,
    result: {
      input,
      matches: matches.map((entry) => ({
        name: entry.name,
        male: entry.male,
        female: entry.female,
      })),
    },
  }
}

function fail(code: ReverseErrorCode, message: string): ReverseOutcome {
  return { ok: false, error: { code, message } }
}
