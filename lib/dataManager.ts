import fs from 'fs/promises';
import path from 'path';
import Redis from 'ioredis';

// Redis 클라이언트 초기화
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redis) {
    return redis;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('REDIS_URL environment variable not set, using file system only');
    return null;
  }

  try {
    redis = new Redis(redisUrl);
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    return redis;
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    return null;
  }
}

const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public/data');

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    // Redis 클라이언트 가져오기
    const client = getRedisClient();
    
    if (client) {
      // Redis에서 읽기 시도
      const redisData = await client.get(filename);
      if (redisData) {
        try {
          const parsed = JSON.parse(redisData);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (parseError) {
          console.warn('Failed to parse Redis data, falling back to file:', parseError);
        }
      }
    }
    
    // Redis에 없으면 public/data에서 읽기
    const publicPath = path.join(PUBLIC_DATA_DIR, filename);
    const fileContent = await fs.readFile(publicPath, 'utf-8');
    const parsedData = JSON.parse(fileContent);
    
    // Redis에 저장 (다음번에 빠르게 읽기)
    if (client) {
      try {
        await client.set(filename, JSON.stringify(parsedData));
      } catch (kvError) {
        console.warn('Could not save to Redis, using file cache:', kvError);
      }
    }
    
    return parsedData;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  try {
    // Redis에 저장 (우선)
    const client = getRedisClient();
    if (client) {
      await client.set(filename, JSON.stringify(data));
    }
    
    // public/data에도 동기화 (백업)
    const publicPath = path.join(PUBLIC_DATA_DIR, filename);
    await fs.writeFile(publicPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;
    
    if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
      // 읽기 전용 파일 시스템 - Redis에는 이미 저장되었으므로 OK
      console.warn(`Could not write to file system, but data is saved in Redis`);
    } else {
      console.error(`Error writing ${filename}:`, error);
      throw error;
    }
  }
}