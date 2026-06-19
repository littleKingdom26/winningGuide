'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Music, Users, Home, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: '대시보드', path: '/admin' },
    { icon: Music, label: '응원가 관리', path: '/admin/songs' },
    { icon: Users, label: '선수 관리', path: '/admin/players' },
    { icon: BookOpen, label: '응원팁', path: '/admin/cheer-guides' },
    { icon: Calendar, label: '경기일정', path: '/admin/game-schedules' },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-suwon-bgDark">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-suwon-red to-suwon-navy backdrop-blur px-4 py-4 border-b border-suwon-red/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-h1 text-suwon-textPrimary font-bold">수원FC 어드민</h1>
            <Link 
              href="/" 
              className="text-caption text-suwon-textSecondary hover:text-suwon-red transition-colors border-l border-suwon-textSecondary/30 pl-4"
              title="프론트 홈으로 이동"
            >
              직관 응원 가이드
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" title="어드민 홈">
              <Home size={20} className="text-suwon-textPrimary cursor-pointer hover:text-suwon-red transition-colors" />
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-suwon-cardDark rounded-button hover:bg-suwon-red/20 transition-colors">
              <LogOut size={18} className="text-suwon-textPrimary" />
              <span className="text-caption text-suwon-textPrimary">로그아웃</span>
            </button>
          </div>
        </div>
      </nav>

      <nav className="bg-suwon-cardDark border-b border-suwon-red/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={item.label}
                  className={`flex items-center justify-center px-5 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-suwon-red text-suwon-red bg-suwon-red/10'
                      : 'border-transparent text-suwon-textSecondary hover:text-suwon-textPrimary hover:bg-suwon-red/5'
                  }`}
                >
                  <Icon size={20} />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}