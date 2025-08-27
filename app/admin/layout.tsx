import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-display font-light">Admin</h1>
        <nav className="text-sm space-x-4">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/articles">Articles</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/profile">Profile</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
} 