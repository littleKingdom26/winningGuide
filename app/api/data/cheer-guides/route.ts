import { NextResponse } from 'next/server';
import { readData } from '@/lib/dataManager';
import { CheerGuide } from '@/constants/types';

export async function GET() {
  try {
    const guides = await readData<CheerGuide>('cheer-guides.json');
    return NextResponse.json(guides);
  } catch (error) {
    console.error('Error reading cheer guides data:', error);
    return NextResponse.json([], { status: 500 });
  }
}