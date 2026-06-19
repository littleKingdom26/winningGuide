import { Search, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import CurrentSongCard from '@/components/CurrentSongCard';
import UpcomingMatch from '@/components/home/UpcomingMatch';
import { readData, readSingleData } from '@/lib/dataManager';
import { CheerSong, CheerGuide, GameSchedule } from '@/constants/types';

export default async function Home() {
  const songs = await readData<CheerSong>('songs.json');
  const guides = await readData<CheerGuide>('cheer-guides.json');
  const schedules = await readData<GameSchedule>('game-schedules.json');
  
  // 현재 응원가 조회 (초기값용)
  const currentSongData = await readSingleData<{ songId: string | null }>('current-song.json');
  const currentSongId = currentSongData?.songId || null;
  
  const hotCheerSongs = songs.slice(0, 3);
  const featuredGuides = guides.slice(0, 2);
  
  // 캘린더 추출
  const calendars = Array.from(
    new Map(
      schedules
        .filter(s => s.calendarId && s.calendarName)
        .map(s => [s.calendarId!, { id: s.calendarId!, name: s.calendarName! }])
    ).values()
  );

  // 미래 경기 필터링
  const now = new Date();
  const futureSchedules = schedules
    .filter(s => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="p-4 space-y-6">
      {/* 통합 검색창 */}
      <Link href="/search">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-yellow" size={20} />
          <input
            type="text"
            placeholder="선수명, 응원가 검색..."
            className="w-full h-12 pl-12 pr-4 bg-suwon-navy/50 border border-suwon-blue/20 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-blue/50"
            readOnly
          />
        </div>
      </Link>

      {/* 현재 응원가 (상단 배치 - 클라이언트 컴포넌트로 폴링) */}
      <CurrentSongCard songs={songs} initialSongId={currentSongId} />

      {/* 다가오는 경기 */}
      <UpcomingMatch schedules={futureSchedules} calendars={calendars} />

      {/* 응원가 목록 */}
      <div className="mb-5">
        <h2 className="text-h2 text-suwon-textPrimary mb-3">응원가 목록</h2>
        {hotCheerSongs.map((song, index) => (
          <Link 
            key={song.id} 
            href={`/situation/${song.id}`}
            className={`block mb-4 ${index === hotCheerSongs.length - 1 ? 'mb-0' : ''}`}
          >
            <Card className="cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {song.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-suwon-blue/20 text-suwon-blue text-caption rounded-button">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-h3 text-suwon-textPrimary mb-1">{song.title}</h3>
                  <p className="text-caption text-suwon-textSecondary">{song.createdAt}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* 응원 팁 */}
      {featuredGuides.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h2 text-suwon-textPrimary">응원 팁</h2>
            <Link href="/cheer-guide" className="text-caption text-suwon-blue hover:underline">
              더보기 →
            </Link>
          </div>
          <div className="space-y-3">
            {featuredGuides.map((guide, index) => (
              <Link 
                key={guide.id} 
                href="/cheer-guide"
                className={`block ${index === featuredGuides.length - 1 ? '' : 'mb-3'}`}
              >
                <Card className="p-4 cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-suwon-cardDark flex items-center justify-center text-suwon-yellow">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h3 text-suwon-textPrimary font-bold mb-1">{guide.title}</h3>
                      <p className="text-caption text-suwon-textSecondary line-clamp-2">
                        {guide.content}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}