import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { CheerGuide } from '@/constants/types';

export async function POST(request: Request) {
  try {
    const guideData = await request.json();
    
    const guides = await readData<CheerGuide>('cheer-guides.json');
    guides.push(guideData);
    
    await writeData('cheer-guides.json', guides);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json({ error: 'Failed to create guide' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const guideData = await request.json();
    
    let guides = await readData<CheerGuide>('cheer-guides.json');
    guides = guides.map(g => g.id === guideData.id ? guideData : g);
    
    await writeData('cheer-guides.json', guides);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json({ error: 'Failed to update guide' }, { status: 500 });
  }
}