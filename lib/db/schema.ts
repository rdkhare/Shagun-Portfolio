export type UserRole = 'admin' | 'editor';

export interface UserRow {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: 'draft' | 'published';
  featured: boolean;
  authorId: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryRow {
  id: string;
  title: string;
  description?: string;
  slug: string;
  createdAt: Date;
}

export interface ArticleCategoryRow {
  articleId: string;
  categoryId: string;
}

export interface MediaRow {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: Date;
} 