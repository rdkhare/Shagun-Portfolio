import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Article: ${slug} - Shagun Khare`,
    description: "Article content will be available soon.",
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 max-w-3xl py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Article Not Available</h1>
        <p className="text-lg text-foreground/70 mb-8">
          The content management system is currently being rebuilt. 
          Articles will be available once the new system is deployed.
        </p>
        
        <div className="bg-muted/50 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-medium mb-4">Requested Article</h2>
          <p className="text-foreground/80 mb-4">
            <strong>Slug:</strong> {slug}
          </p>
          <p className="text-sm text-foreground/60">
            This article will be available once the custom CMS is implemented.
          </p>
        </div>

        <div className="space-x-4">
          <Button asChild>
            <Link href="/articles">View All Articles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 