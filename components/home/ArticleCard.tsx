import Link from 'next/link'
import Image from 'next/image'
import { HiExternalLink } from 'react-icons/hi'

interface ArticleCardProps {
  title: string
  excerpt: string
  publishedAt: string
  slug: string
  coverImage?: string
  featured?: boolean
  externalUrl?: string
  publisher?: string
  category?: string
}

export default function ArticleCard({ 
  title, 
  excerpt, 
  publishedAt, 
  slug, 
  coverImage,
  featured = false,
  externalUrl,
  publisher,
  category
}: ArticleCardProps) {
  // If there's an external URL, link to it, otherwise link to internal page
  const href = externalUrl || `/articles/${slug}`
  const isExternal = !!externalUrl

  const CardContent = () => (
      <article className="space-y-4 h-full">
        {/* Cover Image Placeholder */}
        <div className="aspect-[16/10] bg-muted rounded-lg overflow-hidden">
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt={title}
              width={400}
              height={250}
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
          <div className="flex items-center gap-2 flex-wrap">
            {featured && (
              <span className="inline-block text-xs font-medium text-primary uppercase tracking-wider">
                Featured
              </span>
            )}
            {category && (
              <span className="inline-block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {publisher && (
            <p className="text-sm font-medium text-muted-foreground">
              Published in {publisher}
            </p>
          )}
          
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
            <span className="group-hover:text-primary transition-colors flex items-center gap-1">
              {isExternal ? (
                <>
                  Read on {publisher} <HiExternalLink className="w-3 h-3" />
                </>
              ) : (
                'Read more →'
              )}
            </span>
          </div>
        </div>
      </article>
  )

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      <CardContent />
    </a>
  ) : (
    <Link href={href} className="group block">
      <CardContent />
    </Link>
  )
}
