import { generateKeyBetween } from 'fractional-indexing'

export class FractionalIndexManager {
  private cache = new Map<string, string>()

  getInitialOrder(): string {
    return 'a0'
  }

  generateBetween(prevOrder: string | null, nextOrder: string | null): string {
    const cacheKey = `${prevOrder}-${nextOrder}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }
    const newOrder = generateKeyBetween(prevOrder, nextOrder)
    this.cache.set(cacheKey, newOrder)
    return newOrder
  }

  generateAfter(prevOrder: string | null): string {
    return this.generateBetween(prevOrder, null)
  }

  generateBefore(nextOrder: string | null): string {
    return this.generateBetween(null, nextOrder)
  }
}