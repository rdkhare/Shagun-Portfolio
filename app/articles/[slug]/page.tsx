import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HiExternalLink } from "react-icons/hi";

type Props = {
  params: Promise<{ slug: string }>;
};

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  featured: boolean;
  publishedAt: string;
  externalUrl?: string;
  publisher?: string;
  author: {
    id: string;
    name: string;
    slug: string;
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article');
    }

    const data = await response.json();
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found - Shagun Khare',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} - Shagun Khare`,
    description: article.excerpt || 'Read this article by Shagun Khare',
    openGraph: {
      title: article.title,
      description: article.excerpt || 'Read this article by Shagun Khare',
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    // Create date and format it properly
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/articles" className="hover:text-foreground">
            Articles
          </Link>
          <span>/</span>
          <span>{article.title}</span>
        </div>

        {article.featured && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              Featured
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-display font-light mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex flex-col gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>By: Shagun Khare</span>
            </div>
            <span>•</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </div>
          
          {article.externalUrl && (
            <div className="flex items-center gap-2">
              <Button asChild className="gap-2">
                <a 
                  href={article.externalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <HiExternalLink className="w-4 h-4" />
                  Read Original Article
                  {article.publisher && (
                    <span className="text-sm opacity-80">on {article.publisher}</span>
                  )}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="mb-8">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div 
          className="whitespace-pre-wrap leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-8 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <p>Published by Shagun Khare</p>
            <p>{formatDate(article.publishedAt)}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/articles">← Back to Articles</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 