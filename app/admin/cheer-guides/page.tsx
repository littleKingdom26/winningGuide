import { readData } from '@/lib/dataManager';
import { CheerGuide } from '@/constants/types';
import CheerGuidesAdminContent from './CheerGuidesAdminContent';

export default async function CheerGuidesAdminPage() {
  const guides = await readData<CheerGuide>('cheer-guides.json');
  
  return (
    <div className="p-6">
      <CheerGuidesAdminContent 
        initialGuides={guides.sort((a, b) => a.order - b.order)} 
      />
    </div>
  );
}