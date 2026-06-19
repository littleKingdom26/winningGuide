import { readData } from '@/lib/dataManager';
import { GameSchedule } from '@/constants/types';
import MatchScheduleClient from './MatchScheduleClient';

export default async function MatchSchedulePage() {
  const schedules = await readData<GameSchedule>('game-schedules.json');
  
  // 캘린더 추출
  const calendars = Array.from(
    new Map(
      schedules
        .filter(s => s.calendarId && s.calendarName)
        .map(s => [s.calendarId!, { id: s.calendarId!, name: s.calendarName! }])
    ).values()
  );

  // date 기준 정렬
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 현재 시간과 비교하여 다가오는 경기 필터링
  const now = new Date();
  const futureSchedules = sortedSchedules
    .filter(s => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-h1 text-suwon-textPrimary font-bold mb-2">경기 일정</h1>
        <p className="text-body2 text-suwon-textSecondary">수원FC 다가오는 경기 일정</p>
      </div>

      {/* 미래 경기들 */}
      <MatchScheduleClient schedules={futureSchedules} calendars={calendars} />
    </div>
  );
}