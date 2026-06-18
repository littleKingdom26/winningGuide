'use server';

import { readData, writeData } from '@/lib/dataManager';
import { CheerSong, PlayerProfile, CheerGuide, GameSchedule, GoogleCalendarConfig } from '@/constants/types';
import { revalidatePath } from 'next/cache';

// 응원가 관리 Actions
export async function getSongs(): Promise<CheerSong[]> {
  return await readData<CheerSong>('songs.json');
}

export async function getSong(id: string): Promise<CheerSong | null> {
  const songs = await readData<CheerSong>('songs.json');
  return songs.find(s => s.id === id) || null;
}

export async function createSong(songData: Omit<CheerSong, 'id' | 'createdAt'>): Promise<CheerSong> {
  const songs = await readData<CheerSong>('songs.json');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const newSong: CheerSong = {
    ...songData,
    id: Date.now().toString(),
    createdAt: `${year}.${month}.${day}`,
  };
  songs.push(newSong);
  
  try {
    await writeData('songs.json', songs);
    revalidatePath('/admin/songs');
    revalidatePath('/');
    revalidatePath('/situation');
  } catch (error) {
    console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
    // 에러가 발생해도 계속 진행 (개발 환경에서는 계속 작동)
  }
  
  return newSong;
}

export async function updateSong(id: string, songData: Partial<CheerSong>): Promise<void> {
  const songs = await readData<CheerSong>('songs.json');
  const index = songs.findIndex(s => s.id === id);
  if (index !== -1) {
    songs[index] = { ...songs[index], ...songData };
    try {
      await writeData('songs.json', songs);
      revalidatePath('/admin/songs');
      revalidatePath(`/situation/${id}`);
    } catch (error) {
      console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
    }
  }
}

export async function deleteSong(id: string): Promise<void> {
  const songs = await readData<CheerSong>('songs.json');
  const filtered = songs.filter(s => s.id !== id);
  try {
    await writeData('songs.json', filtered);
    revalidatePath('/admin/songs');
    revalidatePath('/');
    revalidatePath('/situation');
  } catch (error) {
    console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
  }
}

// 선수 관리 Actions
export async function getPlayers(): Promise<PlayerProfile[]> {
  return await readData<PlayerProfile>('players.json');
}

export async function getPlayer(id: string): Promise<PlayerProfile | null> {
  const players = await readData<PlayerProfile>('players.json');
  return players.find(p => p.id === id) || null;
}

export async function createPlayer(playerData: Omit<PlayerProfile, 'id'>): Promise<PlayerProfile> {
  const players = await readData<PlayerProfile>('players.json');
  const newPlayer: PlayerProfile = {
    ...playerData,
    id: `p${Date.now()}`,
  };
  players.push(newPlayer);
  try {
    await writeData('players.json', players);
    revalidatePath('/admin/players');
    revalidatePath('/player');
  } catch (error) {
    console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
  }
  return newPlayer;
}

export async function updatePlayer(id: string, playerData: Partial<PlayerProfile>): Promise<void> {
  const players = await readData<PlayerProfile>('players.json');
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index] = { ...players[index], ...playerData };
    try {
      await writeData('players.json', players);
      revalidatePath('/admin/players');
      revalidatePath(`/player/${id}`);
    } catch (error) {
      console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
    }
  }
}

export async function deletePlayer(id: string): Promise<void> {
  const players = await readData<PlayerProfile>('players.json');
  const filtered = players.filter(p => p.id !== id);
  try {
    await writeData('players.json', filtered);
    revalidatePath('/admin/players');
    revalidatePath('/player');
  } catch (error) {
    console.error('Warning: Could not persist data. Changes will not be saved after reload.', error);
  }
}

// 통계 Actions
export async function getStats() {
  const songs = await readData<CheerSong>('songs.json');
  const players = await readData<PlayerProfile>('players.json');
  
  return {
    totalSongs: songs.length,
    totalPlayers: players.length,
    songsByCategory: songs.reduce((acc, song) => {
      acc[song.category] = (acc[song.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentSongs: songs.slice(-5).reverse(),
  };
}