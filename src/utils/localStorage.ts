import type { Bookmark } from '../types/bookmarks';

const STORAGE_KEY = 'bookmarks';

// ブックマーク一覧を取得
export const getBookmarks = (): Bookmark[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

// ブックマークを保存
export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};