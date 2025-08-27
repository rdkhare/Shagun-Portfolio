'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminNewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug }),
      });
      if (!res.ok) throw new Error('Failed to create article');
      router.push('/admin/articles');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Create Article</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
        <div className="space-y-2">
          <label className="text-sm">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-border/50 bg-background p-2" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Slug (optional)</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded border border-border/50 bg-background p-2" />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button type="submit" disabled={submitting} className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50">
          {submitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
} 