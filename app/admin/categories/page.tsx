import { cmsMock } from '@/lib/cms/mockData';
import { CategoryAddForm } from './_components/CategoryAddForm';

export default async function AdminCategoriesPage() {
  const categories = cmsMock.listCategories();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Categories</h2>
      <div className="divide-y divide-border/50 rounded border border-border/50">
        {categories.length === 0 && (
          <div className="p-4 text-sm text-foreground/70">No categories yet.</div>
        )}
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-foreground/60">/{c.slug}</div>
            </div>
          </div>
        ))}
      </div>
      <CategoryAddForm />
    </div>
  );
} 