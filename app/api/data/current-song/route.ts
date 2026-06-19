import { NextResponse } from 'next/server';
import { readSingleData } from '@/lib/dataManager';

export async function GET() {
  try {
    const data = await readSingleData<{ songId: string | null }>('current-song.json');
    return NextResponse.json({ songId: data?.songId || null });
  } catch (error) {
    console.error('Error reading current song:', error);
    return NextResponse.json({ songId: null }, { status: 500 });
  }
}