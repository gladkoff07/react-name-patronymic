import { describe, expect, it } from 'vitest'
import { absoluteUrl, routeMeta } from './seo'

describe('SEO-мета', () => {
  it('у каждого раздела свой заголовок и описание', () => {
    const metas = Object.values(routeMeta)
    const titles = metas.map((meta) => meta.title)

    expect(new Set(titles).size).toBe(titles.length)

    for (const meta of metas) {
      expect(meta.title.length).toBeGreaterThan(10)
      expect(meta.title.length).toBeLessThanOrEqual(70)
      expect(meta.description.length).toBeGreaterThan(60)
      expect(meta.description.length).toBeLessThanOrEqual(180)
      expect(meta.description.endsWith('.')).toBe(true)
    }
  })

  it('строит абсолютные адреса с учётом base', () => {
    expect(absoluteUrl()).toBe(`${window.location.origin}/`)
    expect(absoluteUrl('og-image.png')).toBe(`${window.location.origin}/og-image.png`)
    expect(absoluteUrl('icons/pwa-192x192.png')).toBe(
      `${window.location.origin}/icons/pwa-192x192.png`,
    )
  })
})
