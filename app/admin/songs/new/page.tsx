'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { getSong, createSong, updateSong } from '../../actions';
import { CheerSong, CheerCategory } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

export default function SongFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    category: 'ATTACK' as CheerCategory,
    lyrics: '',
    videoUrl: '',
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editId) {
      loadSong(editId);
      setIsEditing(true);
    }
  }, [editId]);

  const loadSong = async (id: string) => {
    try {
      const song = await getSong(id);
      if (song) {
        setFormData({
          title: song.title,
          category: song.category,
          lyrics: song.lyrics,
          videoUrl: song.videoUrl,
          tags: song.tags,
        });
      }
    } catch (error) {
      console.error('Error loading song:', error);
      alert('응원가를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.lyrics.trim()) {
      alert('제목과 가사를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && editId) {
        await updateSong(editId, formData);
        alert('수정되었습니다.');
      } else {
        await createSong(formData);
        alert('등록되었습니다.');
      }
      router.push('/admin/songs');
    } catch (error) {
      console.error('Error saving song:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/songs">
          <Button variant="outline" size="sm">
            <ArrowLeft size={18} className="mr-1" />
            목록
          </Button>
        </Link>
        <div>
          <h2 className="text-h1 text-suwon-textPrimary mb-1">
            {isEditing ? '응원가 수정' : '새 응원가 등록'}
          </h2>
          <p className="text-body2 text-suwon-textSecondary">
            {isEditing ? '기존 응원가 정보를 수정합니다' : '새로운 응원가를 등록합니다'}
          </p>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">제목 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
            placeholder="응원가 제목 입력"
            required
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">카테고리 *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
            required
          >
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* 가사 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">가사 *</label>
          <textarea
            value={formData.lyrics}
            onChange={(e) => setFormData(prev => ({ ...prev, lyrics: e.target.value }))}
            className="w-full min-h-[200px] px-4 py-3 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red resize-y"
            placeholder="응원가 가사 입력"
            required
          />
        </div>

        {/* 동영상 URL */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">동영상 URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
            placeholder="YouTube Embed URL (예: https://www.youtube.com/embed/...)"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-body2 text-suwon-textPrimary mb-2">태그</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-red"
              placeholder="태그 입력 후 Enter"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addTag}
              disabled={!newTag.trim()}
            >
              <Plus size={18} className="mr-1" />
              추가
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-suwon-red/20 text-suwon-red rounded-full border border-suwon-red/30"
                >
                  <span className="text-caption">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-suwon-red/30 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <Link href="/admin/songs" className="flex-1">
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