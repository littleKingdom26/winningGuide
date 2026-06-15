import { Suspense } from 'react';
import SongFormPageContent from './SongFormPageContent';

export default function SongFormPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-body2 text-suwon-textSecondary">로딩 중...</div>
      </div>
    }>
      <SongFormPageContent />
    </Suspense>
  );
}