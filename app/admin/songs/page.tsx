import { Suspense } from 'react';
import SongsAdminPageContent from './SongsAdminPageContent';

export default function SongsAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-body2 text-suwon-textSecondary">로딩 중...</div>
      </div>
    }>
      <SongsAdminPageContent />
    </Suspense>
  );
}