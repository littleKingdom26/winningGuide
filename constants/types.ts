export type CheerCategory = 'GOAL' | 'GAMEOVER' | 'EXTRATIME' | 'GENERAL' | 'PLAYER_ENTRY' | 'VICTORY' | 'SETPIECE';

export interface CheerSong {
  id: string;
  title: string;
  category: CheerCategory;
  lyrics: string;
  videoUrl: string;
  targetPlayerId?: string;
  tags: string[];
  createdAt: string;
  notes?: string;
}

export interface PlayerProfile {
  id: string;
  backNumber: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  thumbnailUrl: string;
  cheerSongId?: string;
}

// 응원 팁/매너 가이드
export type CheerGuideCategory = 'MANNER' | 'TIP' | 'RULE' | 'ETIQUETTE';

export interface CheerGuide {
  id: string;
  title: string;
  content: string;
  category: CheerGuideCategory;
  icon?: string;
  order: number;
  createdAt: string;
}

export interface CheerRule {
  id: string;
  rule: string;
  penalty?: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  order: number;
}

// 경기 일정
export type GameStatus = 'scheduled' | 'live' | 'finished' | 'postponed';
export type HomeAway = 'home' | 'away';

export interface GameSchedule {
  id: string;
  opponent: string;
  homeAway: HomeAway;
  date: string; // ISO 8601 format
  time: string; // HH:mm format
  venue: string;
  weather?: string;
  status: GameStatus;
  homeScore?: number;
  awayScore?: number;
  round?: string; // 예: "27R", "FA컵 16강"
  calendarId?: string; // 어느 캘린더에서 왔는지
  calendarName?: string; // 캘린더 이름
}

export interface LiveMatch {
  id: string;
  homeScore: number;
  awayScore: number;
  currentTime: string; // 예: "75'"
  events: MatchEvent[];
}

export interface MatchEvent {
  id: string;
  type: 'GOAL' | 'CARD' | 'SUBSTITUTION' | 'HALF_TIME' | 'FULL_TIME';
  minute: string;
  description: string;
  playerId?: string;
}

// 구글 캘린더 설정
export interface GoogleCalendarConfig {
  id: string;
  name: string;
  url: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
}
