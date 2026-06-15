import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const players = JSON.parse(fileData);
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error reading players.json:', error);
    return NextResponse.json([], { status: 500 });
  }
}