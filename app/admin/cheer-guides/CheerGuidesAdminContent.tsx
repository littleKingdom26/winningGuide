'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { CheerGuide } from '@/constants/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface CheerGuidesAdminContentProps {
  initialGuides: CheerGuide[];
}

export default function CheerGuidesAdminContent({ initialGuides }: CheerGuidesAdminContentProps) {
  const [guides, setGuides] = useState<CheerGuide[]>(initialGuides);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  
  const categoryNames = {
    MANNER: '응원 매너',
    TIP: '응원 팁',
    RULE: '규칙',
    ETIQUETTE: '에티켓',
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" 가이드를 삭제하시겠습니까?`)) {
      try {
        const response = await fetch(`/api/admin/cheer-guides/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          const data = await fetch('/api/data/cheer-guides');
          if (data.ok) {
            const newGuides = await data.json();
            setGuides(newGuides.sort((a: CheerGuide, b: CheerGuide) => a.order - b.order));
          }
        } else {
          alert('삭제 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('Error deleting guide:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || guide.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 text-suwon-textPrimary mb-2">응원팁/매너 관리</h2>
          <p className="text-body2 text-suwon-textSecondary">총 {guides.length}개의 가이드</p>
        </div>
        <Link href="/admin/cheer-guides/new">
          <Button variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            새 가이드 등록
          </Button>
        </Link>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-textSecondary" size={20} />
          <input
            type="text"
            placeholder="제목 또는 내용으로 검색..."
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

      {/* 가이드 목록 */}
      <div className="space-y-3">
        {filteredGuides.map((guide) => (
          <Card
            key={guide.id}
            className="p-6 border-l-4 border-suwon-red/80 hover:border-suwon-red transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-suwon-red/20 text-suwon-red text-caption rounded-button font-bold">
                    {categoryNames[guide.category]}
                  </span>
                  <span className="text-caption text-suwon-textSecondary">순서: {guide.order}</span>
                </div>
                <h3 className="text-h3 text-suwon-textPrimary mb-2">{guide.title}</h3>
                <p className="text-body2 text-suwon-textSecondary line-clamp-2 mb-2 whitespace-pre-wrap">{guide.content}</p>
                <p className="text-caption text-suwon-textSecondary">등록일: {guide.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/cheer-guides/new?edit=${guide.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-1" />
                    수정
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(guide.id, guide.title)}
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={16} className="mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto mb-4 text-suwon-textSecondary/30" />
            <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
