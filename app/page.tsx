import { Search, BookOpen, Calendar, ExternalLink, Home as HomeIcon, Car, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/common/Card';
import { readData } from '@/lib/dataManager';
import { CheerSong, CheerGuide, GameSchedule, GameStatus, HomeAway } from '@/constants/types';

export default async function Home() {
  const songs = await readData<CheerSong>('songs.json');
  const guides = await readData<CheerGuide>('cheer-guides.json');
  const schedules = await readData<GameSchedule>('game-schedules.json');
  
  const hotCheerSongs = songs.slice(0, 3);
  const featuredGuides = guides.slice(0, 2);
  
  // 다가오는 경기 찾기
  const now = new Date();
  const upcomingMatch = [...schedules]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .find(s => new Date(s.date) >= now);

  // 경기 상태 표시 함수
  const getStatusDisplay = (status: GameStatus, homeScore?: number, awayScore?: number) => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-suwon-red rounded-full animate-pulse" />
            <span className="text-caption text-suwon-red font-bold">LIVE</span>
            <span className="text-h3 text-suwon-textPrimary font-bold">
              {homeScore} : {awayScore}
            </span>
          </div>
        );
      case 'finished':
        return (
          <span className="text-h3 text-suwon-textPrimary font-bold">
            {homeScore} : {awayScore}
          </span>
        );
      default:
        return (
          <span className="text-caption text-suwon-blue">예정</span>
        );
    }
  };

  // 홈/어웨이 표시 함수
  const getHomeAwayDisplay = (homeAway: HomeAway, opponent: string) => {
    if (homeAway === 'home') {
      return (
        <div className="flex items-center gap-2">
          <HomeIcon className="w-4 h-4 text-suwon-red" />
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-suwon-blue" />
          <span className="text-body1 text-suwon-textPrimary font-bold">{opponent}</span>
        </div>
      );
    }
  };

  // 상대팀명 추출 (라운드/대회명 제거)
  const extractOpponentName = (opponent: string): string => {
    // 라운드 패턴 제거 (13R, 1R, 2R 등)
    let cleaned = opponent.replace(/^\d+R\s*/, '');
    // 대회명 패턴 제거 (코라이컵, w 코라이컵, FA컵 등)
    cleaned = cleaned.replace(/^(?:w\s*)?(?:코라이컵|FA컵|한국은행컵)\s*/i, '');
    return cleaned.trim();
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };
  
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

      {/* 다가오는 경기 */}
      {upcomingMatch && (
        <Link href="/match-schedule" className="block">
          <Card className="p-4 border-2 border-suwon-red/30 cursor-pointer hover:bg-suwon-cardDark/80 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-suwon-red rounded-full animate-pulse" />
              <div className="flex items-center gap-2">
                <h2 className="text-h2 text-suwon-textPrimary font-bold">다가오는 경기</h2>
                {upcomingMatch.calendarName && (
                  <span className="text-caption text-suwon-textSecondary">· {upcomingMatch.calendarName}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="mb-1">
                  {getHomeAwayDisplay(upcomingMatch.homeAway, extractOpponentName(upcomingMatch.opponent))}
                </div>
              </div>
              {getStatusDisplay(upcomingMatch.status, upcomingMatch.homeScore, upcomingMatch.awayScore)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                <Clock className="w-4 h-4" />
                <span>{formatDate(upcomingMatch.date)} {upcomingMatch.time}</span>
              </div>
              <div className="flex items-center gap-2 text-body2 text-suwon-textSecondary">
                <MapPin className="w-4 h-4" />
                <span>{upcomingMatch.venue}</span>
              </div>
            </div>
          </Card>
        </Link>
      )}

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
