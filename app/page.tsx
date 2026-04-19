import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <Logo />
      <h1 className="text-4xl md:text-6xl font-black text-bora-accent mb-6 text-center tracking-tighter">
        BORA AI Recruitment
      </h1>
      <p className="text-xl font-medium text-[#E5D4B6]/60 mb-12 text-center max-w-2xl">
        The easiest way to analyze CVs and find the perfect candidates for your team.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link 
          href="/login" 
          className="flex-1 bg-bora-accent text-black font-black py-5 px-8 text-sm rounded-xl text-center hover:bg-[#d6c3a2] transition-all active:scale-[0.98] uppercase tracking-widest shadow-xl"
        >
          Sign In
        </Link>
        <Link 
          href="/signup" 
          className="flex-1 bg-transparent border-2 border-[#E5D4B6]/20 text-[#E5D4B6] font-black py-5 px-8 text-sm rounded-xl text-center hover:border-bora-accent/50 transition-all active:scale-[0.98] uppercase tracking-widest"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
