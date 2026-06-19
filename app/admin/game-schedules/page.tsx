import { readData } from '@/lib/dataManager';
import { GameSchedule, GoogleCalendarConfig } from '@/constants/types';
import GameSchedulesAdminContent from './GameSchedulesAdminContent';

export default async function GameSchedulesAdminWrapper() {
  const [schedules, calendars] = await Promise.all([
    readData<GameSchedule>('game-schedules.json'),
    readData<GoogleCalendarConfig>('google-calendars.json'),
  ]);

  return (
    <GameSchedulesAdminContent
      initialSchedules={schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
      initialCalendars={calendars}
    />
  );
}
