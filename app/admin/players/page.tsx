import { Suspense } from 'react';
import PlayersAdminPageContent from './PlayersAdminPageContent';

export default function PlayersAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-body2 text-suwon-textSecondary">로딩 중...</div>
      </div>
    }>
      <PlayersAdminPageContent />
    </Suspense>
  );
}