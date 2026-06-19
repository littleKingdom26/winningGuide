import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { GameSchedule, GoogleCalendarConfig } from '@/constants/types';
import { syncCalendarsToSchedules } from '@/lib/icalParser';

export async function POST(request: Request) {
  try {
    let body: { calendarIds?: string[] } = {};
    try {
      body = await request.json();
    } catch (e) {
      // 요청 본문이 없거나 JSON이 아닌 경우 빈 객체 사용
      body = {};
    }
    const { calendarIds } = body;

    // 모든 캘린더 가져오기
    const calendars: GoogleCalendarConfig[] = await readData('google-calendars.json');
    
    // 특정 캘린더만 동기화하거나, 모두 동기화
    const calendarsToSync = calendarIds 
      ? calendars.filter((c) => calendarIds.includes(c.id))
      : calendars.filter((c) => c.isActive);

    if (calendarsToSync.length === 0) {
      return NextResponse.json({ error: 'No active calendars to sync' }, { status: 400 });
    }

    // 서버 사이드에서 iCal 파싱 및 일정 생성
    const schedules = await syncCalendarsToSchedules(calendarsToSync);

    // 저장
    await writeData('game-schedules.json', schedules);

    return NextResponse.json({
      success: true,
      count: schedules.length,
      syncedCalendars: calendarsToSync.length,
    });
  } catch (error) {
    console.error('Error syncing calendars:', error);
    return NextResponse.json({ 
      error: 'Failed to sync calendars',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
