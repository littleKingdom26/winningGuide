import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataManager';

export async function GET() {
  try {
    const songs = await readData('songs.json');
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error reading songs data:', error);
    return NextResponse.json([], { status: 500 });
  }
}
