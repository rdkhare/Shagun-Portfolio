import { NextResponse } from 'next/server';
import { cmsMock } from '@/lib/cms/mockData';

export async function GET(_request: Request, context: unknown) {
  const { id } = (context as { params: { id: string } }).params;
  const article = cmsMock.getArticleById(id);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: article });
}

export async function PUT(request: Request, context: unknown) {
  const { id } = (context as { params: { id: string } }).params;
  try {
    const body = await request.json();
    const updated = cmsMock.updateArticle(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
} 