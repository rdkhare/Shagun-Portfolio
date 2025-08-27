import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Upload not configured. Please implement lib/storage/upload.ts' },
    { status: 501 }
  );
} 