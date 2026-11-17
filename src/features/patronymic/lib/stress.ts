import stressData from '../data/stress.json'
import { toLookupKey } from './normalize'

const byPatronymic = new Map<string, string>()

for (const [plain, marked] of Object.entries(stressData.patronymics)) {
  byPatronymic.set(toLookupKey(plain), marked)
}

/** Сколько отчеств размечено ударениями — для подписи в интерфейсе. */
export const stressSize = byPatronymic.size

/** Возвращает отчество со знаком ударения, если он есть в словаре. */
export function withStress(patronymic: string): string {
  return byPatronymic.get(toLookupKey(patronymic)) ?? patronymic
}

export function hasStress(patronymic: string): boolean {
  return byPatronymic.has(toLookupKey(patronymic))
}
