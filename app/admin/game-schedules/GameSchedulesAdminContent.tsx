'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, Calendar as CalendarIcon, ExternalLink, Clock, MapPin, Home, Car } from 'lucide-react';
import Link from 'next/link';
import { GameSchedule, GoogleCalendarConfig, GameStatus, HomeAway } from '@/constants/types';
import Button from '@/components/common/Button';

interface GameSchedulesAdminContentProps {
  initialSchedules: GameSchedule[];
  initialCalendars: GoogleCalendarConfig[];
}

export default function GameSchedulesAdminContent({
  initialSchedules,
  initialCalendars,
}: GameSchedulesAdminContentProps) {
  const [schedules, setSchedules] = useState<GameSchedule[]>(initialSchedules);
  const [calendars, setCalendars] = useState<GoogleCalendarConfig[]>(initialCalendars);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [showAddCalendar, setShowAddCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarUrl, setNewCalendarUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 동기화 함수
  const handleSync = async () => {
    setSyncing(true);
    setSyncResults(null);

    try {
      const response = await fetch('/api/admin/calendars/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Sync failed');
      }

      const data = await response.json();
      setSyncResults(data);

      // 일정 목록 새로고침
      const schedulesResponse = await fetch('/api/data/game-schedules');
      if (schedulesResponse.ok) {
        const newSchedules = await schedulesResponse.json();
        setSchedules(newSchedules);
        alert(`${data.count}개의 경기 일정이 동기화되었습니다.`);
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert(`동기화 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  // 캘린더 추가
  const handleAddCalendar = async () => {
    if (!newCalendarName.trim() || !newCalendarUrl.trim()) {
      alert('이름과 URL을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/calendars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCalendarName.trim(),
          url: newCalendarUrl.trim(),
        }),
      });

      if (response.ok) {
        const newCalendar = await response.json();
        setCalendars([...calendars, newCalendar]);
        setNewCalendarName('');
        setNewCalendarUrl('');
        setShowAddCalendar(false);
        alert('캘린더가 등록되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '등록 실패');
      }
    } catch (error) {
      console.error('Error adding calendar:', error);
      alert('등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 캘린더 삭제
  const handleDeleteCalendar = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/calendars/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCalendars(calendars.filter(c => c.id !== id));
        alert('삭제되었습니다.');
      }
    } catch (error) {
      console.error('Error deleting calendar:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 캘린더 활성화/비활성화
  const handleToggleCalendar = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/calendars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setCalendars(calendars.map(c =>
          c.id === id ? { ...c, isActive: !isActive } : c
        ));
      }
    } catch (error) {
      console.error('Error toggling calendar:', error);
    }
  };

  // 경기 상태 표시
  const getStatusDisplay = (status: GameStatus) => {
    switch (status) {
      case 'live':
        return <span className="text-caption text-suwon-red font-bold">LIVE</span>;
      case 'finished':
        return <span className="text-caption text-suwon-textPrimary">종료</span>;
      case 'postponed':
        return <span className="text-caption text-suwon-yellow font-bold">연기</span>;
      default:
        return <span className="text-caption text-suwon-blue">예정</span>;
    }
  };

  // 홈/어웨이 표시
  const getHomeAwayDisplay = (homeAway: HomeAway) => {
    return homeAway === 'home' ? (
      <div className="flex items-center gap-1 text-suwon-red">
        <Home className="w-4 h-4" />
        <span className="text-caption">홈</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-suwon-blue">
        <Car className="w-4 h-4" />
        <span className="text-caption">원정</span>
      </div>
    );
  };

  // 필터링 (오늘 이후 경기만)
  const filteredSchedules = schedules.filter(s => {
    const scheduleDate = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return scheduleDate >= today && (
      s.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.calendarName && s.calendarName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-suwon-textPrimary font-bold">경기 일정 관리</h1>
          <p className="text-body2 text-suwon-textSecondary">
            구글 캘린더 iCal URL을 등록하여 경기 일정을 자동 동기화하세요
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSync}
            disabled={syncing || calendars.filter(c => c.isActive).length === 0}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? '동기화 중...' : '동기화'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAddCalendar(!showAddCalendar)}
          >
            <Plus className="w-4 h-4 mr-2" />
            캘린더 등록
          </Button>
        </div>
      </div>

      {/* 캘린더 등록 폼 */}
      {showAddCalendar && (
        <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-blue/30">
          <h2 className="text-h2 text-suwon-textPrimary mb-4">새 캘린더 등록</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body2 text-suwon-textPrimary mb-2">캘린더 이름 *</label>
              <input
                type="text"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                placeholder="예: 수원FC 공식 일정"
                className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-blue/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-blue"
              />
            </div>
            <div>
              <label className="block text-body2 text-suwon-textPrimary mb-2">iCal URL *</label>
              <input
                type="url"
                value={newCalendarUrl}
                onChange={(e) => setNewCalendarUrl(e.target.value)}
                placeholder="https://calendar.google.com/calendar/ical/..."
                className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-blue/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-blue"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="primary" onClick={handleAddCalendar} disabled={loading}>
              {loading ? '등록 중...' : '등록'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCalendar(false);
                setNewCalendarName('');
                setNewCalendarUrl('');
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 캘린더 목록 */}
      <div>
        <h2 className="text-h2 text-suwon-textPrimary mb-3">등록된 캘린더</h2>
        {calendars.length === 0 ? (
          <div className="bg-suwon-cardDark rounded-card p-8 text-center border border-suwon-blue/20">
            <CalendarIcon className="mx-auto w-16 h-16 text-suwon-blue mb-4" />
            <p className="text-body2 text-suwon-textSecondary">
              등록된 캘린더가 없습니다. 캘린더를 등록하고 동기화하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className="bg-suwon-cardDark rounded-card p-4 border border-suwon-blue/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={calendar.isActive}
                        onChange={() => handleToggleCalendar(calendar.id, calendar.isActive)}
                        className="w-4 h-4 rounded border-suwon-blue bg-suwon-navy text-suwon-blue focus:ring-suwon-blue"
                      />
                      <h3 className="text-h3 text-suwon-textPrimary font-bold">
                        {calendar.name}
                      </h3>
                      {calendar.isActive ? (
                        <span className="text-caption text-suwon-blue">활성</span>
                      ) : (
                        <span className="text-caption text-suwon-textSecondary">비활성</span>
                      )}
                    </div>
                    <p className="text-caption text-suwon-textSecondary break-all mb-1">
                      {calendar.url}
                    </p>
                    <p className="text-caption text-suwon-textSecondary">
                      등록일: {calendar.createdAt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCalendar(calendar.id)}
                    className="text-suwon-red hover:text-suwon-red/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  href={calendar.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-caption text-suwon-blue hover:text-suwon-blue/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  원본 캘린더 보기
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 동기화 결과 */}
      {syncResults && (
        <div className="bg-suwon-cardDark rounded-card p-4 border border-suwon-green/30">
          <h3 className="text-h3 text-suwon-textPrimary mb-3">동기화 결과</h3>
          {syncResults.error ? (
            <div className="text-body2 text-suwon-red mb-2">
              동기화 실패: {syncResults.error}
            </div>
          ) : (
            <div className="text-body2 text-suwon-textSecondary mb-2">
              <span className="font-bold text-suwon-green">✓</span>
              {' '}
              {syncResults.count}개의 경기 일정이 {syncResults.syncedCalendars}개의 캘린더에서 동기화되었습니다.
            </div>
          )}
        </div>
      )}

      {/* 경기 일정 목록 */}
      <div>
        <h2 className="text-h2 text-suwon-textPrimary mb-3">경기 일정</h2>
        
        {/* 검색 */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="상대팀 또는 캘린더 이름으로 검색..."
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-blue/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-blue"
          />
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="bg-suwon-cardDark rounded-card p-8 text-center border border-suwon-blue/20">
            <CalendarIcon className="mx-auto w-16 h-16 text-suwon-blue mb-4" />
            <p className="text-body2 text-suwon-textSecondary">
              경기 일정이 없습니다. 캘린더를 등록하고 동기화하세요.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-suwon-cardDark rounded-card p-4 border border-suwon-blue/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getHomeAwayDisplay(schedule.homeAway)}
                      {getStatusDisplay(schedule.status)}
                    </div>
                    <h3 className="text-h3 text-suwon-textPrimary font-bold mb-1">
                      {schedule.opponent}
                    </h3>
                    {schedule.calendarName && (
                      <p className="text-caption text-suwon-textSecondary">
                        {schedule.calendarName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-caption text-suwon-textSecondary">
                    <Clock className="w-3 h-3" />
                    <span>{schedule.date} {schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-caption text-suwon-textSecondary">
                    <MapPin className="w-3 h-3" />
                    <span>{schedule.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}