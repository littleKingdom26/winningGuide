'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { getPlayers, deletePlayer } from '../actions';
import { PlayerProfile } from '@/constants/types';
import { positionNames } from '@/constants/mockData';

export default function PlayersAdminPage() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (editId) {
      router.push(`/admin/players/new?edit=${editId}`);
    }
  }, [editId, router]);

  const loadPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data.sort((a, b) => a.backNumber - b.backNumber));
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`"${name}" 선수를 삭제하시겠습니까?`)) {
      try {
        await deletePlayer(id);
        await loadPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.backNumber.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-body2 text-suwon-textSecondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 text-suwon-textPrimary mb-2">선수 관리</h2>
          <p className="text-body2 text-suwon-textSecondary">총 {players.length}명의 선수</p>
        </div>
        <Link href="/admin/players/new">
          <Button variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            새 선수 등록
          </Button>
        </Link>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-textSecondary" size={20} />
        <input
          type="text"
          placeholder="이름 또는 백번호로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
        />
      </div>

      {/* 선수 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-suwon-cardDark rounded-card p-6 border-l-4 border-suwon-red/80 hover:border-suwon-red transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-suwon-red to-red-700 rounded-full flex items-center justify-center border-2 border-suwon-red/50 shadow-lg">
                <span className="text-h3 text-white font-bold">{player.backNumber}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-h3 text-suwon-textPrimary font-bold mb-1">{player.name}</h3>
                <span className="px-2 py-0.5 bg-suwon-red/20 text-suwon-red text-caption rounded-button border border-suwon-red/30">
                  {positionNames[player.position]}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/admin/players/new?edit=${player.id}`} className="flex-1">
                <Button variant="outline" size="sm" fullWidth>
                  <Edit size={16} className="mr-1" />
                  수정
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(player.id, player.name)}
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={16} className="mr-1" />
                삭제
              </Button>
            </div>
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-suwon-textSecondary/30" />
            <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Users({ size, className }: { size: number; className: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>;
}