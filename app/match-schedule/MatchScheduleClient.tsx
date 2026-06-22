'use client';

import { useState } from 'react';
import { GameSchedule, GameStatus, HomeAway } from '@/constants/types';
import Card from '@/components/common/Card';
import { Calendar, MapPin, Clock, ExternalLink, Home, Car } from 'lucide-react';
import Link from 'next/link';
import CalendarFilter from '@/components/match-schedule/CalendarFilter';

export default function MatchScheduleClient({ 
  schedules, 
  calendars 
}: { 
  schedules: GameSchedule[]; 
  calendars: Array<{ id: string; name: string }>;
}) {
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  // 필터링된 경기
  const filteredSchedules = selectedCalendar
    ? schedules.filter(s => s.calendarId === selectedCalendar)
    : schedules;

  // 캘린더별 카드 전체 테마 스타일 반환
  const getCardThemeClass = (scheduleCalendarId?: string) => {
    // 캘린더 필터와 동일한 rounded-button 사용 (12px)
    const rounded = 'rounded-button';
    
    // 전체 선택이거나 특정 캘린더 선택 시 해당 캘린더 색상 사용
    const targetCalendarId = selectedCalendar || scheduleCalendarId;
    
    if (!targetCalendarId) {
      return {
        border: 'border-suwon-red/30',
        shadow: 'shadow-lg shadow-suwon-red/20',
        bg: 'bg-suwon-red/5',
        hoverBg: 'hover:bg-suwon-red/15',
        activeBg: 'active:bg-suwon-red/25',
        rounded
      };
    }
    
    const index = calendars.findIndex(c => c.id === targetCalendarId);
    if (index === 0) {
      return {
        border: 'border-suwon-red',
        shadow: 'shadow-lg shadow-suwon-red/40',
        bg: 'bg-suwon-red/10',
        hoverBg: 'hover:bg-suwon-red/20',
        activeBg: 'active:bg-suwon-red/30',
        rounded
      };
    } else if (index === 1) {
      return {
        border: 'border-suwon-blue',
        shadow: 'shadow-lg shadow-suwon-blue/40',
        bg: 'bg-suwon-blue/10',
        hoverBg: 'hover:bg-suwon-blue/20',
        activeBg: 'active:bg-suwon-blue/30',
        rounded
      };
    } else {
      return {
        border: 'border-suwon-red',
        shadow: 'shadow-lg shadow-suwon-red/40',
        bg: 'bg-suwon-red/10',
        hoverBg: 'hover:bg-suwon-red/20',
        activeBg: 'active:bg-suwon-red/30',
        rounded
      };
    }
  };

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
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-suwon-blue" />
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    }
  };

  // 상대팀명 추출 (라운드/대회명 제거)
  const extractOpponentName = (opponent: string, venue: string): string => {
    // 라운드 패턴 제거 (13R, 1R, 2R 등)
    let cleaned = opponent.replace(/^\d+R\s*/, '');
    // 대회명 패턴 제거 (코라이컵, w 코리아컵, FA컵 등)
    cleaned = cleaned.replace(/^(?:w\s*)?(?:코라이컵|FA컵|한국은행컵)\s*/i, '');
    
    // vs 구분자 처리
    if (cleaned.includes(' vs ')) {
      const [team1, team2] = cleaned.split(' vs ').map(t => t.trim());
      
      // venue 기준 홈/어웨이 판단
      const isHome = venue.includes('수원종합운동장');
      
      if (isHome) {
        // 홈경기: "수원FC vs 상대팀" → 상대팀 선택
        if (team1.includes('수원FC')) {
          return team2;
        } else if (team2.includes('수원FC')) {
          return team1;
        }
      } else {
        // 원정경기: "상대팀 vs 수원FC" → 상대팀 선택
        if (team1.includes('수원FC')) {
          return team2;
        } else if (team2.includes('수원FC')) {
          return team1;
        }
      }
    }
    
    // vs가 없는 경우 (이전 로직 호환)
    return cleaned.trim();
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

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

  // POI 추출 함수 (장소 이름만)
  const extractPoi = (venue: string): string => {
    return venue.split(',')[0].trim();
  };

  // 네이버 지도 연동 함수
  const getNaverMapUrl = (venue: string) => {
    const poi = extractPoi(venue);
    const encodedVenue = encodeURIComponent(poi);
    return `https://map.naver.com/v5/search/${encodedVenue}`;
  };

  return (
    <>
      {schedules.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="mx-auto w-16 h-16 text-suwon-yellow mb-4" />
          <h2 className="text-h3 text-suwon-textPrimary mb-2">등록된 경기 일정이 없습니다</h2>
          <p className="text-body2 text-suwon-textSecondary">
            관리자를 통해 경기 일정이 등록되면 표시됩니다.
          </p>
        </Card>
      ) : (
        <>
          <CalendarFilter 
            calendars={calendars} 
            selectedCalendar={selectedCalendar} 
            onSelect={setSelectedCalendar} 
          />
          
          {filteredSchedules.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="mx-auto w-16 h-16 text-suwon-yellow mb-4" />
              <h2 className="text-h3 text-suwon-textPrimary mb-2">해당 캘린더의 경기 일정이 없습니다</h2>
              <p className="text-body2 text-suwon-textSecondary">
                다른 캘린더를 선택해 보세요.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSchedules.map((schedule) => {
                const theme = getCardThemeClass(schedule.calendarId);
                return (
                  <Card 
                    key={schedule.id} 
                    className={`p-5 border-2 transition-all duration-300 ${theme.border} ${theme.shadow} ${theme.bg} ${theme.hoverBg} ${theme.activeBg} ${theme.rounded}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {getHomeAwayDisplay(schedule.homeAway, extractOpponentName(schedule.opponent, schedule.venue))}
                          {schedule.calendarName && (
                            <span className="text-caption text-suwon-textSecondary">· {schedule.calendarName}</span>
                          )}
                        </div>
                      </div>
                      {getStatusDisplay(schedule.status, schedule.homeScore, schedule.awayScore)}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(schedule.date)} {schedule.time}</span>
                      </div>
                      <Link 
                        href={getNaverMapUrl(schedule.venue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-body2 text-suwon-blue hover:text-suwon-red transition-colors cursor-pointer w-fit"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{extractPoi(schedule.venue)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
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
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}