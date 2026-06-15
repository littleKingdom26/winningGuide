import { readData } from '@/lib/dataManager';
import { PlayerProfile, CheerSong } from '@/constants/types';
import { positionNames } from '@/constants/mockData';
import VideoPlayer from '@/components/Shared/VideoPlayer';
import FixedBottomBar from '@/components/Shared/FixedBottomBar';
import { notFound } from 'next/navigation';

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const [players, songs] = await Promise.all([
    readData<PlayerProfile>('players.json'),
    readData<CheerSong>('songs.json'),
  ]);
  
  const player = players.find((p) => p.id === params.id);

  if (!player) {
    notFound();
  }

  const cheerSong = player.cheerSongId ? songs.find(s => s.id === player.cheerSongId) : null;

  return (
    <div className="pb-24">
      <div className="p-4 space-y-4">
        {/* 선수 프로필 */}
        <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-blue/10 text-center">
          <div className="w-24 h-24 bg-suwon-navy/50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-suwon-blue/30">
            <span className="text-h1 text-suwon-textPrimary font-bold">{player.backNumber}</span>
          </div>
          <h1 className="text-h1 text-suwon-textPrimary mb-2">{player.name}</h1>
          <p className="text-body2 text-suwon-textSecondary">{positionNames[player.position]}</p>
        </div>

        {cheerSong ? (
          <>
            {/* 동영상 영역 */}
            <VideoPlayer videoUrl={cheerSong.videoUrl} />

            {/* 가사 영역 */}
            <div className="space-y-3">
              <h2 className="text-h2 text-suwon-textPrimary">{cheerSong.title}</h2>
              
              <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-blue/10">
                <pre className="text-body1 text-suwon-textPrimary whitespace-pre-wrap font-sans leading-relaxed">
                  {cheerSong.lyrics}
                </pre>
              </div>

              {/* 태그 */}
              <div className="flex items-center gap-2">
                {cheerSong.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-suwon-blue/20 text-suwon-blue text-caption rounded-button">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 하단 고정 바 */}
            <FixedBottomBar lyrics={cheerSong.lyrics} songTitle={`${player.name} ${cheerSong.title}`} />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-body2 text-suwon-textSecondary">등록된 응원가가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}