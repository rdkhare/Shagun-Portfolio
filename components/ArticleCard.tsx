import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ArticleCardProps {
  title: string
  slug: string
  coverImage?: string | null
  publishedAt: string
  category: string
}

export function ArticleCard({ title, slug, coverImage, publishedAt, category }: ArticleCardProps) {
  const articleUrl = `/articles/${slug}`
  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={articleUrl} className="block group">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
        {coverImage && (
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              <Image
                src={coverImage}
                alt={`Cover image for ${title}`}
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
            </div>
          </CardHeader>
        )}
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="byline text-xs">
              {category}
            </div>
            <CardTitle className="font-display text-xl md:text-2xl font-light leading-tight group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <div className="article-meta border-t-0 pt-0 mt-4">
              <time className="text-xs text-muted-foreground font-medium tracking-wide">
                {publishedDate}
              </time>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 