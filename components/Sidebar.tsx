import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardCheck, 
  History, 
  LineChart, 
  Settings
} from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'Job Clips', href: '/jobs' },
  { icon: Users, label: 'Applicants', href: '/applicants' },
  { icon: ClipboardCheck, label: 'Match Results', href: '/screening-results' },
  { icon: History, label: 'Screening History', href: '/screening-history' },
  { icon: LineChart, label: 'Analytics', href: '/candidate-insights' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="relative w-72 flex-shrink-0 bg-black border-r border-[#E5D4B6]/10 flex flex-col h-screen font-sans overflow-hidden group/sidebar transition-all duration-700 z-20">
      
      <div className="relative z-10 p-8 pt-10">
        <Logo />
        <div className="h-1 w-8 bg-bora-accent mt-4 rounded-full opacity-30" />
      </div>

      <nav className="relative z-10 flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? 'bg-bora-accent text-black shadow-lg translate-x-1 ring-1 ring-bora-accent/20' 
                  : 'text-[#E5D4B6]/50 hover:bg-bora-accent/5 hover:text-bora-accent hover:ring-1 hover:ring-[#E5D4B6]/10'
              }`}
            >
              <item.icon className={`transition-all duration-500 relative z-10 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 group-hover:rotate-6'}`} size={20} />
              <span className={`text-sm tracking-tight uppercase font-black transition-all duration-500 relative z-10 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 p-6">
        <div className="bg-black rounded-[2rem] p-6 border border-[#E5D4B6]/10 shadow-2xl relative overflow-hidden group/quota transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
          <p className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] mb-3">CV Analysis Used</p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-black text-bora-accent tracking-tighter">65%</span>
            <span className="text-[10px] font-bold text-[#E5D4B6]/40">650 / 1000</span>
          </div>
          <div className="h-1.5 w-full bg-[#E5D4B6]/10 rounded-full overflow-hidden">
            <div className="h-full bg-bora-accent w-[65%] rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
