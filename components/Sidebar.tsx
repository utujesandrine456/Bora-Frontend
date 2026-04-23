'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  History,
  Settings,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';


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

  const handleLogout = () => {
    authApi.logout();
    toast.success('Signed out successfully');
    router.push('/auth/login');
  };

  const appRoutes = [
    '/dashboard', '/jobs', '/applicants', '/screening', '/insights', '/settings', '/screening-history', '/notifications'
  ];
  const isAppRoute = appRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  const [user, setUser] = React.useState<{ name: string; role: string; photo?: string } | null>(null);

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            // Bridge id and _id naming mismatch
            const stabilizedUser = {
              ...parsed,
              id: parsed.id || parsed._id
            };
            setUser(stabilizedUser);
          } catch (_e) {
            // ignore
          }
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
<<<<<<< HEAD
        const storedUser = localStorage.getItem('user');
        const role = storedUser ? JSON.parse(storedUser).role?.toLowerCase() : 'admin';
        router.push(role === 'candidate' ? '/candidate/dashboard' : '/dashboard');
=======
        router.push('/dashboard');
>>>>>>> ff9f51be1fc4b1ba5da7128962c8900a9e0c0f68
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

  const menuItems = adminMenuItems;

  return (
    <div className="w-[280px] min-h-screen h-full bg-dark flex flex-col p-6 border-r border-cream/20 sticky top-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-full flex items-center justify-center transition-transform hover:rotate-12 duration-500 overflow-hidden shadow-lg shadow-cream/5">
          {user?.photo ? (
            <img src={user.photo} alt="App Logo" className="w-full h-full object-cover" />
          ) : (
            <span className="text-cream text-[8px] font-black tracking-tighter">BORA</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-black text-cream leading-none tracking-tight">BORA</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.name === 'Jobs' && (pathname === '/' || pathname === '/jobs')) ||
            (item.name === 'Screening Results' && (pathname === '/screening' || pathname.startsWith('/screening/results')));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-md transition-all duration-300 group cursor-pointer ${isActive
                ? 'bg-cream text-dark font-bold'
                : 'text-cream/60 hover:bg-cream/10 hover:text-cream'
                }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-dark' : 'text-cream/40 group-hover:text-cream'}`} />
              <span className={`text-[15px] ${isActive ? 'font-bold text-lg' : 'font-medium text-md'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-6 border-t border-cream/10 pb-4">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-12 h-12 rounded-lg bg-cream/10 border border-cream/20 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            {user?.photo ? (
              <img src={user.photo} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-cream font-black text-sm">{getInitials(displayName)}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-cream truncate">{displayName}</span>
            <span className="text-[10px] font-bold text-cream/40 uppercase tracking-widest">{user?.role || 'User'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3.5 rounded-md bg-cream text-dark hover:bg-cream hover:text-dark/80 transition-all w-full group cursor-pointer text-md font-semibold shadow-md"
        >
          <History className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
