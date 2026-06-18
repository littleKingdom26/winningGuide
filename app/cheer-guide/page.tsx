import { readData } from '@/lib/dataManager';
import { CheerGuide, CheerGuideCategory } from '@/constants/types';
import Card from '@/components/common/Card';
import { BookOpen, Heart, AlertTriangle, CheckCircle } from 'lucide-react';

export default async function CheerGuidePage() {
  const guides = await readData<CheerGuide>('cheer-guides.json');
  
  // 카테고리별 아이콘 및 라벨
  const categoryConfig = {
    MANNER: { icon: Heart, label: '응원 매너', color: 'text-suwon-red' },
    TIP: { icon: BookOpen, label: '응원 팁', color: 'text-suwon-yellow' },
    RULE: { icon: AlertTriangle, label: '규칙', color: 'text-suwon-blue' },
    ETIQUETTE: { icon: CheckCircle, label: '에티켓', color: 'text-suwon-blue' },
  };

  // order 기준 정렬
  const sortedGuides = [...guides].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-h1 text-suwon-textPrimary font-bold mb-2">응원 팁/매너 가이드</h1>
        <p className="text-body2 text-suwon-textSecondary">수원FC 팬으로서 알아야 할 필수 정보</p>
      </div>

      {/* 데이터가 없는 경우 */}
      {sortedGuides.length === 0 && (
        <Card className="p-8 text-center">
          <BookOpen className="mx-auto w-16 h-16 text-suwon-yellow mb-4" />
          <h2 className="text-h3 text-suwon-textPrimary mb-2">등록된 가이드가 없습니다</h2>
          <p className="text-body2 text-suwon-textSecondary">
            관리자를 통해 응원 팁/매너 가이드가 등록되면 표시됩니다.
          </p>
        </Card>
      )}

      {/* 가이드 목록 */}
      {sortedGuides.map((guide) => {
        const config = categoryConfig[guide.category];
        const Icon = config.icon;

        return (
          <Card key={guide.id} className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-suwon-cardDark flex items-center justify-center ${config.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <span className="inline-block px-2 py-1 bg-suwon-blue/20 text-suwon-blue text-caption rounded-button mb-1">
                  {config.label}
                </span>
                <h3 className="text-h3 text-suwon-textPrimary font-bold">{guide.title}</h3>
              </div>
            </div>
            <div className="ml-13">
              <p className="text-body1 text-suwon-textSecondary leading-relaxed whitespace-pre-wrap">
                {guide.content}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}