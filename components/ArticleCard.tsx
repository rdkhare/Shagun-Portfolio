import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface ArticleCardProps {
  title: string
  slug: string
  coverImage?: string | null
  publishedAt: string
  category?: string
  externalUrl?: string
  publisher?: string
  excerpt?: string
  featured?: boolean
}

export function ArticleCard({ 
  title, 
  slug, 
  coverImage, 
  publishedAt, 
  category, 
  externalUrl,
  publisher,
  excerpt,
  featured 
}: ArticleCardProps) {
  const href = externalUrl || `/articles/${slug}`
  const isExternal = !!externalUrl
  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const CardWrapper = () => (
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        {coverImage && (
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              <Image
                src={coverImage}
                alt={`Cover image for ${title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>
          </CardHeader>
        )}
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {featured && (
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  Featured
                </span>
              )}
              {category && (
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {category}
                </span>
              )}
            </div>
            
            <CardTitle className="font-display text-xl md:text-2xl font-light leading-tight group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            
            {publisher && (
              <p className="text-sm font-medium text-muted-foreground">
                Published in {publisher}
              </p>
            )}
            
            {excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <time className="text-xs text-muted-foreground font-medium tracking-wide">
                {publishedDate}
              </time>
              {isExternal && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  <span>External</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
      <CardWrapper />
    </a>
  ) : (
    <Link href={href} className="block group">
      <CardWrapper />
    </Link>
  )
} 