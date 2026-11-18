import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildEvent, isAnalyticsEnabled, trackEvent } from './analytics'

const ENDPOINT = 'https://analytics.test/collect'

describe('аналитика', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true })
  })

  it('собирает обезличенное событие', () => {
    expect(buildEvent('page_view', { route: 'rules' }, 123, '/app/')).toEqual({
      name: 'page_view',
      props: { route: 'rules' },
      path: '/app/',
      ts: 123,
    })

    expect(buildEvent('page_view', undefined, 1, '/')).toEqual({
      name: 'page_view',
      path: '/',
      ts: 1,
    })
  })

  it('по умолчанию выключена и ничего не отправляет', () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    expect(isAnalyticsEnabled()).toBe(false)
    trackEvent('page_view', { route: 'direct' })

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('уважает Do Not Track', () => {
    vi.stubEnv('VITE_ANALYTICS_URL', ENDPOINT)
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true })

    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    expect(isAnalyticsEnabled()).toBe(false)
    trackEvent('page_view', { route: 'direct' })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('отправляет событие на настроенный endpoint', async () => {
    vi.stubEnv('VITE_ANALYTICS_URL', ENDPOINT)
    Object.defineProperty(navigator, 'sendBeacon', { value: undefined, configurable: true })

    const fetchSpy = vi.fn((_input: RequestInfo | URL, _init?: RequestInit) =>
      Promise.resolve(new Response(null, { status: 204 })),
    )
    vi.stubGlobal('fetch', fetchSpy)

    expect(isAnalyticsEnabled()).toBe(true)
    trackEvent('patronymic_result', { source: 'dictionary' })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe(ENDPOINT)
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toMatchObject({
      name: 'patronymic_result',
      props: { source: 'dictionary' },
      path: window.location.pathname,
    })
  })
})
