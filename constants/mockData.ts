import { CheerSong, PlayerProfile } from './types';

export const mockCheerSongs: CheerSong[] = [
  {
    id: '1',
    title: '스우파이 항전!',
    category: 'GENERAL',
    lyrics: '스우파이 항전! (박수 2번)\n승리하리! (박수 2번)\n스우파이 항전! (박수 2번)\n승리하리! (박수 2번)',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['신곡', '쉬움'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '파이팅 FC 서울',
    category: 'GENERAL',
    lyrics: '파이팅 FC 서울!\n파이팅 FC 서울!\n우리의 승리는\n오직 FC 서울!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['박자주의'],
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: '수비 벽 세워라',
    category: 'GENERAL',
    lyrics: '벽! 벽! 벽! (반복)\n수비 벽 세워라!\n우리 팀 지킨다!\n벽! 벽! 벽!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['신곡'],
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    title: '새 선수 입장 응원',
    category: 'EXTRATIME',
    lyrics: '환영합니다! (박수)\n환영합니다! (박수)\n새 선수 입장!\n함께 승리!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['쉬움'],
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    title: '우승 세레머니',
    category: 'GAMEOVER',
    lyrics: '우~ 승! 우~ 승!\nFC 서울! 우승!\n우~ 승! 우~ 승!\nFC 서울! 우승!',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['중요'],
    createdAt: '2024-01-01',
  },
];

export const mockPlayers: PlayerProfile[] = [
  {
    id: 'p1',
    backNumber: 1,
    name: '이범수',
    position: 'GK',
    thumbnailUrl: 'https://via.placeholder.com/150',
    cheerSongId: '1',
  },
  {
    id: 'p2',
    backNumber: 10,
    name: '박주영',
    position: 'FW',
    thumbnailUrl: 'https://via.placeholder.com/150',
    cheerSongId: '2',
  },
  {
    id: 'p3',
    backNumber: 7,
    name: '기성용',
    position: 'MF',
    thumbnailUrl: 'https://via.placeholder.com/150',
    cheerSongId: '1',
  },
  {
    id: 'p4',
    backNumber: 4,
    name: '김진현',
    position: 'DF',
    thumbnailUrl: 'https://via.placeholder.com/150',
    cheerSongId: '3',
  },
];

export const categoryNames = {
  GOAL: '득점',
  GAMEOVER: '경기종료',
  EXTRATIME: '추가시간',
  GENERAL: '일반',
  PLAYER_ENTRY: '선수단 입장',
  VICTORY: '승리 확정',
  SETPIECE: '세트피스 응원',
};

export const positionNames = {
  GK: '골키퍼',
  DF: '수비수',
  MF: '미드필더',
  FW: '공격수',
};