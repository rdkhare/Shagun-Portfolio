import Link from 'next/link'

interface ArticleCardProps {
  title: string
  excerpt: string
  publishedAt: string
  slug: string
  coverImage?: string
  featured?: boolean
}

export default function ArticleCard({ 
  title, 
  excerpt, 
  publishedAt, 
  slug, 
  coverImage,
  featured = false 
}: ArticleCardProps) {
  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article className="space-y-4 h-full">
        {/* Cover Image Placeholder */}
        <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
              <div className="text-center text-muted-foreground">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Article Image</p>
              </div>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="space-y-2">
          {featured && (
            <span className="inline-block text-xs font-medium text-primary uppercase tracking-wider">
              Featured
            </span>
          )}
          
          <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <span className="group-hover:text-primary transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
