"use client";

import { useState } from 'react';

export function EditForm({ id, initialTitle, initialStatus }: { id: string; initialTitle: string; initialStatus: 'draft' | 'published' }) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status }),
      });
      if (!res.ok) throw new Error('Save failed');
      setMessage('Saved');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      setMessage(errMsg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <label className="text-sm">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-border/50 bg-background p-2" />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Status</label>
        <select value={status} onChange={(e) => setStatus((e.target as HTMLSelectElement).value as 'draft' | 'published')} className="w-full rounded border border-border/50 bg-background p-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <button type="submit" disabled={saving} className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
      {message && <div className="text-sm text-foreground/70">{message}</div>}
    </form>
  );
} 