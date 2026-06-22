'use client';

import { useState, useEffect } from 'react';
import { GameSchedule, GameStatus, HomeAway } from '@/constants/types';
import Card from '@/components/common/Card';
import { Clock, MapPin, Home as HomeIcon, Car } from 'lucide-react';
import Link from 'next/link';
import CalendarFilter from '@/components/match-schedule/CalendarFilter';

interface UpcomingMatchProps {
  schedules: GameSchedule[];
  calendars: Array<{ id: string; name: string }>;
}

export default function UpcomingMatch({ schedules, calendars }: UpcomingMatchProps) {
  // 첫 번째 캘린더를 기본값으로 설정
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(
    calendars.length > 0 ? calendars[0].id : null
  );

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

  // 다가오는 경기 찾기
  const upcomingMatch = filteredSchedules
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find(s => new Date(s.date) >= new Date());

  // 경기 상태 표시 함수
  const getStatusDisplay = (status: GameStatus, homeScore?: number, awayScore?: number) => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-suwon-red rounded-full animate-pulse" />
            <span className="text-caption text-suwon-red font-bold">LIVE</span>
            <span className="text-h3 text-suwon-textPrimary font-bold">
              {homeScore} : {awayScore}
            </span>
          </div>
        );
      case 'finished':
        return (
          <span className="text-h3 text-suwon-textPrimary font-bold">
            {homeScore} : {awayScore}
          </span>
        );
      default:
        return (
          <span className="text-caption text-suwon-blue">예정</span>
        );
    }
  };

  // 홈/어웨이 표시 함수
  const getHomeAwayDisplay = (homeAway: HomeAway, opponent: string) => {
    if (homeAway === 'home') {
      return (
        <div className="flex items-center gap-2">
          <HomeIcon className="w-4 h-4 text-suwon-red" />
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-suwon-blue" />
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

  // POI 추출 함수 (장소 이름만)
  const extractPoi = (venue: string): string => {
    return venue.split(',')[0].trim();
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  if (!upcomingMatch) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 캘린더 필터 (다가오는 경기 카드 위로 이동) */}
      {calendars.length > 0 && (
        <CalendarFilter 
          calendars={calendars} 
          selectedCalendar={selectedCalendar} 
          onSelect={setSelectedCalendar}
          showAllButton={false}
        />
      )}

      {(() => {
        const theme = getCardThemeClass(upcomingMatch.calendarId);
        return (
          <Link href="/match-schedule" className="block">
            <Card className={`p-4 border-2 transition-all duration-300 cursor-pointer ${theme.border} ${theme.shadow} ${theme.bg} ${theme.hoverBg} ${theme.activeBg} ${theme.rounded}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-suwon-red rounded-full animate-pulse" />
                <h2 className="text-h2 text-suwon-textPrimary font-bold">다가오는 경기</h2>
              </div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="mb-1">
                {getHomeAwayDisplay(upcomingMatch.homeAway, extractOpponentName(upcomingMatch.opponent, upcomingMatch.venue))}
              </div>
              {upcomingMatch.calendarName && (
                <span className="text-caption text-suwon-textSecondary">· {upcomingMatch.calendarName}</span>
              )}
            </div>
            {getStatusDisplay(upcomingMatch.status, upcomingMatch.homeScore, upcomingMatch.awayScore)}
          </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(upcomingMatch.date)} {upcomingMatch.time}</span>
                </div>
                <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                  <MapPin className="w-4 h-4" />
                  <span>{extractPoi(upcomingMatch.venue)}</span>
                </div>
              </div>
            </Card>
          </Link>
        );
      })()}
    </div>
  );
}
