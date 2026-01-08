/**
 * Utility functions for local storage operations
 */

export interface HistoryEntry {
  url: string;
  title: string;
  timestamp: number;
  theme: string;
}

export interface Bookmark {
  url: string;
  title: string;
  addedAt: number;
}

const HISTORY_KEY = 'neuralrender_history';
const BOOKMARKS_KEY = 'neuralrender_bookmarks';
const MAX_HISTORY_ITEMS = 50;

/**
 * History management
 */
export const historyManager = {
  add(entry: Omit<HistoryEntry, 'timestamp'>): void {
    try {
      const history = this.getAll();
      const newEntry: HistoryEntry = {
        ...entry,
        timestamp: Date.now()
      };
      
      // Remove duplicates
      const filtered = history.filter(h => h.url !== entry.url);
      
      // Add new entry at the beginning and limit size
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  },

  getAll(): HistoryEntry[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  },

  remove(url: string): void {
    try {
      const history = this.getAll();
      const filtered = history.filter(h => h.url !== url);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove history entry:', error);
    }
  }
};

/**
 * Bookmark management
 */
export const bookmarkManager = {
  add(bookmark: Omit<Bookmark, 'addedAt'>): void {
    try {
      const bookmarks = this.getAll();
      
      // Check if already bookmarked
      if (bookmarks.some(b => b.url === bookmark.url)) {
        return;
      }
      
      const newBookmark: Bookmark = {
        ...bookmark,
        addedAt: Date.now()
      };
      
      const updated = [newBookmark, ...bookmarks];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save bookmark:', error);
    }
  },

  getAll(): Bookmark[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      return [];
    }
  },

  remove(url: string): void {
    try {
      const bookmarks = this.getAll();
      const filtered = bookmarks.filter(b => b.url !== url);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  },

  has(url: string): boolean {
    return this.getAll().some(b => b.url === url);
  },

  clear(): void {
    try {
      localStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
    }
  }
};
