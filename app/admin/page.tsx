"use client"

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, FileText, Tag } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-light">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage your articles and posts</p>
            <Link 
              href="/admin/articles"
              className="inline-flex items-center text-primary hover:underline"
            >
              Manage Articles →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Organize your content with categories</p>
            <Link 
              href="/admin/categories"
              className="inline-flex items-center text-primary hover:underline"
            >
              Manage Categories →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Update your author profile</p>
            <Link 
              href="/admin/profile"
              className="inline-flex items-center text-primary hover:underline"
            >
              Edit Profile →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Session Info (for debugging) */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 