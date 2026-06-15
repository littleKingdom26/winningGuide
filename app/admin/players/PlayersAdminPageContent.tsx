'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { getPlayers, deletePlayer } from '../actions';
import { PlayerProfile } from '@/constants/types';
import { positionNames } from '@/constants/mockData';

export default function PlayersAdminPageContent() {
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
      setPlayers(data);
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
    player.name.includes(searchTerm) ||
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-suwon-cardDark rounded-card p-6 border-l-4 border-suwon-blue/80 hover:border-suwon-blue transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-suwon-blue to-blue-700 rounded-full flex items-center justify-center border-2 border-suwon-blue/50 shadow-lg shadow-blue-500/30">
                  <span className="text-h3 text-white font-bold">{player.backNumber}</span>
                </div>
                <div>
                  <h3 className="text-h3 text-suwon-textPrimary mb-1">{player.name}</h3>
                  <p className="text-caption text-suwon-textSecondary">{positionNames[player.position]}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/players/new?edit=${player.id}`}>
                  <Button variant="outline" size="sm">
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
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <User size={48} className="mx-auto mb-4 text-suwon-textSecondary/30" />
            <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}