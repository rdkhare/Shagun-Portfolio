"use client";

import { useState } from 'react';

export function CategoryAddForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug }),
      });
      if (!res.ok) throw new Error('Create failed');
      setTitle('');
      setSlug('');
      setMessage('Created');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setMessage(errMsg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onAdd} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <label className="text-sm">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-border/50 bg-background p-2" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Slug (optional)</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded border border-border/50 bg-background p-2" />
      </div>
      <button type="submit" disabled={saving} className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50">
        {saving ? 'Adding...' : 'Add Category'}
      </button>
      {message && <div className="text-sm text-foreground/70">{message}</div>}
    </form>
  );
} 