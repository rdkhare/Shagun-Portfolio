export interface Author {
    _id: string;
    name: string;
    slug: string;
    image: string;
    bio: any[];
    socials?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      email?: string;
    };
  }
  
  export interface Category {
    _id: string;
    title: string;
    description: string;
  }
  
  export interface Article {
    _id: string;
    title: string;
    slug: string;
    author: Author;
    mainImage?: string | null;
    coverImage: string;
    category: string;
    categories: Category[];
    publishedAt: string;
    featured: boolean;
    body: PortableTextBlock[];
  }

  export interface PortableTextBlock {
    _key: string;
    _type: string;
    children: PortableTextSpan[];
    markDefs: any[];
    style: string;
  }

  export interface PortableTextSpan {
    _key: string;
    _type: string;
    marks: any[];
    text: string;
  } 