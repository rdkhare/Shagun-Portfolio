import Link from 'next/link';
import { cmsMock } from '@/lib/cms/mockData';

export default async function AdminArticlesPage() {
  const articles = cmsMock.listArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Articles</h2>
        <Link href="/admin/articles/new" className="text-primary">New Article</Link>
      </div>
      <div className="divide-y divide-border/50 rounded border border-border/50">
        {articles.length === 0 && (
          <div className="p-4 text-sm text-foreground/70">No articles yet.</div>
        )}
        {articles.map((a) => (
          <div key={a.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-foreground/60">/{a.slug}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="uppercase tracking-wide text-foreground/70">{a.status}</span>
              <Link href={`/admin/articles/${a.id}`} className="text-primary">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 