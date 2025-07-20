import { client } from "@/lib/sanity.client";
import { articleBySlugQuery } from "@/lib/groq";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { Article } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article: Article = await client.fetch(articleBySlugQuery, {
    slug,
  });

  if (!article) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  return {
    title: article.title,
    description: article.body
      .map((block) => block.children.map((child) => child.text).join(""))
      .join(" ")
      .substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.body
        .map((block) => block.children.map((child) => child.text).join(""))
        .join(" ")
        .substring(0, 160),
      images: [
        {
          url: article.coverImage,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article: Article = await client.fetch(articleBySlugQuery, {
    slug,
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
      <div className="mb-4 flex items-center text-gray-500">
        <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
        <span className="mx-2">•</span>
        <p>{article.category}</p>
      </div>
      {article.coverImage && (
        <div className="relative mb-8 h-96 w-full">
          <Image
            src={article.coverImage}
            alt={article.title}
            className="rounded-lg object-cover"
            fill
          />
        </div>
      )}
      <div className="prose max-w-none">
        <PortableTextRenderer body={article.body} />
      </div>
    </article>
  );
} 