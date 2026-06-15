'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import Button from '@/components/common/Button';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      setError('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-suwon-bgDark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-suwon-cardDark rounded-card p-8 border-2 border-suwon-red/30 shadow-xl">
          <div className="text-center mb-6">
            <Lock size={48} className="mx-auto text-suwon-red mb-4" />
            <h1 className="text-h1 text-suwon-textPrimary mb-2">어드민 로그인</h1>
            <p className="text-body2 text-suwon-textSecondary">관리자 전용 페이지입니다</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-body2 text-suwon-textPrimary mb-2">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-suwon-navy/50 border-2 border-suwon-red/30 rounded-button text-suwon-textPrimary focus:outline-none focus:border-suwon-red"
                placeholder="비밀번호 입력"
              />
            </div>

            {error && (
              <p className="text-caption text-red-500">{error}</p>
            )}

            <Button variant="primary" size="lg" fullWidth type="submit">
              로그인
            </Button>
          </form>

          <p className="text-caption text-suwon-textSecondary text-center mt-6">
            기본 비밀번호: admin123
          </p>
        </div>
      </div>
    </div>
  );
}