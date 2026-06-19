'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { getSongs, deleteSong, getCurrentSongId, setCurrentSong } from '../actions';
import { CheerSong } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

export default function SongsAdminPageContent() {
  const [songs, setSongs] = useState<CheerSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [currentSongId, setCurrentSongIdState] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (editId) {
      router.push(`/admin/songs/new?edit=${editId}`);
    }
  }, [editId, router]);

  const loadSongs = async () => {
    try {
      const data = await getSongs();
      setSongs(data);
      const curId = await getCurrentSongId();
      setCurrentSongIdState(curId);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" 응원가를 삭제하시겠습니까?`)) {
      try {
        await deleteSong(id);
        // 삭제된 곡이 현재 응원가인 경우 선택 해제
        if (currentSongId === id) {
          await setCurrentSong(null);
          setCurrentSongIdState(null);
        }
        await loadSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      // 이미 선택된 곡이면 해제, 아니면 새로 설정 (단일 선택)
      const newId = currentSongId === id ? null : id;
      await setCurrentSong(newId);
      setCurrentSongIdState(newId);
    } catch (error) {
      console.error('Error setting current song:', error);
      alert('현재 응원가 설정 중 오류가 발생했습니다.');
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.lyrics.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || song.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h2 className="text-h1 text-suwon-textPrimary mb-2">응원가 관리</h2>
          <p className="text-body2 text-suwon-textSecondary">총 {songs.length}개의 응원가</p>
        </div>
        <Link href="/admin/songs/new">
          <Button variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            응원가 등록
          </Button>
        </Link>
      </div>

      {/* 현재 응원가 안내 */}
      <div className="bg-suwon-red/10 border border-suwon-red/30 rounded-card p-4 flex items-center gap-3">
        <Star size={20} className="text-suwon-red fill-suwon-red" />
        <p className="text-body2 text-suwon-textPrimary">
          {currentSongId 
            ? `현재 응원가: ${songs.find(s => s.id === currentSongId)?.title || '알 수 없음'}`
            : '현재 선택된 응원가가 없습니다. 별 아이콘을 눌러 프론트에 노출할 응원가를 선택하세요.'
          }
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-textSecondary" size={20} />
          <input
            type="text"
            placeholder="제목 또는 가사로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-textSecondary" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-12 pl-12 pr-10 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red appearance-none cursor-pointer"
          >
            <option value="ALL">전체</option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 응원가 목록 */}
      <div className="space-y-3">
        {filteredSongs.map((song) => {
          const isCurrent = currentSongId === song.id;
          return (
            <div
              key={song.id}
              className={`bg-suwon-cardDark rounded-card p-6 border-l-4 transition-all ${
                isCurrent 
                  ? 'border-suwon-red bg-suwon-red/5 shadow-lg shadow-suwon-red/20' 
                  : 'border-suwon-red/80 hover:border-suwon-red'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-suwon-red/20 text-suwon-red text-caption rounded-button font-bold">
                      {categoryNames[song.category as keyof typeof categoryNames]}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-suwon-red text-white text-caption rounded-button font-bold">
                        현재 응원가
                      </span>
                    )}
                  </div>
                  <h3 className="text-h3 text-suwon-textPrimary mb-2">{song.title}</h3>
                  <p className="text-caption text-suwon-textSecondary">등록일: {song.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetCurrent(song.id)}
                    title={isCurrent ? "현재 응원가 해제" : "현재 응원가로 설정"}
                    className={isCurrent 
                      ? "border-suwon-red text-suwon-red bg-suwon-red/10" 
                      : "border-suwon-textSecondary/30 text-suwon-textSecondary hover:text-suwon-red hover:border-suwon-red"
                    }
                  >
                    <Star size={16} className={isCurrent ? "fill-suwon-red" : ""} />
                  </Button>
                  <Link href={`/admin/songs/new?edit=${song.id}`}>
                    <Button variant="outline" size="sm" title="수정">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(song.id, song.title)}
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}