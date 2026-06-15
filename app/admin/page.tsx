import { getStats } from './actions';
import { Music, Users, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default async function AdminDashboard() {
  const stats = await getStats();

  const categoryNames = {
    GOAL: '득점',
    GAMEOVER: '경기종료',
    EXTRATIME: '추가시간',
    GENERAL: '일반',
  };

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

        <div className="bg-suwon-cardDark rounded-card p-6 border-2 border-suwon-red/30">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-suwon-red" size={24} />
            <span className="text-caption text-suwon-textSecondary">카테고리 수</span>
          </div>
          <p className="text-4xl font-bold text-suwon-textPrimary">{Object.keys(stats.songsByCategory).length}</p>
        </div>

        <div className="bg-suwon-cardDark rounded-card p-6 border-2 border-suwon-blue/30">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-suwon-blue" size={24} />
            <span className="text-caption text-suwon-textSecondary">최근 업데이트</span>
          </div>
          <p className="text-2xl font-bold text-suwon-textPrimary">
            {stats.recentSongs[0]?.createdAt || '-'}
          </p>
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