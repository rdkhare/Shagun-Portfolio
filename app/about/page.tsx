import { Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-light mb-4">About</h1>
        <p className="text-lg text-foreground/70">
          Digital journalist and writer covering technology, society, and culture
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-lg overflow-hidden bg-muted">
              {/* Placeholder for profile image */}
              <div className="w-full h-full flex items-center justify-center text-foreground/40">
                <span className="text-6xl font-light">SK</span>
              </div>
            </div>
            <h2 className="text-2xl font-display font-light mb-2">Shagun Khare</h2>
            <p className="text-foreground/70 mb-6">Digital Journalist & Writer</p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="lg:col-span-2">
          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-medium mb-4">Biography</h3>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Shagun Khare is a digital journalist and writer specializing in the intersection 
              of technology, society, and culture. With a focus on investigative journalism 
              and thoughtful commentary, Shagun explores how technological developments shape 
              our connected world.
            </p>
            
            <p className="text-foreground/80 leading-relaxed mb-6">
              Based in the digital frontier, their work covers policy implications of emerging 
              technologies, digital culture trends, and the societal impact of technological 
              innovation. All articles reflect independent research and reporting.
            </p>

            <h3 className="text-xl font-medium mb-4">Focus Areas</h3>
            <ul className="space-y-2 text-foreground/80">
              <li>• Technology policy and regulation</li>
              <li>• Digital culture and society</li>
              <li>• Emerging technology impacts</li>
              <li>• Independent journalism</li>
              <li>• Cultural commentary</li>
            </ul>

            <h3 className="text-xl font-medium mb-4 mt-8">Contact</h3>
            <p className="text-foreground/80 leading-relaxed">
              For press inquiries, collaboration opportunities, or story tips, 
              please don&apos;t hesitate to reach out through the social media 
              links above or the contact page.
            </p>
          </div>
        </div>
      </div>

      {/* CMS Development Note */}
      <div className="mt-16 p-8 bg-muted/50 rounded-lg text-center">
        <h3 className="text-xl font-medium mb-4">Website Development</h3>
        <p className="text-foreground/70">
          This portfolio is currently implementing a custom content management system. 
          Full biography and portfolio content will be available once the new system is deployed.
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'About - Shagun Khare',
  description: 'Learn more about digital journalist and writer Shagun Khare.',
}; 