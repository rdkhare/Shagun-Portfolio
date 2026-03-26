// Basic content types for custom CMS

export interface PublicTestimonial {
  id: string
  author: string
  company: string
  title?: string
  quote: string
  sortOrder?: number
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  image?: string;
  bio?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface Category {
  id: string;
  title: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  author: Author;
  coverImage?: string;
  category?: string;
  categories?: Category[];
  publishedAt: string;
  featured: boolean;
  featuredOrder?: number;
  content?: string; // Will be HTML or markdown - optional for external articles
  excerpt?: string;
  externalUrl?: string; // Link to third-party article
  publisher?: string; // Publication name
} 