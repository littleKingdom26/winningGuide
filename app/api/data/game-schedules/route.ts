import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataManager';
import { GameSchedule } from '@/constants/types';

export async function GET() {
  try {
    const schedules = await readData<GameSchedule>('game-schedules.json');
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error reading game schedules data:', error);
    return NextResponse.json([], { status: 500 });
  }
}