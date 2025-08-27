export type AdminArticleStatus = 'draft' | 'published';

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  status: AdminArticleStatus;
  featured: boolean;
  publishedAt?: string;
}

export interface AdminCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

function generateId(prefix: string = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const categories: AdminCategory[] = [
  { id: generateId('cat'), title: 'Technology', slug: 'technology' },
  { id: generateId('cat'), title: 'Society', slug: 'society' },
];

const articles: AdminArticle[] = [
  {
    id: generateId('art'),
    title: 'Welcome to the new CMS',
    slug: 'welcome-to-the-new-cms',
    status: 'draft',
    featured: false,
  },
  {
    id: generateId('art'),
    title: 'Investigating Digital Culture',
    slug: 'investigating-digital-culture',
    status: 'published',
    featured: true,
    publishedAt: new Date().toISOString(),
  },
];

export const cmsMock = {
  // Articles
  listArticles(): AdminArticle[] {
    return [...articles].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  },
  getArticleById(id: string): AdminArticle | undefined {
    return articles.find((a) => a.id === id);
  },
  createArticle(input: { title: string; slug?: string; status?: AdminArticleStatus; featured?: boolean }): AdminArticle {
    const article: AdminArticle = {
      id: generateId('art'),
      title: input.title,
      slug: input.slug ? slugify(input.slug) : slugify(input.title),
      status: input.status ?? 'draft',
      featured: input.featured ?? false,
    };
    articles.unshift(article);
    return article;
  },
  updateArticle(id: string, update: Partial<Omit<AdminArticle, 'id'>>): AdminArticle | undefined {
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    articles[idx] = { ...articles[idx], ...update };
    return articles[idx];
  },

  // Categories
  listCategories(): AdminCategory[] {
    return [...categories].sort((a, b) => a.title.localeCompare(b.title));
  },
  createCategory(input: { title: string; slug?: string; description?: string }): AdminCategory {
    const category: AdminCategory = {
      id: generateId('cat'),
      title: input.title,
      slug: input.slug ? slugify(input.slug) : slugify(input.title),
      description: input.description,
    };
    categories.push(category);
    return category;
  },
}; 