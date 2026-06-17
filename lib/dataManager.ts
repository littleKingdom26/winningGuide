import fs from 'fs/promises';
import path from 'path';
import Redis from 'ioredis';

// Redis 클라이언트 초기화
let redis: Redis | null = null;
let redisConnectionChecked = false;
let redisAvailable = false;

async function checkRedisConnection(): Promise<boolean> {
  if (redisConnectionChecked && redisAvailable) {
    return true;
  }

  if (redisConnectionChecked && !redisAvailable) {
    return false;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn('REDIS_URL environment variable not set, using file system only');
    redisConnectionChecked = true;
    redisAvailable = false;
    return false;
  }

  try {
    redis = new Redis(redisUrl);
    
    // 연결 테스트
    await redis.ping();
    
    redis.on('error', (err) => {
      console.error('Redis connection error:', err);
      redisAvailable = false;
    });

    redisAvailable = true;
    redisConnectionChecked = true;
    console.log('✅ Redis connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    redis = null;
    redisAvailable = false;
    redisConnectionChecked = true;
    return false;
  }
}

function getRedisClient(): Redis | null {
  return redisAvailable ? redis : null;
}

const PUBLIC_DATA_DIR = path.join(process.cwd(), 'public/data');

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    // Redis 연결 확인 및 데이터 읽기 시도
    const redisConnected = await checkRedisConnection();
    const client = getRedisClient();
    
    if (client) {
      try {
        const redisData = await client.get(filename);
        if (redisData) {
          try {
            const parsed = JSON.parse(redisData);
            if (Array.isArray(parsed)) {
              console.log(`📖 Read ${filename} from Redis`);
              return parsed;
            }
          } catch (parseError) {
            console.warn('⚠️ Failed to parse Redis data, falling back to file:', parseError);
          }
        }
      } catch (redisError) {
        console.warn('⚠️ Redis read error, falling back to file:', redisError);
      }
    }
    
    // Redis에 없으면 public/data에서 읽기
    const publicPath = path.join(PUBLIC_DATA_DIR, filename);
    const fileContent = await fs.readFile(publicPath, 'utf-8');
    const parsedData = JSON.parse(fileContent);
    console.log(`📖 Read ${filename} from file system`);
    
    // Redis에 저장 (다음번에 빠르게 읽기)
    if (client) {
      try {
        await client.set(filename, JSON.stringify(parsedData));
        console.log(`💾 Cached ${filename} to Redis`);
      } catch (kvError) {
        console.warn('⚠️ Could not save to Redis:', kvError);
      }
    }
    
    return parsedData;
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  try {
    // Redis에 저장 (우선)
    const redisConnected = await checkRedisConnection();
    const client = getRedisClient();
    
    if (client) {
      try {
        await client.set(filename, JSON.stringify(data));
        console.log(`💾 Saved ${filename} to Redis`);
      } catch (redisError) {
        console.warn('⚠️ Redis write error:', redisError);
      }
    }
    
    // public/data에도 동기화 (백업)
    const publicPath = path.join(PUBLIC_DATA_DIR, filename);
    await fs.writeFile(publicPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 Saved ${filename} to file system`);
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;
    
    if (fsError.code === 'EROFS' || fsError.code === 'EACCES') {
      // 읽기 전용 파일 시스템 - Redis에는 이미 저장되었으므로 OK
      console.warn(`⚠️ Could not write to file system, but data is saved in Redis`);
    } else {
      console.error(`❌ Error writing ${filename}:`, error);
      throw error;
    }
  }
}
