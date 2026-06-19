import { getStats } from './actions';
import { Music, Users, TrendingUp, Clock, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { readData } from '@/lib/dataManager';
import { CheerGuide, GameSchedule } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

export default async function AdminDashboard() {
  const stats = await getStats();
  const guides = await readData<CheerGuide>('cheer-guides.json');
  const schedules = await readData<GameSchedule>('game-schedules.json');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h1 text-suwon-textPrimary mb-2">대시보드</h2>
        <p className="text-body2 text-suwon-textSecondary">수원FC 현장 가이드 관리 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-suwon-red to-red-700 rounded-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Music className="text-white/80" size={24} />
            <span className="text-caption text-white/60">총 응원가</span>
          </div>
          <p className="text-4xl font-bold text-white">{stats.totalSongs}</p>
        </div>

        <div className="bg-gradient-to-br from-suwon-blue to-blue-700 rounded-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-white/80" size={24} />
            <span className="text-caption text-white/60">총 선수</span>
          </div>
          <p className="text-4xl font-bold text-white">{stats.totalPlayers}</p>
        </div>

        <div className="bg-gradient-to-br from-suwon-yellow to-yellow-600 rounded-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="text-white/80" size={24} />
            <span className="text-caption text-white/60">응원 팁</span>
          </div>
          <p className="text-4xl font-bold text-white">{guides.length}</p>
        </div>

        <div className="bg-suwon-cardDark rounded-card p-6 border-2 border-suwon-blue/30">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-suwon-blue" size={24} />
            <span className="text-caption text-suwon-textSecondary">경기 일정</span>
          </div>
          <p className="text-4xl font-bold text-suwon-textPrimary">{schedules.length}</p>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div>
        <h3 className="text-h2 text-suwon-textPrimary mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/songs">
            <Button variant="primary" size="lg" fullWidth className="h-16 text-body1">
              <div className="flex items-center gap-3">
                <Music size={24} />
                <span>새 응원가 등록하기</span>
              </div>
            </Button>
          </Link>
          <Link href="/admin/players">
            <Button variant="secondary" size="lg" fullWidth className="h-16 text-body1">
              <div className="flex items-center gap-3">
                <Users size={24} />
                <span>새 선수 등록하기</span>
              </div>
            </Button>
          </Link>
          <Link href="/admin/cheer-guides">
            <Button variant="outline" size="lg" fullWidth className="h-16 text-body1 border-suwon-yellow/50 text-suwon-yellow hover:bg-suwon-yellow/10">
              <div className="flex items-center gap-3">
                <BookOpen size={24} />
                <span>응원팁/매너 관리</span>
              </div>
            </Button>
          </Link>
          <Link href="/admin/game-schedules">
            <Button variant="outline" size="lg" fullWidth className="h-16 text-body1 border-suwon-blue/50 text-suwon-blue hover:bg-suwon-blue/10">
              <div className="flex items-center gap-3">
                <Calendar size={24} />
                <span>경기 일정 관리</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* 카테고리별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-red/20">
          <h3 className="text-h2 text-suwon-textPrimary mb-4">카테고리별 응원가</h3>
          <div className="space-y-3">
            {Object.entries(stats.songsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-body2 text-suwon-textSecondary">
                  {categoryNames[category as keyof typeof categoryNames]}
                </span>
                <span className="text-h3 text-suwon-red font-bold">{count}개</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-blue/20">
          <h3 className="text-h2 text-suwon-textPrimary mb-4">최근 등록 응원가</h3>
          <div className="space-y-3">
            {stats.recentSongs.map((song) => (
              <div key={song.id} className="flex items-center justify-between p-3 bg-suwon-bgDark rounded-button">
                <div>
                  <p className="text-body2 text-suwon-textPrimary">{song.title}</p>
                  <p className="text-caption text-suwon-textSecondary">{song.createdAt}</p>
                </div>
                <Link href={`/admin/songs?edit=${song.id}`}>
                  <Button variant="outline" size="sm">
                    수정
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}