const STRESS_MARKS = /[\u0300-\u036f]/g
const LATIN_LETTERS = /[A-Za-z]/
const CYRILLIC_NAME = /^[А-Яа-яЁё]+(?:[-\s][А-Яа-яЁё]+)*$/

/** Убирает знаки ударения, если пользователь вставил имя с ними. */
export function stripStress(value: string): string {
  return value.normalize('NFC').replace(STRESS_MARKS, '')
}

/**
 * Ключ для поиска по словарю: нижний регистр, `ё → е`, схлопнутые пробелы,
 * единый вид дефиса. Используется только для сравнения, не для вывода.
 */
export function toLookupKey(value: string): string {
  return stripStress(value)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, '-')
    .toLowerCase()
    .replace(/ё/g, 'е')
}

/** Приводит имя к аккуратному виду для отображения: «иВаН» → «Иван». */
export function toDisplayName(value: string): string {
  return stripStress(value)
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, '-')
    .split(' ')
    .map((word) => word.split('-').map(capitalize).join('-'))
    .join(' ')
}

function capitalize(word: string): string {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function hasLatinLetters(value: string): boolean {
  return LATIN_LETTERS.test(value)
}

export function isCyrillicName(value: string): boolean {
  const normalized = stripStress(value).trim().replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-')
  return CYRILLIC_NAME.test(normalized)
}
