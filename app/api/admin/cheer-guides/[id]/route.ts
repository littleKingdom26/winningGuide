import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataManager';
import { CheerGuide } from '@/constants/types';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    let guides = await readData<CheerGuide>('cheer-guides.json');
    guides = guides.filter(g => g.id !== id);
    
    await writeData('cheer-guides.json', guides);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json({ error: 'Failed to delete guide' }, { status: 500 });
  }
}