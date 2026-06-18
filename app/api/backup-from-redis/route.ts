import fs from 'fs/promises';
import path from 'path';
import Redis from 'ioredis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Redis 클라이언트 초기화
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'REDIS_URL environment variable not set' 
      }, { status: 500 });
    }

    const redis = new Redis(redisUrl);
    
    // Redis에서 songs.json 데이터 읽기
    const songsData = await redis.get('songs.json');
    const playersData = await redis.get('players.json');
    
    let backupResults: any = {
      songs: { success: false, count: 0 },
      players: { success: false, count: 0 }
    };
    
    // songs.json 백업
    if (songsData) {
      try {
        const songs = JSON.parse(songsData);
        const songsPath = path.join(process.cwd(), 'public/data/songs.json');
        await fs.writeFile(songsPath, JSON.stringify(songs, null, 2), 'utf-8');
        backupResults.songs = { success: true, count: songs.length };
        console.log(`✅ Backuped songs.json with ${songs.length} items`);
      } catch (error) {
        console.error('❌ Failed to backup songs.json:', error);
        backupResults.songs = { success: false, error: 'Failed to parse or write songs data' };
      }
    } else {
      console.warn('⚠️ No songs.json found in Redis');
      backupResults.songs = { success: false, error: 'No songs data found in Redis' };
    }
    
    // players.json 백업
    if (playersData) {
      try {
        const players = JSON.parse(playersData);
        const playersPath = path.join(process.cwd(), 'public/data/players.json');
        await fs.writeFile(playersPath, JSON.stringify(players, null, 2), 'utf-8');
        backupResults.players = { success: true, count: players.length };
        console.log(`✅ Backuped players.json with ${players.length} items`);
      } catch (error) {
        console.error('❌ Failed to backup players.json:', error);
        backupResults.players = { success: false, error: 'Failed to parse or write players data' };
      }
    } else {
      console.warn('⚠️ No players.json found in Redis');
      backupResults.players = { success: false, error: 'No players data found in Redis' };
    }
    
    // 연결 종료
    redis.quit();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Backup from Redis completed',
      data: backupResults
    });
  } catch (error) {
    console.error('Error backing up from Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to backup from Redis' 
    }, { status: 500 });
  }
}