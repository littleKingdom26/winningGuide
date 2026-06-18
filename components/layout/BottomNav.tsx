'use client';

import { Home, LayoutList, BookOpen, Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: '홈', path: '/' },
  { icon: LayoutList, label: '응원가', path: '/situation' },
  { icon: BookOpen, label: '응원팁', path: '/cheer-guide' },
  { icon: Calendar, label: '경기일정', path: '/match-schedule' },
  { icon: Search, label: '검색', path: '/search' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 max-w-md w-full bg-suwon-cardDark border-t border-suwon-blue/20 h-16 flex justify-around items-center z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-all hover:bg-suwon-red/10 ${
              isActive ? 'text-suwon-red' : 'text-suwon-textSecondary'
            }`}
          >
            <Icon size={24} className={isActive ? 'scale-110' : ''} />
            <span className="text-caption mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}