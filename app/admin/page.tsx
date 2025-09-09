"use client"

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HiLogout, HiUser, HiDocumentText, HiPlus } from 'react-icons/hi'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-light">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content and profile
          </p>
        </div>
        <Button onClick={handleSignOut} variant="outline" className="flex items-center">
          <HiLogout className="w-4 h-4" />
          <span className="leading-none">Sign Out</span>
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiPlus className="w-5 h-5 text-primary" />
              New Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Create a new article or post</p>
            <Link 
              href="/admin/articles/new"
              className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Article
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiDocumentText className="w-5 h-5" />
              Manage Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View and edit existing articles</p>
            <Link 
              href="/admin/articles"
              className="inline-flex items-center justify-center w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              View Articles
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HiUser className="w-5 h-5" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Update your bio and profile information</p>
            <Link 
              href="/admin/profile"
              className="inline-flex items-center justify-center w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 