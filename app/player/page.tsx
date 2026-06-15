import Link from 'next/link';
import Card from '@/components/common/Card';
import { readData } from '@/lib/dataManager';
import { PlayerProfile, CheerSong } from '@/constants/types';
import { positionNames } from '@/constants/mockData';

export default async function PlayerPage() {
  const [players, songs] = await Promise.all([
    readData<PlayerProfile>('players.json'),
    readData<CheerSong>('songs.json'),
  ]);
  
  // 백번호순 정렬
  const sortedPlayers = [...players].sort((a, b) => a.backNumber - b.backNumber);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-h1 text-suwon-textPrimary mb-2">선수별 응원</h1>
        <p className="text-body2 text-suwon-textSecondary">선수 개별 응원가와 세레머니</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedPlayers.map((player) => {
          const cheerSong = player.cheerSongId ? songs.find(s => s.id === player.cheerSongId) : null;
          
          return (
            <Link key={player.id} href={`/player/${player.id}`}>
              <Card className="cursor-pointer hover:bg-suwon-cardDark/80 transition-colors flex flex-col items-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-suwon-red to-red-700 rounded-full flex items-center justify-center mb-3 border-2 border-suwon-red/50 shadow-lg shadow-red-500/30">
                  <span className="text-h3 text-white font-bold">{player.backNumber}</span>
                </div>
                <h3 className="text-h3 text-suwon-textPrimary mb-1 text-center font-bold">{player.name}</h3>
                <p className="text-caption text-suwon-textSecondary mb-2">{positionNames[player.position]}</p>
                {cheerSong && (
                  <div className="w-full px-3 py-1 bg-suwon-red/20 rounded-full">
                    <p className="text-caption text-suwon-red font-semibold truncate text-center">
                      {cheerSong.title}
                    </p>
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}