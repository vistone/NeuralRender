/**
 * Simple in-memory cache for storing analysis results
 * Reduces API calls for frequently visited URLs
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  theme?: string;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>();

  /**
   * Generate a cache key from URL and optional parameters
   */
  private generateKey(url: string, params?: Record<string, string>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  /**
   * Store data in cache
   */
  set(url: string, data: T, params?: Record<string, string>): void {
    const key = this.generateKey(url, params);
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      theme: params?.theme
    });
  }

  /**
   * Retrieve data from cache if not expired
   */
  get(url: string, params?: Record<string, string>): T | null {
    const key = this.generateKey(url, params);
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if cache has valid entry
   */
  has(url: string, params?: Record<string, string>): boolean {
    return this.get(url, params) !== null;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Remove specific entry
   */
  remove(url: string, params?: Record<string, string>): void {
    const key = this.generateKey(url, params);
    this.store.delete(key);
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: string[] } {
    return {
      size: this.store.size,
      entries: Array.from(this.store.keys())
    };
  }
}
