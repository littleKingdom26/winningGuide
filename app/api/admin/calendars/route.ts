import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { GoogleCalendarConfig } from '@/constants/types';

// GET - 캘린더 목록 조회
export async function GET() {
  try {
    const calendars = await readData<GoogleCalendarConfig>('google-calendars.json');
    return NextResponse.json(calendars);
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 });
  }
}

// POST - 새 캘린더 등록
export async function POST(request: Request) {
  try {
    const { name, url } = await request.json();
    
    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const calendars = await readData<GoogleCalendarConfig>('google-calendars.json');
    
    // 중복 확인
    const existing = calendars.find(c => c.url === url);
    if (existing) {
      return NextResponse.json({ error: 'Calendar with this URL already exists' }, { status: 400 });
    }

    const now = new Date().toISOString().split('T')[0];
    const newCalendar: GoogleCalendarConfig = {
      id: `cal-${Date.now()}`,
      name,
      url,
      isActive: true,
      createdAt: now,
    };

    calendars.push(newCalendar);
    await writeData('google-calendars.json', calendars);

    return NextResponse.json(newCalendar);
  } catch (error) {
    console.error('Error creating calendar:', error);
    return NextResponse.json({ error: 'Failed to create calendar' }, { status: 500 });
  }
}