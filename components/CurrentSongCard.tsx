'use client';

import { useState, useEffect } from 'react';
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

  // 컴포넌트 마운트 시 자동으로 현재 응원가 조회
  useEffect(() => {
    const fetchCurrentSong = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/data/current-song', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!res.ok) {
          setIsLoading(false);
          setHasChecked(true);
          return;
        }
        const data = await res.json();
        const newSongId = data.songId || null;
        
        setTimeout(() => {
          setCurrentSongId(newSongId);
          setHasChecked(true);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsLoading(false);
        setHasChecked(true);
      }
    };

    // initialSongId가 없을 때만 자동 조회
    if (!initialSongId) {
      fetchCurrentSong();
    } else {
      setHasChecked(true);
    }
  }, [initialSongId]);

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
                className={`relative overflow-hidden rounded-card border-2 border-suwon-red bg-gradient-to-br from-suwon-red/25 via-suwon-red/15 via-purple-500/10 to-suwon-cardDark p-5 cursor-pointer hover:from-suwon-red/35 hover:via-purple-500/15 hover:to-suwon-cardDark/90 transition-all duration-500 shadow-lg shadow-suwon-red/40 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  animation: 'pulse-border 2s ease-in-out infinite, gradient-shift 3s ease-in-out infinite alternate'
                }}
              >
                {/* 펄스 효과 배경 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-suwon-red/10 rounded-full blur-3xl animate-pulse" />
                
                {/* 그라데이션 웨이브 효과 */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute -top-10 -left-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />

                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-suwon-red/40 to-suwon-red/20 flex items-center justify-center text-suwon-red shadow-inner animate-pulse">
                    <Music size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-suwon-red text-white text-caption rounded-button font-bold">
                        {categoryNames[currentSong.category as keyof typeof categoryNames]}
                      </span>
                      {/* LIVE 배지 */}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-caption text-green-500 font-bold">LIVE</span>
                      </div>
                    </div>
                    
                    {/* 참고사항 강조 */}
                    <div className="mb-2 px-3 py-1.5 bg-suwon-yellow/10 border border-suwon-yellow/30 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-suwon-yellow rounded-full animate-pulse flex-shrink-0" />
                        <span className="text-body2 text-suwon-yellow font-bold line-clamp-1">
                          {currentSong.notes || '함께 불러요'}
                        </span>
                      </div>
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
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}