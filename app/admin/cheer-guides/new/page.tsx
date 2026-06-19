import { Suspense } from 'react';
import CheerGuideFormContent from './CheerGuideFormContent';

export default function CheerGuideFormPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div>로딩 중...</div>}>
        <CheerGuideFormContent />
      </Suspense>
    </div>
  );
}
