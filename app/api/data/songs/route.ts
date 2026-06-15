import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'songs.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const songs = JSON.parse(fileData);
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error reading songs.json:', error);
    return NextResponse.json([], { status: 500 });
  }
}