/**
 * Tests for cache utility
 * Run with: npm test (after adding test runner)
 */

import { Cache } from '../utils/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>();
  });

  test('should store and retrieve data', () => {
    cache.set('test-url', 'test-data');
    const result = cache.get('test-url');
    expect(result).toBe('test-data');
  });

  test('should return null for non-existent keys', () => {
    const result = cache.get('non-existent');
    expect(result).toBeNull();
  });

  test('should support cache with parameters', () => {
    cache.set('url', 'data1', { theme: 'dark' });
    cache.set('url', 'data2', { theme: 'light' });
    
    const result1 = cache.get('url', { theme: 'dark' });
    const result2 = cache.get('url', { theme: 'light' });
    
    expect(result1).toBe('data1');
    expect(result2).toBe('data2');
  });

  test('should clear all cache', () => {
    cache.set('url1', 'data1');
    cache.set('url2', 'data2');
    cache.clear();
    
    expect(cache.get('url1')).toBeNull();
    expect(cache.get('url2')).toBeNull();
  });

  test('should report cache statistics', () => {
    cache.set('url1', 'data1');
    cache.set('url2', 'data2');
    
    const stats = cache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.entries).toContain('url1');
    expect(stats.entries).toContain('url2');
  });
});
