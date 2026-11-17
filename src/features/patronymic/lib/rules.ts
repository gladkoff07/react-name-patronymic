const SIBILANTS = new Set(['ж', 'ш', 'ч', 'щ', 'ц'])
const CONSONANTS = new Set([
  'б',
  'в',
  'г',
  'д',
  'ж',
  'з',
  'к',
  'л',
  'м',
  'н',
  'п',
  'р',
  'с',
  'т',
  'ф',
  'х',
  'ц',
  'ч',
  'ш',
  'щ',
])

export interface RuleOutput {
  male: string
  female: string
  ruleId: string
}

const make = (part: string, prefix: string, male: string, female: string, ruleId: string): RuleOutput => ({
  male: `${prefix}${part}${male}`,
  female: `${prefix}${part}${female}`,
  ruleId,
})

/**
 * Образование отчества по правилам для имён, которых нет в словаре.
 * Правила — запасной вариант: результат в UI помечается как «по правилу».
 * Дефисные имена обрабатываются по последней части («Мамед-Али» → «Мамед-Алиевич»).
 */
export function applyRules(displayName: string): RuleOutput | null {
  const separatorIndex = Math.max(displayName.lastIndexOf('-'), displayName.lastIndexOf(' '))
  const prefix = separatorIndex >= 0 ? displayName.slice(0, separatorIndex + 1) : ''
  const lastOriginal = displayName.slice(separatorIndex + 1)
  const last = lastOriginal.toLowerCase()

  if (!last) return null

  // -ий → -иевич: Георгий → Георгиевич. Традиционные формы (Васильевич) — в словаре.
  if (last.endsWith('ий')) {
    return make(lastOriginal.slice(0, -2), prefix, 'иевич', 'иевна', 'ending-iy')
  }

  // -й → -евич: Андрей → Андреевич, Николай → Николаевич.
  if (last.endsWith('й')) {
    return make(lastOriginal.slice(0, -1), prefix, 'евич', 'евна', 'ending-y')
  }

  // -ь → -евич: Игорь → Игоревич.
  if (last.endsWith('ь')) {
    return make(lastOriginal.slice(0, -1), prefix, 'евич', 'евна', 'ending-soft-sign')
  }

  // -а/-я: основа на -л даёт -ович (Гаврила → Гаврилович), иначе -ич (Никита → Никитич).
  if (last.endsWith('а') || last.endsWith('я')) {
    const stem = lastOriginal.slice(0, -1)
    const stemLower = stem.toLowerCase()
    if (stemLower.endsWith('л')) {
      return make(stem, prefix, 'ович', 'овна', 'ending-a-stem-l')
    }
    return make(stem, prefix, 'ич', 'ична', 'ending-a')
  }

  const finalLetter = last.charAt(last.length - 1)

  if (SIBILANTS.has(finalLetter)) {
    return make(lastOriginal, prefix, 'евич', 'евна', 'ending-sibilant')
  }

  if (CONSONANTS.has(finalLetter)) {
    return make(lastOriginal, prefix, 'ович', 'овна', 'ending-consonant')
  }

  // Нерусские имена на -и: Али → Алиевич.
  if (last.endsWith('и')) {
    return make(lastOriginal, prefix, 'евич', 'евна', 'ending-i')
  }

  return null
}
