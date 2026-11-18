import { useEffect } from 'react'
import type { Route } from './useHashRoute'

export interface RouteMeta {
  title: string
  description: string
}

export const routeMeta: Record<Route, RouteMeta> = {
  direct: {
    title: 'Отчество по имени отца — Иванович и Ивановна',
    description:
      'Образуйте отчество от имени отца: Иван → Иванович и Ивановна. Словарь популярных имён, уменьшительные формы и правила словообразования.',
  },
  reverse: {
    title: 'Имя отца по отчеству — Петрович → Пётр',
    description:
      'Обратный поиск: введите отчество и узнайте имя отца. Мужские и женские формы, словарь популярных имён, подсказки при вводе.',
  },
  rules: {
    title: 'Правила образования отчеств — словарь и окончания',
    description:
      'Как образуются отчества: -ович/-овна, -евич/-евна, -ич/-ична. Исключения, уменьшительные формы, ударения и ограничения сервиса.',
  },
}

/** Абсолютный адрес с учётом base GitHub Pages — для canonical и og:url. */
export function absoluteUrl(path = ''): string {
  return new URL(path, `${window.location.origin}${import.meta.env.BASE_URL}`).toString()
}

/** Обновляет title, description и OG-теги при смене раздела. */
export function useDocumentMeta(route: Route) {
  useEffect(() => {
    const meta = routeMeta[route]
    document.title = meta.title

    setMeta('name', 'description', meta.description)
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', absoluteUrl())
  }, [route])
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.setAttribute('content', content)
}
