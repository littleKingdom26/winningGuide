'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { CheerGuide } from '@/constants/types';
import Button from '@/components/common/Button';

export default function CheerGuideFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'TIP' as 'MANNER' | 'TIP' | 'RULE' | 'ETIQUETTE',
    order: 0,
  });

  useEffect(() => {
    if (editId) {
      loadGuide();
    }
  }, [editId]);

  const loadGuide = async () => {
    try {
      const response = await fetch('/api/data/cheer-guides');
      if (response.ok) {
        const guides: CheerGuide[] = await response.json();
        const guide = guides.find((g: CheerGuide) => g.id === editId);
        if (guide) {
          setFormData({
            title: guide.title,
            content: guide.content,
            category: guide.category,
            order: guide.order,
          });
        }
      }
    } catch (error) {
      console.error('Error loading guide:', error);
      alert('가이드를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const id = editId || `cheer-guide-${Date.now()}`;
      const now = new Date().toISOString().split('T')[0];
      
      let createdAt = now;
      if (editId) {
        const response = await fetch('/api/data/cheer-guides');
        if (response.ok) {
          const guides: CheerGuide[] = await response.json();
          const existingGuide = guides.find((g: CheerGuide) => g.id === editId);
          if (existingGuide) {
            createdAt = existingGuide.createdAt;
          }
        }
      }
      
      const guideData: CheerGuide = {
        id,
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        order: formData.order,
        createdAt,
      };

      const response = await fetch('/api/admin/cheer-guides', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guideData),
      });

      if (response.ok) {
        alert(editId ? '가이드가 수정되었습니다.' : '가이드가 등록되었습니다.');
        router.push('/admin/cheer-guides');
      } else {
        throw new Error('Failed to save guide');
      }
    } catch (error) {
      console.error('Error saving guide:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cheer-guides">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-1" />
              뒤로
            </Button>
          </Link>
          <div>
            <h2 className="text-h1 text-suwon-textPrimary">
              {editId ? '가이드 수정' : '새 가이드 등록'}
            </h2>
            <p className="text-body2 text-suwon-textSecondary">
              {editId ? '기존 가이드 정보를 수정합니다.' : '새로운 응원팁/매너 가이드를 등록합니다.'}
            </p>
          </div>
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={loading}>
          <Save size={20} className="mr-2" />
          {loading ? '저장 중...' : '저장'}
        </Button>
      </div>

      {/* 폼 */}
      <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-red/20 space-y-6">
        <div>
          <label className="block text-body1 text-suwon-textPrimary mb-2 font-bold">
            카테고리 *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
            required
          >
            <option value="MANNER">응원 매너</option>
            <option value="TIP">응원 팁</option>
            <option value="RULE">규칙</option>
            <option value="ETIQUETTE">에티켓</option>
          </select>
        </div>

        <div>
          <label className="block text-body1 text-suwon-textPrimary mb-2 font-bold">
            순서 *
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
            required
          />
          <p className="text-caption text-suwon-textSecondary mt-1">
            작을수록 먼저 표시됩니다.
          </p>
        </div>

        <div>
          <label className="block text-body1 text-suwon-textPrimary mb-2 font-bold">
            제목 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-12 px-4 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
            placeholder="가이드 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-body1 text-suwon-textPrimary mb-2 font-bold">
            내용 *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full h-48 px-4 py-3 bg-suwon-navy/50 border border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red resize-none"
            placeholder="가이드 내용을 입력하세요"
            required
          />
          <p className="text-caption text-suwon-textSecondary mt-1">
            여러 줄 입력 가능합니다.
          </p>
        </div>
      </div>
    </form>
  );
}