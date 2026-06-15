import fs from 'fs/promises';
import path from 'path';

// 데이터 파일 경로 설정
const DATA_DIR = path.join(process.cwd(), 'data');

// 데이터 디렉토리가 없으면 생성
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    // 먼저 data 디렉토리 확인
    const dataPath = path.join(DATA_DIR, filename);
    try {
      const fileContent = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch {
      // data 디렉토리에 없으면 public/data에서 읽기
      const publicPath = path.join(process.cwd(), 'public/data', filename);
      const fileContent = await fs.readFile(publicPath, 'utf-8');
      const data = JSON.parse(fileContent);
      // data 디렉토리에 복사
      await ensureDataDir();
      await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
      return data;
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}