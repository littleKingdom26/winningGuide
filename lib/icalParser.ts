import ICAL from 'ical.js';
import { GameSchedule, GameStatus, HomeAway, GoogleCalendarConfig } from '@/constants/types';

interface ParsedEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}

export async function parseICalFromUrl(url: string): Promise<ParsedEvent[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.statusText}`);
    }

    const icalData = await response.text();
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    
    const events: ParsedEvent[] = [];

    vevents.forEach(vevent => {
      const event = new ICAL.Event(vevent);
      
      if (event.startDate) {
        events.push({
          title: event.summary || '제목 없음',
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate ? event.endDate.toJSDate() : new Date(),
          location: event.location,
          description: event.description,
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error parsing iCal:', error);
    throw error;
  }
}

export function convertToGameSchedule(
  event: ParsedEvent,
  calendarId: string,
  calendarName: string
): GameSchedule | null {
  try {
    // 제목에서 상대팀 추출 (예: "수원FC vs 강원FC" -> "강원FC")
    let opponent = '알 수 없음';
    let homeAway: HomeAway = 'home';
    
    const titleLower = event.title.toLowerCase();
    
    // 홈/어웨이 판별
    if (titleLower.includes('@')) {
      homeAway = 'away';
      // "@" 뒤의 팀 이름 추출
      const match = event.title.match(/@\s*(.+)/);
      if (match) {
        opponent = match[1].trim();
      }
    } else if (titleLower.includes('vs')) {
      const parts = event.title.split(/vs|VS/);
      if (parts.length >= 2) {
        // 첫 번째 부분이 수원FC면 홈, 아니면 홈으로 가정
        const firstPart = parts[0].trim();
        if (firstPart.includes('수원')) {
          opponent = parts[1].trim();
          homeAway = 'home';
        } else {
          opponent = firstPart;
          homeAway = 'away';
        }
      }
    } else {
      // vs 표시가 없으면 제목 그대로 사용
      opponent = event.title;
    }

    // 라운드 정보 추출 (예: "27R", "FA컵 16강")
    let round: string | undefined;
    const roundMatch = event.title.match(/\d+R|FA컵\s*\d+강|R선수권|K리그/);
    if (roundMatch) {
      round = roundMatch[0];
    }

    // 날짜 포맷팅
    const dateStr = event.startDate.toISOString().split('T')[0];
    const hours = event.startDate.getHours().toString().padStart(2, '0');
    const minutes = event.startDate.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    // 경기장
    const venue = event.location || '알 수 없음';

    const schedule: GameSchedule = {
      id: `game-${calendarId}-${event.startDate.getTime()}`,
      opponent,
      homeAway,
      date: dateStr,
      time: timeStr,
      venue,
      status: 'scheduled',
      // 캘린더 정보 저장
      calendarId,
      calendarName,
    };

    if (round) {
      schedule.round = round;
    }

    return schedule;
  } catch (error) {
    console.error('Error converting event to schedule:', error);
    return null;
  }
}

export async function syncCalendarsToSchedules(
  calendars: GoogleCalendarConfig[]
): Promise<GameSchedule[]> {
  const activeCalendars = calendars.filter(c => c.isActive);

  let allSchedules: GameSchedule[] = [];

  for (const calendar of activeCalendars) {
    try {
      const events = await parseICalFromUrl(calendar.url);
      const schedules = events
        .map(event => convertToGameSchedule(event, calendar.id, calendar.name))
        .filter((s): s is GameSchedule => s !== null);
      
      allSchedules = [...allSchedules, ...schedules];
    } catch (error) {
      console.error(`Error syncing calendar ${calendar.name}:`, error);
    }
  }

  // 중복 제거 (같은 날짜와 시간, 같은 상대팀)
  const uniqueSchedules = allSchedules.reduce((acc: GameSchedule[], current) => {
    const isDuplicate = acc.some(s => 
      s.date === current.date && 
      s.time === current.time && 
      s.opponent === current.opponent
    );
    
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);

  return uniqueSchedules.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
