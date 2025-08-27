import { NextResponse } from 'next/server';
import { cmsMock } from '@/lib/cms/mockData';

export async function GET() {
  const data = cmsMock.listArticles();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    const created = cmsMock.createArticle({
      title: body.title,
      slug: body.slug,
      status: body.status,
      featured: Boolean(body.featured),
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
} 