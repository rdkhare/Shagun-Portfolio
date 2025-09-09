"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/articles" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border navbar-custom backdrop-blur supports-[backdrop-filter]:bg-[#606C38]/95">
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-xl font-light tracking-tight text-[#FEFAE0]">
              Shagun Khare
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-bold transition-colors hover:text-[#DDA15E] relative",
                isActive(item.href)
                  ? "text-[#DDA15E] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#DDA15E]"
                  : "text-[#FEFAE0] hover:text-[#DDA15E]"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center space-x-3">
          {session ? (
            <>
              <Button asChild size="sm" className="bg-[#FEFAE0] text-[#283618] hover:bg-[#DDA15E] border-[#FEFAE0]">
                <Link href="/admin">Dashboard</Link>
              </Button>
              <Button 
                onClick={() => signOut()} 
                size="sm" 
                className="text-[#FEFAE0] hover:text-[#DDA15E] hover:bg-transparent"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="bg-[#FEFAE0] text-[#283618] hover:bg-[#DDA15E] border-[#FEFAE0]">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#FEFAE0] hover:text-[#DDA15E] hover:bg-transparent"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </nav>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-[#606C38]">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors py-2",
                    isActive(item.href)
                      ? "text-[#DDA15E]"
                      : "text-[#FEFAE0] hover:text-[#DDA15E]"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {session ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium transition-colors py-2 text-[#FEFAE0] hover:text-[#DDA15E]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-sm font-medium transition-colors py-2 text-left text-[#FEFAE0] hover:text-[#DDA15E]"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium transition-colors py-2 text-[#FEFAE0] hover:text-[#DDA15E]"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 