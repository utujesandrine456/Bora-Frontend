'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  History,
  Settings,
  LogOut,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Jobs', icon: Briefcase, href: '/jobs' },
  { name: 'Applicants', icon: Users, href: '/applicants' },
  { name: 'Screening Results', icon: ClipboardCheck, href: '/screening' },
  { name: 'Screening History', icon: History, href: '/screening-history' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<{
    name: string;
    role: string;
    photo?: string;
  } | null>(null);

  const appRoutes = [
    '/dashboard',
    '/jobs',
    '/applicants',
    '/screening',
    '/settings',
    '/screening-history',
    '/notifications'
  ];

  const isAppRoute = appRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser({
              ...parsed,
              id: parsed.id || parsed._id
            });
          } catch {}
        }
      }
    };

    loadUser();
    window.addEventListener('user-updated', loadUser);

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const isAuthPage = pathname.startsWith('/auth/');

      if (!token && isAppRoute) {
        router.push('/auth/login');
      } else if (token && isAuthPage) {
        const storedUser = localStorage.getItem('user');
        const role = storedUser
          ? JSON.parse(storedUser).role?.toLowerCase()
          : 'admin';

        router.push(
          role === 'candidate'
            ? '/candidate/dashboard'
            : '/dashboard'
        );
      }
    }

    return () => {
      window.removeEventListener('user-updated', loadUser);
    };
  }, [isAppRoute, pathname, router]);

  const role = user?.role?.toLowerCase() || 'admin';
  const displayName = user?.name || 'User';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isAppRoute) return null;

  return (
    <div className="w-[280px] min-h-screen bg-dark flex flex-col p-6 border-r border-cream/20 sticky top-0">
      
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-full flex items-center justify-center overflow-hidden">
          {user?.photo ? (
            <img src={user.photo} className="w-full h-full object-cover" />
          ) : (
            <span className="text-cream text-[8px] font-black">BORA</span>
          )}
        </div>
        <h1 className="text-2xl font-black text-cream">BORA</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {adminMenuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.name === 'Jobs' && (pathname === '/' || pathname === '/jobs')) ||
            (item.name === 'Screening Results' &&
              (pathname === '/screening' ||
                pathname.startsWith('/screening/results')));

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-md ${
                isActive
                  ? 'bg-cream text-dark font-bold'
                  : 'text-cream/60 hover:bg-cream/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="mt-auto pt-6 border-t border-cream/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded bg-cream/10 flex items-center justify-center">
            {user?.photo ? (
              <img src={user.photo} className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(displayName)}</span>
            )}
          </div>
          <div>
            <div className="text-sm text-cream">{displayName}</div>
            <div className="text-xs text-cream/40">{role}</div>
          </div>
        </div>

        <button
          onClick={async () => await authApi.logout()}
          className="w-full flex items-center gap-2 px-4 py-3 bg-cream text-dark rounded"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}