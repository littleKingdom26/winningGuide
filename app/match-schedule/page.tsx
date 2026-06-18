import { readData } from '@/lib/dataManager';
import { GameSchedule, GameStatus, HomeAway } from '@/constants/types';
import Card from '@/components/common/Card';
import { Calendar, MapPin, Clock, ExternalLink, Home, Car } from 'lucide-react';
import Link from 'next/link';

export default async function MatchSchedulePage() {
  const schedules = await readData<GameSchedule>('game-schedules.json');
  
  // date 기준 정렬
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 경기 상태별 표시
  const getStatusDisplay = (status: GameStatus, homeScore?: number, awayScore?: number) => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-suwon-red rounded-full animate-pulse" />
            <span className="text-caption text-suwon-red font-bold">LIVE</span>
            <span className="text-h2 text-suwon-textPrimary font-bold">
              {homeScore} : {awayScore}
            </span>
          </div>
        );
      case 'finished':
        return (
          <span className="text-h2 text-suwon-textPrimary font-bold">
            {homeScore} : {awayScore}
          </span>
        );
      case 'postponed':
        return (
          <span className="text-caption text-suwon-yellow font-bold">연기</span>
        );
      default:
        return (
          <span className="text-caption text-suwon-blue">예정</span>
        );
    }
  };

  // 홈/어웨이 표시
  const getHomeAwayDisplay = (homeAway: HomeAway, opponent: string) => {
    if (homeAway === 'home') {
      return (
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-suwon-red" />
          <span className="text-body2 text-suwon-textPrimary">vs</span>
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-suwon-blue" />
          <span className="text-body2 text-suwon-textPrimary">@</span>
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  // 현재 시간과 비교하여 다가오는 경기 필터링
  const now = new Date();
  const upcomingMatch = sortedSchedules.find(s => new Date(s.date) >= now);
  const pastMatches = sortedSchedules.filter(s => new Date(s.date) < now);

  // 구글 캘린더 연동 함수
  const getGoogleCalendarUrl = (schedule: GameSchedule) => {
    const startDate = schedule.date.replace(/-/g, '') + 'T' + schedule.time.replace(/:/g, '') + '00';
    const duration = 2; // 2시간
    const endDate = new Date(new Date(schedule.date).getTime() + duration * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, '')
      .split('.')[0] + '00';
    
    const title = encodeURIComponent(`수원FC vs ${schedule.opponent}`);
    const location = encodeURIComponent(schedule.venue);
    const dates = encodeURIComponent(`${startDate}/${endDate}`);
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&location=${location}`;
  };

  // 캘린더별 그룹화
  const groupedByCalendar = sortedSchedules.reduce((acc: Record<string, GameSchedule[]>, schedule) => {
    const calendarName = schedule.calendarName || '기타';
    if (!acc[calendarName]) {
      acc[calendarName] = [];
    }
    acc[calendarName].push(schedule);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-h1 text-suwon-textPrimary font-bold mb-2">경기 일정</h1>
        <p className="text-body2 text-suwon-textSecondary">수원FC 다가오는 경기 일정</p>
      </div>

      {/* 데이터가 없는 경우 */}
      {sortedSchedules.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="mx-auto w-16 h-16 text-suwon-yellow mb-4" />
          <h2 className="text-h3 text-suwon-textPrimary mb-2">등록된 경기 일정이 없습니다</h2>
          <p className="text-body2 text-suwon-textSecondary">
            관리자를 통해 경기 일정이 등록되면 표시됩니다.
          </p>
        </Card>
      )}

      {/* 캘린더별 일정 */}
      {Object.entries(groupedByCalendar).map(([calendarName, calendarSchedules]) => {
        // 미래 경기만 필터링하고 날짜순 정렬
        const futureSchedules = calendarSchedules
          .filter(s => new Date(s.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (futureSchedules.length === 0) return null;

        return (
          <div key={calendarName} className="space-y-4">
            {/* 캘린더 헤더 */}
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-suwon-blue" />
              <h2 className="text-h2 text-suwon-textPrimary font-bold">{calendarName}</h2>
            </div>

            {/* 미래 경기들 */}
            <div className="space-y-3">
              {futureSchedules.map((schedule) => (
                <Card key={schedule.id} className="p-5 border-2 border-suwon-red/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {schedule.round && (
                        <span className="inline-block px-2 py-1 bg-suwon-red/20 text-suwon-red text-caption rounded-button mb-2">
                          {schedule.round}
                        </span>
                      )}
                      <div className="mb-3">
                        {getHomeAwayDisplay(schedule.homeAway, schedule.opponent)}
                      </div>
                    </div>
                    {getStatusDisplay(schedule.status, schedule.homeScore, schedule.awayScore)}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(schedule.date)} {schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule.venue}</span>
                    </div>
                    {schedule.weather && (
                      <div className="text-caption text-suwon-textSecondary">
                        날씨: {schedule.weather}
                      </div>
                    )}
                  </div>

                  <Link 
                    href={getGoogleCalendarUrl(schedule)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-suwon-blue/20 text-suwon-blue rounded-button cursor-pointer hover:bg-suwon-blue/30 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span className="text-body2 font-bold">캘린더에 추가</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
