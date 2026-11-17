export type Gender = 'male' | 'female'

export type GenderFilter = Gender | 'both'

export type ResultSource = 'dictionary' | 'alias' | 'rule'

export interface PatronymicAlternative {
  name: string
  male: string
  female: string
}

export interface PatronymicResult {
  /** Имя в том виде, в котором его ввёл пользователь (с заглавных букв). */
  input: string
  /** Каноническое имя из словаря или нормализованный ввод. */
  name: string
  male: string
  female: string
  source: ResultSource
  /** Идентификатор сработавшего правила — для страницы «Почему так». */
  ruleId?: string
  /** Другие имена, к которым может относиться уменьшительная форма. */
  alternatives?: PatronymicAlternative[]
}

export type PatronymicErrorCode = 'empty' | 'latin' | 'invalid' | 'too_long' | 'unknown'

export interface PatronymicError {
  code: PatronymicErrorCode
  message: string
}

export type PatronymicOutcome =
  | { ok: true; result: PatronymicResult }
  | { ok: false; error: PatronymicError }
