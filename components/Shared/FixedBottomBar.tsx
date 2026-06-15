'use client';

import { Copy, Share2 } from 'lucide-react';
import Button from '@/components/common/Button';

interface FixedBottomBarProps {
  lyrics: string;
  songTitle: string;
}

export default function FixedBottomBar({ lyrics, songTitle }: FixedBottomBarProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics);
      alert('가사가 클립보드에 복사되었습니다. 현장에 공유해보세요!');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `[필승 가이드] ${songTitle}`,
        text: lyrics,
        url: window.location.href,
      });
    } else {
      alert('공유하기를 지원하지 않는 브라우저입니다. 링크를 복사해주세요.');
    }
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 max-w-md w-full bg-suwon-bgDark/95 backdrop-blur p-3 flex gap-3 border-t border-suwon-blue/10 z-50">
      <Button 
        variant="primary"
        size="md"
        fullWidth
        onClick={handleCopy}
        className="flex items-center justify-center gap-2"
      >
        <Copy size={18} />
        가사 복사하기
      </Button>
      <Button 
        variant="secondary"
        size="md"
        fullWidth
        onClick={handleShare}
        className="flex items-center justify-center gap-2"
      >
        <Share2 size={18} />
        공유하기
      </Button>
    </div>
  );
}