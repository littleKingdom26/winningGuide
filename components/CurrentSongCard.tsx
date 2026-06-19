'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, Music, Bell } from 'lucide-react';
import { CheerSong } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';

interface CurrentSongCardProps {
  songs: CheerSong[];
  initialSongId: string | null;
}

// 기본 비프음 재생 (Web Audio API)
function playBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz 비프음

    // 볼륨 페이드 인/아웃 (팝 느낌 제거)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);

    // 정리
    oscillator.onended = () => {
      ctx.close().catch(() => {});
    };
  } catch (error) {
    console.error('Sound play error:', error);
  }
}

// 알림 효과 (진동 + 사운드)
function triggerNotification() {
  // 진동 (Android만 지원, iOS는 무시됨)
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  } catch (error) {
    console.error('Vibration error:', error);
  }

  // 사운드 (모든 플랫폼, iOS는 사용자 상호작용 이후)
  playBeep();
}

export default function CurrentSongCard({ songs, initialSongId }: CurrentSongCardProps) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(initialSongId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  // 토스트 자동 제거 (3초)
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 30초마다 폴링하여 현재 응원가 확인 (탭이 비활성화되면 중지)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const pollCurrentSong = async () => {
      try {
        const res = await fetch('/api/data/current-song', { 
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!res.ok) return;
        const data = await res.json();
        const newSongId = data.songId || null;
        
        // 변경된 경우에만 상태 업데이트 (부드러운 전환)
        if (newSongId !== currentSongId) {
          // 초기 로드가 아닌 실제 변경인 경우 알림
          if (!isFirstRender.current) {
            triggerNotification();
            const newSong = newSongId ? songs.find(s => s.id === newSongId) : null;
            setToastMessage(
              newSong 
                ? `🔔 새 응원가: ${newSong.title} 시작!`
                : '🔇 현재 응원가가 종료되었습니다'
            );
          }
          isFirstRender.current = false;

          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentSongId(newSongId);
            setIsTransitioning(false);
          }, 300);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const startPolling = () => {
      clearInterval(interval);
      interval = setInterval(pollCurrentSong, 30000);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        // 탭이 다시 활성화되면 즉시 한 번 체크 후 폴링 재개
        pollCurrentSong();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // 탭이 보이고 있을 때만 폴링 시작
    if (!document.hidden) {
      startPolling();
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [currentSongId, songs]);

  const currentSong = currentSongId 
    ? songs.find(s => s.id === currentSongId) || null
    : null;

  return (
    <>
      {/* 토스트 알림 */}
      {toastMessage && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[90%] animate-toast-in"
        >
          <div className="bg-suwon-cardDark border-2 border-suwon-red rounded-button px-4 py-3 shadow-lg shadow-suwon-red/30 flex items-center gap-2">
            <Bell size={18} className="text-suwon-red flex-shrink-0" />
            <span className="text-body2 text-suwon-textPrimary font-bold whitespace-nowrap">
              {toastMessage}
            </span>
          </div>
        </div>
      )}

      {/* 현재 응원가 카드 */}
      {currentSong && (
        <div className="mb-5">
          <h2 className="text-h2 text-suwon-textPrimary mb-3 flex items-center gap-2">
            <Star size={20} className="text-suwon-red fill-suwon-red" />
            현재 응원가
          </h2>
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
                    <span className="text-caption text-suwon-yellow font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-suwon-yellow rounded-full animate-pulse" />
                      지금 함께 불러요!
                    </span>
                  </div>
                  <h3 className="text-h2 text-suwon-textPrimary font-bold mb-2">{currentSong.title}</h3>
                  <p className="text-body2 text-suwon-textSecondary line-clamp-2">
                    {currentSong.lyrics.split('\n')[0]}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
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
        @keyframes toast-in {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20%);
          }
        }
        .animate-toast-in {
          animation: toast-in 3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}