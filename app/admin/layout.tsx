"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { HiViewGrid, HiDocumentText, HiUser, HiChat, HiPhotograph } from 'react-icons/hi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: HiViewGrid,
      isActive: pathname === '/admin'
    },
    {
      href: '/admin/articles',
      label: 'Articles',
      icon: HiDocumentText,
      isActive: pathname.startsWith('/admin/articles')
    },
    {
      href: '/admin/publications',
      label: 'Publications',
      icon: HiPhotograph,
      isActive: pathname === '/admin/publications'
    },
    {
      href: '/admin/profile',
      label: 'Profile',
      icon: HiUser,
      isActive: pathname === '/admin/profile'
    },
    {
      href: '/admin/testimonials',
      label: 'Testimonials',
      icon: HiChat,
      isActive: pathname === '/admin/testimonials'
    }
  ]

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-light mb-6">Admin</h1>
        
        {/* Improved Navigation Tabs */}
        <nav className="border-b border-border">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    item.isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
} 