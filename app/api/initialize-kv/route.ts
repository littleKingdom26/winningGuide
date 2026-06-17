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
    
    const songsPath = path.join(process.cwd(), 'public/data/songs.json');
    const playersPath = path.join(process.cwd(), 'public/data/players.json');
    
    const songsContent = await fs.readFile(songsPath, 'utf-8');
    const playersContent = await fs.readFile(playersPath, 'utf-8');
    
    const songs = JSON.parse(songsContent);
    const players = JSON.parse(playersContent);
    
    // Redis에 저장
    await redis.set('songs.json', JSON.stringify(songs));
    await redis.set('players.json', JSON.stringify(players));
    
    // 연결 종료
    redis.quit();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Redis initialized successfully',
      data: {
        songs: songs.length,
        players: players.length
      }
    });
  } catch (error) {
    console.error('Error initializing Redis:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize Redis' 
    }, { status: 500 });
  }
}