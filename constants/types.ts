export type CheerCategory = 'GOAL' | 'GAMEOVER' | 'EXTRATIME' | 'GENERAL';

export interface CheerSong {
  id: string;
  title: string;
  category: CheerCategory;
  lyrics: string;
  videoUrl: string;
  targetPlayerId?: string;
  tags: string[];
  createdAt: string;
}

export interface PlayerProfile {
  id: string;
  backNumber: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  thumbnailUrl: string;
  cheerSongId?: string;
}