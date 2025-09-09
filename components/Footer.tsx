import Link from "next/link";

interface Profile {
  footerBio?: string;
  contactEmail?: string;
}

interface FooterProps {
  profile?: Profile;
}


const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Articles", href: "/articles" },
  { name: "Contact", href: "/contact" },
];

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold mb-3 text-[#FEFAE0]">Shagun Khare</h3>
              <div className="text-[#FEFAE0]/80 leading-relaxed prose prose-sm max-w-none [&>*]:text-inherit [&>p]:mb-2 [&>p:last-child]:mb-0">
                {profile?.footerBio ? (
                  <div dangerouslySetInnerHTML={{ __html: profile.footerBio }} />
                ) : (
                  <p>Writer, journalist, and lifestyle enthusiast based in Brooklyn.</p>
                )}
              </div>
            </div>
            
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-4 text-[#FEFAE0]">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[#FEFAE0]/80 hover:text-[#DDA15E] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold mb-4 text-[#FEFAE0]">Get in Touch</h4>
              <div className="space-y-4">
                {profile?.contactEmail && (
                  <div>
                    <Link 
                      href={`mailto:${profile.contactEmail}`}
                      className="text-[#FEFAE0]/80 hover:text-[#DDA15E] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                      </svg>
                      {profile.contactEmail}
                    </Link>
                  </div>
                )}
                
                {/* LinkedIn */}
                <div>
                  <Link 
                    href="https://www.linkedin.com/in/shagun-khare-/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FEFAE0]/80 hover:text-[#DDA15E] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    shagun-khare-
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#FEFAE0]/20 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#FEFAE0]/80">
              © {currentYear} Shagun Khare
            </p>
            <p className="text-sm text-[#FEFAE0]/80">
              Developed by{' '}
              <Link 
                href="https://www.linkedin.com/in/rajat-k-9799a6122/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#DDA15E] hover:text-[#FEFAE0] transition-colors underline"
              >
                Rajat Khare
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 