'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Music, RefreshCw } from 'lucide-react';
import { CheerSong } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

interface CurrentSongCardProps {
  songs: CheerSong[];
  initialSongId: string | null;
}

export default function CurrentSongCard({ songs, initialSongId }: CurrentSongCardProps) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(initialSongId);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data/current-song', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      const newSongId = data.songId || null;

      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSongId(newSongId);
        setIsTransitioning(false);
        setHasChecked(true);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Refresh error:', error);
      setIsLoading(false);
    }
  };

  const currentSong = currentSongId
    ? songs.find((s) => s.id === currentSongId) || null
    : null;

  return (
    <div className="mb-5">
      {/* 새로고침 버튼 */}
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-suwon-red/20 hover:bg-suwon-red/30 active:bg-suwon-red/40 border-2 border-suwon-red/50 rounded-button text-suwon-red font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Star size={18} className={isLoading ? 'animate-spin' : ''} fill="currentColor" />
        <span>{isLoading ? '불러오는 중...' : '현재 응원가'}</span>
        {!isLoading && <RefreshCw size={16} className="opacity-70" />}
      </button>

      {/* 새로고침 후 결과 */}
      {hasChecked && !isLoading && (
        <>
          {currentSong ? (
            <Link href={`/situation/${currentSong.id}`} className="block">
              <div
                className={`relative overflow-hidden rounded-card border-2 border-suwon-red bg-gradient-to-br from-suwon-red/20 via-suwon-red/10 to-suwon-cardDark p-5 cursor-pointer hover:from-suwon-red/30 hover:via-suwon-red/15 transition-all duration-300 shadow-lg shadow-suwon-red/40 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ animation: 'pulse-border 2s ease-in-out infinite' }}
              >
                {/* 펄스 효과 배경 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-suwon-red/10 rounded-full blur-3xl animate-pulse" />

                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-suwon-red/30 flex items-center justify-center text-suwon-red shadow-inner">
                    <Music size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-suwon-red text-white text-caption rounded-button font-bold">
                        {categoryNames[currentSong.category as keyof typeof categoryNames]}
                      </span>
                      <span className="text-caption text-suwon-yellow font-bold flex items-center gap-1 max-w-[180px]">
                        <span className="w-1.5 h-1.5 bg-suwon-yellow rounded-full animate-pulse flex-shrink-0" />
                        <span className="line-clamp-1">
                          {currentSong.notes || '함께 불러요'}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-h2 text-suwon-textPrimary font-bold mb-2">
                      {currentSong.title}
                    </h3>
                    <p className="text-body2 text-suwon-textSecondary line-clamp-2">
                      {currentSong.lyrics.split('\n')[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-suwon-cardDark border border-suwon-blue/20 rounded-card p-5 text-center">
              <p className="text-body1 text-suwon-textSecondary">
                현재 진행 중인 응원가가 없습니다
              </p>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 10px 30px -10px rgba(239, 68, 68, 0.4), 0 0 0 0 rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 10px 30px -10px rgba(239, 68, 68, 0.5), 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
}