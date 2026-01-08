/**
 * Tests for storage utilities
 */

import { historyManager, bookmarkManager } from '../utils/storage';

describe('History Manager', () => {
  beforeEach(() => {
    historyManager.clear();
  });

  test('should add history entry', () => {
    historyManager.add({
      url: 'https://example.com',
      title: 'Example Site',
      theme: 'MINIMALIST'
    });

    const history = historyManager.getAll();
    expect(history).toHaveLength(1);
    expect(history[0].url).toBe('https://example.com');
  });

  test('should not duplicate URLs', () => {
    historyManager.add({
      url: 'https://example.com',
      title: 'Example Site',
      theme: 'MINIMALIST'
    });
    
    historyManager.add({
      url: 'https://example.com',
      title: 'Example Site Updated',
      theme: 'DARK_MODE'
    });

    const history = historyManager.getAll();
    expect(history).toHaveLength(1);
    expect(history[0].title).toBe('Example Site Updated');
  });

  test('should remove history entry', () => {
    historyManager.add({
      url: 'https://example.com',
      title: 'Example Site',
      theme: 'MINIMALIST'
    });

    historyManager.remove('https://example.com');
    const history = historyManager.getAll();
    expect(history).toHaveLength(0);
  });
});

describe('Bookmark Manager', () => {
  beforeEach(() => {
    bookmarkManager.clear();
  });

  test('should add bookmark', () => {
    bookmarkManager.add({
      url: 'https://example.com',
      title: 'Example Site'
    });

    const bookmarks = bookmarkManager.getAll();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].url).toBe('https://example.com');
  });

  test('should not add duplicate bookmarks', () => {
    bookmarkManager.add({
      url: 'https://example.com',
      title: 'Example Site'
    });
    
    bookmarkManager.add({
      url: 'https://example.com',
      title: 'Example Site'
    });

    const bookmarks = bookmarkManager.getAll();
    expect(bookmarks).toHaveLength(1);
  });

  test('should check if bookmark exists', () => {
    bookmarkManager.add({
      url: 'https://example.com',
      title: 'Example Site'
    });

    expect(bookmarkManager.has('https://example.com')).toBe(true);
    expect(bookmarkManager.has('https://other.com')).toBe(false);
  });

  test('should remove bookmark', () => {
    bookmarkManager.add({
      url: 'https://example.com',
      title: 'Example Site'
    });

    bookmarkManager.remove('https://example.com');
    expect(bookmarkManager.has('https://example.com')).toBe(false);
  });
});
