/**
 * Аналитика без cookies и идентификаторов: только имя события и обезличенные свойства.
 * По умолчанию выключена — отправка включается переменной окружения VITE_ANALYTICS_URL.
 * Уважает Do Not Track и Global Privacy Control.
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'patronymic_result'
  | 'reverse_result'
  | 'reverse_not_found'
  | 'stress_toggle'

export type AnalyticsProps = Record<string, string | number | boolean>

export interface AnalyticsPayload {
  name: AnalyticsEvent
  props?: AnalyticsProps
  path: string
  ts: number
}

function getEndpoint(): string | undefined {
  const value = import.meta.env.VITE_ANALYTICS_URL
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function isOptedOut(): boolean {
  if (typeof navigator === 'undefined') return true

  const privacy = navigator as Navigator & { globalPrivacyControl?: boolean }
  return navigator.doNotTrack === '1' || privacy.globalPrivacyControl === true
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(getEndpoint()) && !isOptedOut()
}

export function buildEvent(
  name: AnalyticsEvent,
  props?: AnalyticsProps,
  now = Date.now(),
  path = window.location.pathname,
): AnalyticsPayload {
  return props ? { name, props, path, ts: now } : { name, path, ts: now }
}

/** Отправляет событие, если аналитика настроена. Никогда не бросает исключений. */
export function trackEvent(name: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!isAnalyticsEnabled()) return

  const endpoint = getEndpoint()
  if (!endpoint) return

  const body = JSON.stringify(buildEvent(name, props))

  try {
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }))
      return
    }

    void fetch(endpoint, {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      /* сеть недоступна — молча игнорируем */
    })
  } catch {
    /* аналитика не должна ломать приложение */
  }
}
