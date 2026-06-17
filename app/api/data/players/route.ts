import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataManager';

export async function GET() {
  try {
    const players = await readData('players.json');
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error reading players data:', error);
    return NextResponse.json([], { status: 500 });
  }
}
