import Link from 'next/link';
import { readData } from '@/lib/dataManager';
import { CheerSong } from '@/constants/types';
import { categoryNames } from '@/constants/mockData';
import Card from '@/components/common/Card';

export default async function SituationPage() {
  const songs = await readData<CheerSong>('songs.json');
  const groupedSongs = songs.reduce((acc, song) => {
    if (!acc[song.category]) {
      acc[song.category] = [];
    }
    acc[song.category].push(song);
    return acc;
  }, {} as Record<string, CheerSong[]>);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-h1 text-suwon-textPrimary mb-2">상황별 응원</h1>
        <p className="text-body2 text-suwon-textSecondary">경기 상황에 맞는 응원법을 찾아보세요</p>
      </div>

      {Object.entries(groupedSongs).map(([category, songs]) => (
        <div key={category}>
          <h2 className="text-h2 text-suwon-textPrimary mb-3">{categoryNames[category as keyof typeof categoryNames]}</h2>
          <div className="space-y-3">
            {songs.map((song) => (
              <Link key={song.id} href={`/situation/${song.id}`}>
                <Card className="cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-suwon-red/20 text-suwon-red text-caption rounded-button font-bold">🔥</span>
                        <h3 className="text-h3 text-suwon-textPrimary">{song.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {song.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-suwon-red/10 text-suwon-red text-caption rounded-button border border-suwon-red/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-body2 text-suwon-textSecondary line-clamp-2">{song.lyrics}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}