"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity.client";
import Image from "next/image";
import Link from "next/link";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative h-96 w-full">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Article image"}
          className="rounded-lg object-cover"
          fill
        />
      </div>
    ),
  },
  block: {
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-gray-300 py-2 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const { href } = value;
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className="text-blue-500 hover:underline">
          {children}
        </Link>
      );
    },
  },
};

import { PortableTextBlock } from '../lib/types';

export const PortableTextRenderer = ({ body }: { body: PortableTextBlock[] }) => {
  return <PortableText value={body} components={components} />;
}; 