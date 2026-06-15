'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Music } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { getPlayer, createPlayer, updatePlayer } from '../../actions';
import { PlayerProfile } from '@/constants/types';
import { positionNames } from '@/constants/mockData';
import { getSongs } from '../../../admin/actions';

export default function PlayerFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    name: '',
    backNumber: 0,
    position: 'FW' as any,
    thumbnailUrl: '',
    cheerSongId: '',
  });

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadSongs();
    if (editId) {
      loadPlayer(editId);
      setIsEditing(true);
    }
  }, [editId]);

  const loadSongs = async () => {
    try {
      const data = await getSongs();
      setSongs(data);
    } catch (error) {
      console.error('Error loading songs:', error);
    }
  };

  const loadPlayer = async (id: string) => {
    try {
      const player = await getPlayer(id);
      if (player) {
        setFormData({
          name: player.name,
          backNumber: player.backNumber,
          position: player.position,
          thumbnailUrl: player.thumbnailUrl,
          cheerSongId: player.cheerSongId || '',
        });
      }
    } catch (error) {
      console.error('Error loading player:', error);
      alert('선수 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.backNumber <= 0) {
      alert('이름과 백번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        cheerSongId: formData.cheerSongId || undefined,
      };

      if (isEditing && editId) {
        await updatePlayer(editId, submitData);
        alert('수정되었습니다.');
      } else {
        await createPlayer(submitData);
        alert('등록되었습니다.');
      }
      router.push('/admin/players');
    } catch (error) {
      console.error('Error saving player:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/players">
          <Button variant="outline" size="sm">
            <ArrowLeft size={18} className="mr-1" />
            목록
          </Button>
        </Link>
        <div>
          <h2 className="text-h1 text-suwon-textPrimary mb-1">
            {isEditing ? '선수 수정' : '새 선수 등록'}
          </h2>
          <p className="text-body2 text-suwon-textSecondary">
            {isEditing ? '기존 선수 정보를 수정합니다' : '새로운 선수를 등록합니다'}
          </p>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">이름 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
            placeholder="선수 이름 입력"
            required
          />
        </div>

        {/* 백번호 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">백번호 *</label>
          <input
            type="number"
            min="1"
            max="99"
            value={formData.backNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, backNumber: parseInt(e.target.value) || 0 }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
            placeholder="백번호 입력 (1-99)"
            required
          />
        </div>

        {/* 포지션 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">포지션 *</label>
          <select
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as any }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
            required
          >
            {Object.entries(positionNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* 썸네일 URL */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">썸네일 URL</label>
          <input
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
            placeholder="이미지 URL 입력"
          />
        </div>

        {/* 응원가 연결 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">
            <Music size={16} className="inline mr-1" />
            응원가 연결 (선택사항)
          </label>
          <select
            value={formData.cheerSongId}
            onChange={(e) => setFormData(prev => ({ ...prev, cheerSongId: e.target.value }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
          >
            <option value="">응원가를 선택하세요</option>
            {songs.map((song) => (
              <option key={song.id} value={song.id}>{song.title}</option>
            ))}
          </select>
          <p className="text-caption text-suwon-textSecondary mt-1">
            이 선수에게 연결할 응원가를 선택합니다
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <Link href="/admin/players" className="flex-1">
            <Button variant="outline" size="lg" fullWidth>
              취소
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            <Save size={18} className="mr-2" />
            {loading ? '저장 중...' : (isEditing ? '수정' : '등록')}
          </Button>
        </div>
      </form>
    </div>
  );
}