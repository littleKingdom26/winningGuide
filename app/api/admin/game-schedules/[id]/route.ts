import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { GameSchedule } from '@/constants/types';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    let schedules = await readData<GameSchedule>('game-schedules.json');
    schedules = schedules.filter(s => s.id !== id);
    
    await writeData('game-schedules.json', schedules);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}