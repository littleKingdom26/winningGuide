import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

let backupInitialized = false;

export async function backupFromRedis() {
  // 이미 초기화되었으면 스킵
  if (backupInitialized) {
    return;
  }

  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      console.warn('⚠️ REDIS_URL not set, skipping Redis backup');
      backupInitialized = true;
      return;
    }

    const redis = new Redis(redisUrl);
    
    // 연결 테스트
    await redis.ping();
    console.log('🔗 Connected to Redis for backup');
    
    // songs.json 백업
    try {
      const songsData = await redis.get('songs.json');
      if (songsData) {
        const songs = JSON.parse(songsData);
        const songsPath = path.join(process.cwd(), 'public/data/songs.json');
        await fs.writeFile(songsPath, JSON.stringify(songs, null, 2), 'utf-8');
        console.log(`✅ Backuped songs.json with ${songs.length} items from Redis`);
      } else {
        console.log('⚠️ No songs data found in Redis');
      }
    } catch (error) {
      console.error('❌ Failed to backup songs.json:', error);
    }
    
    // players.json 백업
    try {
      const playersData = await redis.get('players.json');
      if (playersData) {
        const players = JSON.parse(playersData);
        const playersPath = path.join(process.cwd(), 'public/data/players.json');
        await fs.writeFile(playersPath, JSON.stringify(players, null, 2), 'utf-8');
        console.log(`✅ Backuped players.json with ${players.length} items from Redis`);
      } else {
        console.log('⚠️ No players data found in Redis');
      }
    } catch (error) {
      console.error('❌ Failed to backup players.json:', error);
    }
    
    redis.quit();
    backupInitialized = true;
    console.log('🔄 Redis backup process completed');
  } catch (error) {
    console.error('❌ Redis backup initialization failed:', error);
    backupInitialized = true; // 실패해도 다시 시도하지 않도록 설정
  }
}