import { Search } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { readData } from '@/lib/dataManager';
import { CheerSong } from '@/constants/types';

export default async function Home() {
  const songs = await readData<CheerSong>('songs.json');
  const hotCheerSongs = songs.slice(0, 3);
  
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

      {/* 카테고리 바로가기 */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Link href="/situation">
          <Card className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-suwon-red/20 flex items-center justify-center mb-2">
              <img
                src="/images/suwonfc-logo-small.png"
                alt="상황별 응원"
                className="w-6 h-6"
              />
            </div>
            <span className="text-h3 text-suwon-textPrimary">상황별 응원</span>
          </Card>
        </Link>
        <Link href="/player">
          <Card className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
            <div className="w-12 h-12 rounded-full bg-suwon-red/20 flex items-center justify-center mb-2">
              <img
                src="/images/suwonfc-logo-small.png"
                alt="선수별 응원"
                className="w-6 h-6"
              />
            </div>
            <span className="text-h3 text-suwon-textPrimary">선수별 응원</span>
          </Card>
        </Link>
      </div>

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
    </div>
  );
}