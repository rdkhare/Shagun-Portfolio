import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'Auth not configured. Please set up NextAuth in lib/auth/config.ts' },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'Auth not configured. Please set up NextAuth in lib/auth/config.ts' },
    { status: 501 }
  );
} 