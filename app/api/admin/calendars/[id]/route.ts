import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { GoogleCalendarConfig } from '@/constants/types';

// PUT - 캘린더 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, url, isActive } = await request.json();
    
    const calendars = await readData<GoogleCalendarConfig>('google-calendars.json');
    const index = calendars.findIndex(c => c.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Calendar not found' }, { status: 404 });
    }

    calendars[index] = {
      ...calendars[index],
      ...(name !== undefined && { name }),
      ...(url !== undefined && { url }),
      ...(isActive !== undefined && { isActive }),
    };

    await writeData('google-calendars.json', calendars);
    return NextResponse.json(calendars[index]);
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json({ error: 'Failed to update calendar' }, { status: 500 });
  }
}

// DELETE - 캘린더 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    let calendars = await readData<GoogleCalendarConfig>('google-calendars.json');
    calendars = calendars.filter(c => c.id !== id);
    
    await writeData('google-calendars.json', calendars);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting calendar:', error);
    return NextResponse.json({ error: 'Failed to delete calendar' }, { status: 500 });
  }
}