# Отчество по имени отца

Веб-приложение, которое образует отчество от имени отца: `Иван → Иванович / Ивановна`.
Работает полностью в браузере, без бэкенда.

## Возможности

- Отчество для сына и дочери (или для обоих сразу).
- Словарь популярных имён с корректными исключениями: `Пётр → Петрович`, `Лев → Львович`,
  `Илья → Ильич`, `Никита → Никитич`.
- Понимает уменьшительные формы: `Ваня → Иван`, `Петя → Пётр`; для неоднозначных
  (`Слава`) предлагает варианты.
- Незнакомые имена обрабатывает по правилам словообразования и честно помечает результат.
- Обратный режим: `Петрович` или `Ильинична` → имя отца (поиск по словарю).
- Ударения: переключатель показывает `Ива́нович`, `Петро́вич`; копирование — без знака.
- Страница «Правила»: приоритет словаря, таблица окончаний, исключения, ограничения.
- Нормализация ввода: регистр, лишние пробелы, `ё`, дефисные имена, подсказка про латиницу.
- Ссылка с параметрами (`?name=Иван&g=female`) восстанавливает результат — удобно делиться.
- История последних восьми имён хранится в браузере.
- Разделы на hash-маршрутах: `#/`, `#/reverse`, `#/rules` — работают на GitHub Pages без сервера.
- Тёмная тема, адаптив, копирование результата, автодополнение.
- Устанавливается как PWA и работает офлайн: манифест, иконки, precache через Workbox.
- SEO: мета и Open Graph для каждого раздела, canonical, `sitemap.xml`, `robots.txt`, JSON-LD.
- Доступность: skip-link, управление фокусом при смене раздела, ARIA-комбобокс, озвучивание
  результата, контраст по WCAG AA, `prefers-reduced-motion`.
- Приватная аналитика: без cookies и идентификаторов, выключена по умолчанию, уважает DNT/GPC.

## Стек

React 19 + TypeScript + Vite 8, Tailwind CSS v4, Zustand, Vitest.

## Структура

```
src/
  app/                     # оболочка, hash-маршруты, вкладки разделов, seo-мета
  features/patronymic/
    data/names.json        # словарь: имя → отчества + уменьшительные формы
    data/stress.json       # отчества со знаком ударения
    lib/                   # normalize, rules, engine, reverse, stress, dictionary (+ тесты)
    components/            # Combobox, NameInput, ResultCard, DirectView, ReverseView, RulesPage
    hooks/                 # usePatronymic, useQueryState
  shared/ui/               # CopyButton, ThemeToggle, InfoCard, иконки
  shared/lib/              # общие утилиты, аналитика
  store/                   # Zustand: тема, ударения, история
  test/setup.ts
public/                    # robots.txt, sitemap.xml, og-image.png, icons/ (PWA)
```

## Переменные окружения

| Переменная           | Назначение                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `VITE_ANALYTICS_URL` | Endpoint для событий аналитики. Без неё аналитика не отправляется. |

Аналитика не использует cookies и идентификаторы: только имя события, маршрут, время и
обезличенные свойства. Уважает `Do Not Track` и `Global Privacy Control`.

## PWA и офлайн

Сборка генерирует `sw.js`, `manifest.webmanifest` и `registerSW.js` (`vite-plugin-pwa`,
Workbox). Проверить локально:

```bash
npm run build
npx vite preview --base /react-name-patronymic/ --port 4173
```

Откройте `http://localhost:4173/react-name-patronymic/` — после первой загрузки приложение
доступно без сети.

## Деплой

GitHub Actions публикует `dist/` в GitHub Pages:
https://gladkoff07.github.io/react-name-patronymic/

## Команды

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # все тесты (Vitest + Testing Library)
npm run typecheck  # проверка типов
npm run lint       # oxlint
npm run build      # production-сборка
```

## Как добавить имя в словарь

1. Открой `src/features/patronymic/data/names.json`.
2. Добавь запись:

```json
{ "name": "Имя", "male": "Имяович", "female": "Имяовна", "aliases": ["Уменьшительное"] }
```

3. Запусти `npm test` и добавь кейс в `lib/engine.test.ts`, если имя спорное.
4. Хочешь показывать ударение — добавь оба отчества в `data/stress.json`
   со знаком `́` (U+0301) после ударной гласной: `"Иванович": "Ива́нович"`.
