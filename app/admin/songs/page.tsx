'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { getSongs, deleteSong } from '../actions';
import { CheerSong } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

export default function SongsAdminPage() {
  const [songs, setSongs] = useState<CheerSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
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
        await loadSongs();
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
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
            새 응원가 등록
          </Button>
        </Link>
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
            <option value="ALL">전체 카테고리</option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 응원가 목록 */}
      <div className="space-y-3">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className="bg-suwon-cardDark rounded-card p-6 border-l-4 border-suwon-red/80 hover:border-suwon-red transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-suwon-red/20 text-suwon-red text-caption rounded-button font-bold">
                    {categoryNames[song.category as keyof typeof categoryNames]}
                  </span>
                  {song.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-suwon-red/10 text-suwon-red text-caption rounded-button border border-suwon-red/30">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-h3 text-suwon-textPrimary mb-2">{song.title}</h3>
                <p className="text-body2 text-suwon-textSecondary line-clamp-2 mb-2">{song.lyrics}</p>
                <p className="text-caption text-suwon-textSecondary">등록일: {song.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/songs/new?edit=${song.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-1" />
                    수정
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(song.id, song.title)}
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <Music size={48} className="mx-auto mb-4 text-suwon-textSecondary/30" />
            <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Music({ size, className }: { size: number; className: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>;
}