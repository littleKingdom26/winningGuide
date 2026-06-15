'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { CheerSong, PlayerProfile } from '@/constants/types';
import { positionNames } from '@/constants/mockData';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState<CheerSong[]>([]);
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    setLoading(true);
    try {
      const [songsResponse, playersResponse] = await Promise.all([
        fetch('/api/data/songs'),
        fetch('/api/data/players'),
      ]);
      const songsData = await songsResponse.json();
      const playersData = await playersResponse.json();
      setSongs(songsData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSongs = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.lyrics.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, songs]);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return players.filter(player => 
      player.name.includes(searchTerm) ||
      player.backNumber.toString().includes(searchTerm)
    );
  }, [searchTerm, players]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-body2 text-suwon-textSecondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-h1 text-suwon-textPrimary mb-4">검색</h1>

      {/* 검색창 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-suwon-blue" size={20} />
        <input
          type="text"
          placeholder="선수명, 응원가 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-suwon-navy/50 border border-suwon-blue/20 rounded-button text-suwon-textPrimary placeholder-suwon-textSecondary focus:outline-none focus:border-suwon-blue/50"
        />
      </div>

      {/* 검색 결과 */}
      {searchTerm.trim() && (
        <div className="space-y-6">
          {filteredSongs.length > 0 && (
            <div>
              <h2 className="text-h2 text-suwon-textPrimary mb-3">응원가</h2>
              <div className="space-y-3">
                {filteredSongs.map((song) => (
                  <Link key={song.id} href={`/situation/${song.id}`}>
                    <Card className="cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-h3 text-suwon-textPrimary mb-1">{song.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            {song.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 bg-suwon-blue/20 text-suwon-blue text-caption rounded-button">
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
          )}

          {filteredPlayers.length > 0 && (
            <div>
              <h2 className="text-h2 text-suwon-textPrimary mb-3">선수</h2>
              <div className="space-y-3">
                {filteredPlayers.map((player) => (
                  <Link key={player.id} href={`/player/${player.id}`}>
                    <Card className="cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-suwon-navy/50 rounded-full flex items-center justify-center border-2 border-suwon-blue/30">
                          <span className="text-h3 text-suwon-textPrimary font-bold">{player.backNumber}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-h3 text-suwon-textPrimary">{player.name}</h3>
                          <p className="text-caption text-suwon-textSecondary">{positionNames[player.position]}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredSongs.length === 0 && filteredPlayers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-body2 text-suwon-textSecondary">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {!searchTerm.trim() && (
        <div className="text-center py-8">
          <Search size={48} className="mx-auto mb-4 text-suwon-blue/30" />
          <p className="text-body2 text-suwon-textSecondary">선수명이나 응원가를 검색해보세요</p>
        </div>
      )}
    </div>
  );
}