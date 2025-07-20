import {groq} from 'next-sanity'

export const allArticles = groq`
*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current},
  "mainImage": mainImage.asset->url,
  publishedAt,
  "categories": categories[]->{_id, title, description},
  body
}
`

export const articleBySlug = groq`
*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current},
  "mainImage": mainImage.asset->url,
  publishedAt,
  "categories": categories[]->{_id, title, description},
  body
}
`

export const featuredArticles = groq`
*[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current},
  "mainImage": mainImage.asset->url,
  publishedAt,
  "categories": categories[]->{_id, title, description},
  body
}
`

export const latestArticles = groq`
*[_type == "article" && featured != true] | order(publishedAt desc)[0...12] {
  _id,
  title,
  "slug": slug.current,
  "author": author->{name, "slug": slug.current},
  "mainImage": mainImage.asset->url,
  publishedAt,
  "categories": categories[]->{_id, title, description},
  body
}
`

export const categories = groq`
*[_type == "category"] {
  _id,
  title,
  description
}
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    title,
    "coverImage": coverImage.asset->url,
    publishedAt,
    "category": category->title,
    body,
  }
`;

export const authorQuery = groq`
  *[_type == "author"][0] {
    _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    bio,
    socials
  }
`;