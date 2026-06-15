import { readData } from '@/lib/dataManager';
import { CheerSong } from '@/constants/types';
import VideoPlayer from '@/components/Shared/VideoPlayer';
import FixedBottomBar from '@/components/Shared/FixedBottomBar';
import { notFound } from 'next/navigation';

export default async function SituationDetailPage({ params }: { params: { id: string } }) {
  const songs = await readData<CheerSong>('songs.json');
  const song = songs.find((s) => s.id === params.id);

  if (!song) {
    notFound();
  }

  return (
    <div className="pb-24">
      <div className="p-4 space-y-4">
        {/* 동영상 영역 */}
        <VideoPlayer videoUrl={song.videoUrl} />

        {/* 가사 영역 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-h1 text-suwon-textPrimary">{song.title}</h1>
            <div className="flex items-center gap-2">
              {song.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-suwon-blue/20 text-suwon-blue text-caption rounded-button">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-suwon-cardDark rounded-card p-6 border border-suwon-blue/10">
            <pre className="text-body1 text-suwon-textPrimary whitespace-pre-wrap font-sans leading-relaxed">
              {song.lyrics}
            </pre>
          </div>

          {/* 추가 정보 */}
          <div className="flex items-center gap-2 text-caption text-suwon-textSecondary">
            <span>등록일: {song.createdAt}</span>
          </div>

          {/* 참고사항 */}
          {song.notes && (
            <div className="mt-4">
              <h3 className="text-h3 text-suwon-textPrimary mb-2 flex items-center gap-2">
                <span>📝</span>
                <span>참고사항</span>
              </h3>
              <div className="bg-suwon-blue/5 rounded-card p-4 border border-suwon-blue/20">
                <p className="text-body2 text-suwon-textPrimary whitespace-pre-wrap leading-relaxed">
                  {song.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 바 */}
      <FixedBottomBar lyrics={song.lyrics} songTitle={song.title} />
    </div>
  );
}