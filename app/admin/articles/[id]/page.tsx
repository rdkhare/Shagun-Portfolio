import { cmsMock } from '@/lib/cms/mockData';
import { EditForm } from '../_components/EditForm';

// Using same param typing as other dynamic routes
type Props = { params: Promise<{ id: string }> };

export default async function AdminEditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = cmsMock.getArticleById(id);

  if (!article) {
    return <div className="text-foreground/70">Article not found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Article</h2>
      <EditForm id={article.id} initialTitle={article.title} initialStatus={article.status} />
    </div>
  );
} 