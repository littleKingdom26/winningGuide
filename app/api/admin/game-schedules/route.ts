import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { GameSchedule } from '@/constants/types';

export async function POST(request: Request) {
  try {
    const scheduleData = await request.json();
    
    const schedules = await readData<GameSchedule>('game-schedules.json');
    schedules.push(scheduleData);
    
    await writeData('game-schedules.json', schedules);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const scheduleData = await request.json();
    
    let schedules = await readData<GameSchedule>('game-schedules.json');
    schedules = schedules.map(s => s.id === scheduleData.id ? scheduleData : s);
    
    await writeData('game-schedules.json', schedules);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}