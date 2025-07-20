import { client } from '@/lib/sanity.client';
import { authorQuery } from '@/lib/groq';
import { Author } from '@/lib/types';
import { PortableTextRenderer } from '@/components/PortableTextRenderer';
import { urlFor } from '@/lib/sanity.client';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

async function getAuthor(): Promise<Author> {
  const author = await client.fetch(authorQuery);
  return author;
}

export default async function AboutPage() {
  const author = await getAuthor();

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="border-b border-border pb-4 mb-8">
          <h1 className="font-display text-4xl font-light">About</h1>
        </div>
        <p className="text-muted-foreground serif">Author information not available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header Section */}
      <div className="border-b border-border pb-8 mb-12">
        <h1 className="font-display text-5xl md:text-6xl font-light tracking-tight mb-4">
          About {author.name}
        </h1>
        <div className="byline">
          Digital Journalist & Writer
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography */}
          {author.bio && (
            <section>
              <div className="prose prose-lg max-w-none serif editorial-spacing">
                <PortableTextRenderer body={author.bio} />
              </div>
            </section>
          )}

          {/* Editorial Note */}
          <section className="border-t border-border pt-8">
            <h3 className="font-display text-2xl font-light mb-4">Editorial Approach</h3>
            <div className="text-muted-foreground serif editorial-spacing">
              <p>
                Committed to independent journalism with a focus on accuracy, 
                ethical reporting, and providing context to complex stories. 
                All work reflects personal research and analysis, with sources 
                verified and facts checked.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Author Image */}
          {author.image && (
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto">
                <Image
                  src={urlFor(author.image).url()}
                  alt={author.name || 'Author'}
                  className="object-cover border border-border"
                  fill
                  priority
                />
              </div>
            </div>
          )}

          {/* Contact Card */}
          <div className="bg-muted/30 border border-border p-6">
            <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Professional Contact
            </h3>
            
            {/* Social Media Links */}
            {author.socials && (
              <div className="space-y-3">
                {author.socials.email && (
                  <Link
                    href={`mailto:${author.socials.email}`}
                    className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Link>
                )}
                
                {author.socials.twitter && (
                  <Link
                    href={author.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </Link>
                )}
                
                {author.socials.linkedin && (
                  <Link
                    href={author.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Link>
                )}
                
                {author.socials.github && (
                  <Link
                    href={author.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </Link>
                )}
              </div>
            )}
            
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted-foreground">
                For press inquiries, story tips, or collaboration opportunities
              </p>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              Focus Areas
            </h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div>Technology & Society</div>
              <div>Digital Culture</div>
              <div>Media & Communications</div>
              <div>Investigative Reporting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'About - Shagun Khare',
  description: 'Learn more about digital journalist and writer Shagun Khare.',
}; 