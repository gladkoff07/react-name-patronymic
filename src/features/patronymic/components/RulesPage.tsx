import type { ReactNode } from 'react'
import { InfoCard } from '../../../shared/ui/InfoCard'
import { dictionarySize } from '../lib/dictionary'
import { stressSize } from '../lib/stress'

const ruleRows: Array<{ ending: string; result: string; example: string }> = [
  { ending: 'Твёрдый согласный', result: '-ович / -овна', example: 'Эльдар → Эльдарович' },
  { ending: 'Шипящий или «ц»', result: '-евич / -евна', example: 'Мкртыч → Мкртычевич' },
  { ending: 'Мягкий знак', result: '-евич / -евна', example: 'Равиль → Равилевич' },
  { ending: 'Конец на «й»', result: '-евич / -евна', example: 'Андрей → Андреевич' },
  { ending: 'Конец на «-ий»', result: '-иевич / -иевна', example: 'Вилентий → Вилентиевич' },
  { ending: 'Конец на «-а», «-я» (основа на «л»)', result: '-ович / -овна', example: 'Гаврила → Гаврилович' },
  { ending: 'Конец на «-а», «-я» (иначе)', result: '-ич / -ична', example: 'Никита → Никитич' },
  { ending: 'Конец на «-и»', result: '-евич / -евна', example: 'Али → Алиевич' },
]

const exceptions = [
  ['Пётр', 'Петрович', 'Петровна'],
  ['Лев', 'Львович', 'Львовна'],
  ['Павел', 'Павлович', 'Павловна'],
  ['Яков', 'Яковлевич', 'Яковлевна'],
  ['Илья', 'Ильич', 'Ильинична'],
  ['Никита', 'Никитич', 'Никитична'],
  ['Кузьма', 'Кузьмич', 'Кузьминична'],
  ['Фома', 'Фомич', 'Фоминична'],
  ['Лука', 'Лукич', 'Лукинична'],
  ['Савва', 'Саввич', 'Саввична'],
]

const diminutives = [
  ['Ваня', 'Иван'],
  ['Петя', 'Пётр'],
  ['Саша', 'Александр'],
  ['Слава', 'Вячеслав, Станислав или Ярослав'],
]

export function RulesPage() {
  return (
    <>
      <section className="pt-4 text-center sm:pt-8">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Словарь и правила
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-pretty text-slate-600 sm:text-base dark:text-slate-400">
          Как сервис образует отчество, почему иногда ошибается и что означают бейджи в
          результатах.
        </p>
      </section>

      <div className="mt-8 space-y-4">
        <Section title="Откуда берётся результат">
          <p>
            Сначала сервис ищет имя в словаре — сейчас в нём {dictionarySize} имён. Для них
            отчества выверены вручную: «Пётр&nbsp;→&nbsp;Петрович», «Лев&nbsp;→&nbsp;Львович»,
            «Илья&nbsp;→&nbsp;Ильич».
          </p>
          <p className="mt-3">
            Если точного имени нет, проверяются уменьшительные формы: «Ваня&nbsp;→&nbsp;Иван».
            Для неоднозначных форм вроде «Славы» сервис предложит все варианты.
          </p>
          <p className="mt-3">
            И только затем в дело вступают общие правила. Такой результат помечается бейджем
            «по правилу»: он требует проверки, потому что правила не знают всех исключений.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20">
              словарь
            </Badge>
            <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20">
              уменьшительное имя
            </Badge>
            <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20">
              по правилу
            </Badge>
          </div>
        </Section>

        <Section title="Правила для имён вне словаря">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  <th className="py-2 pr-4 font-medium">Окончание имени</th>
                  <th className="py-2 pr-4 font-medium">Отчество</th>
                  <th className="py-2 font-medium">Пример</th>
                </tr>
              </thead>
              <tbody>
                {ruleRows.map((row) => (
                  <tr
                    key={row.ending}
                    className="border-t border-slate-200/70 align-top dark:border-slate-800/70"
                  >
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{row.ending}</td>
                    <td className="py-2 pr-4 text-slate-900 dark:text-slate-100">{row.result}</td>
                    <td className="py-2 text-slate-500 dark:text-slate-400">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Дефисные и составные имена обрабатываются по последней части: «Мамед-Али&nbsp;→&nbsp;Мамед-Алиевич».
          </p>
        </Section>

        <Section title="Исключения из словаря">
          <div className="grid gap-2 sm:grid-cols-2">
            {exceptions.map(([name, male, female]) => (
              <div
                key={name}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950/40"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">{name}</span>
                <span className="text-right text-slate-500 dark:text-slate-400">
                  {male}
                  <br />
                  {female}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Уменьшительные формы">
          <div className="grid gap-2 sm:grid-cols-2">
            {diminutives.map(([alias, name]) => (
              <div
                key={alias}
                className="flex items-baseline justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950/40"
              >
                <span className="text-slate-500 dark:text-slate-400">{alias}</span>
                <span className="text-right font-medium text-slate-900 dark:text-slate-100">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Список уменьшительных форм неполный: сервис знает самые распространённые.
          </p>
        </Section>

        <Section title="Ударения">
          <p>
            Знак ударения можно включить переключателем «Ударения» рядом с полем ввода. Разметка
            есть для {Math.round(stressSize / 2)} популярных имён — остальные показываются без
            знака.
          </p>
          <p className="mt-3">
            Буква «ё» всегда ударная, поэтому отдельный знак над ней не ставится: «Пётр&nbsp;→&nbsp;Петро́вич»,
            но «Семён&nbsp;→&nbsp;Семёнович». Копирование всегда даёт форму без знака — её удобнее
            вставлять в документы.
          </p>
        </Section>

        <Section title="Обратный режим">
          <p>
            «Отчество&nbsp;→&nbsp;имя отца» работает только по словарю: по отчеству можно
            однозначно восстановить имя, если оно есть в базе. Для имён, образованных по правилам,
            обратный поиск честно сообщает, что ничего не нашёл.
          </p>
        </Section>

        <Section title="Нормализация и ограничения">
          <ul className="list-disc space-y-2 pl-5">
            <li>Регистр, лишние пробелы и «ё/е» не важны: «петр», «ПЁТР» и «Пётр» — одно имя.</li>
            <li>Поддерживаются дефисные и составные имена: «Мамед-Али», «Мамед Али».</li>
            <li>Ввод латиницей и посторонние символы отклоняются с подсказкой.</li>
            <li>
              Правила — упрощённая модель: редкие и нерусские имена могут требовать ручной
              проверки.
            </li>
            <li>Склонение отчеств по падежам пока не поддерживается — это в планах.</li>
          </ul>
        </Section>

        <section className="grid gap-3 sm:grid-cols-3">
          <InfoCard
            title="Словарь"
            text={`${dictionarySize} имён с готовыми отчествами и уменьшительными формами.`}
          />
          <InfoCard
            title="Правила"
            text="Запасной вариант для незнакомых имён: восемь окончаний и проверка по словарю."
          />
          <InfoCard
            title="Без сервера"
            text="Словарь и правила работают прямо в браузере, без запросов и аналитики."
          />
        </section>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </section>
  )
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  )
}
