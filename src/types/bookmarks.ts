export interface Bookmark {
  id: string;
  url: string;
  title: string;
  tags: string[];
  memo: string;
  savedAt: Date;
  personalityScore: number;
}