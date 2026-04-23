"use client";

import React, { useState, useEffect, Suspense } from 'react';
import {
  FileText,
  Workflow,
  BarChart3,
  ShieldCheck,
  Zap,
  BrainCircuit
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import { useRouter, useSearchParams } from 'next/navigation';

const STEPS = [
  { id: 1, name: 'Initializing Neural Engine', icon: BrainCircuit, duration: 2000 },
  { id: 2, name: 'Parsing Candidate Resumes', icon: FileText, duration: 3000 },
  { id: 3, name: 'Cross-Referencing Skills', icon: Workflow, duration: 3500 },
  { id: 4, name: 'Predicting Job Fit Match', icon: Zap, duration: 2500 },
  { id: 5, name: 'Finalizing AI Insights', icon: BarChart3, duration: 2000 },
];

function ScreeningLoadingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    const totalDuration = STEPS.reduce((acc, step) => acc + step.duration, 0);
    const interval = 50;
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    let stepTimeout: NodeJS.Timeout;
    const runSteps = (index: number) => {
      if (index < STEPS.length) {
        setCurrentStep(index);
        stepTimeout = setTimeout(() => runSteps(index + 1), STEPS[index].duration);
      } else {
        // Redirection logic when steps are done
        setTimeout(() => {
          if (jobId) {
            router.push(`/screening/results?jobId=${jobId}`);
          } else {
            router.push('/screening-history');
          }
        }, 1000);
      }
    };

    runSteps(0);

    return () => {
      clearInterval(timer);
      clearTimeout(stepTimeout);
    };
  }, [jobId, router]);

  return (
    <div className="flex flex-col h-full bg-dark text-cream min-h-screen overflow-hidden">
      <TopNav />

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">

          {/* Logo Animation */}
          <div className="relative mb-16">
            {/* Circular Progress Ring & Orbit */}
            <div className="absolute inset-[-40px] flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="stroke-cream/5"
                  strokeWidth="0.5"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="stroke-cream/40 transition-all duration-500 ease-linear"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * progress) / 100}
                />
                {/* Orbit Particle */}
                <circle
                  cx={50 + 48 * Math.sin((progress / 100) * 2 * Math.PI)}
                  cy={50 - 48 * Math.cos((progress / 100) * 2 * Math.PI)}
                  r="1.5"
                  className="fill-cream shadow-[0_0_8px_rgba(218,197,167,0.8)] transition-all duration-500 ease-linear"
                />
              </svg>
            </div>

            <div className="absolute inset-[-20px] border border-cream/10 rounded-full animate-spin [animation-duration:10s]" />
            <div className="absolute inset-[-10px] border border-cream/20 rounded-full border-t-cream/60 animate-spin [animation-duration:15s] [animation-direction:reverse]" />

            <div className="relative w-32 h-32 rounded-full p-1 bg-linear-to-b from-cream/30 to-transparent shadow-2xl overflow-hidden backdrop-blur-md">
              <div className="w-full h-full bg-dark rounded-full flex items-center justify-center overflow-hidden border border-cream/20">
                <img
                  src="/logo.png"
                  alt="BORA Logo"
                  className="w-20 h-20 object-contain animate-pulse"
                />
              </div>
            </div>

            <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-cream flex items-center justify-center shadow-lg shadow-cream/20 animate-bounce">
              <Zap className="w-4 h-4 text-dark" fill="currentColor" />
            </div>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-cream leading-none">
              AI <span className="text-cream/40 italic serif">Brain</span> Analysis
            </h1>
          </div>

          {/* Progress Section */}
          <Card className="w-full p-8 border-cream/10 bg-dark/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-cream/3 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                    {React.createElement(STEPS[currentStep].icon, { className: "w-5 h-5 text-cream" })}
                    <span className="text-lg font-semibold text-cream">{STEPS[currentStep].name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-cream">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-cream/5 rounded-full overflow-hidden border border-cream/10 p-[2px]">
                <div
                  className="h-full bg-cream rounded-full shadow-[0_0_15px_rgba(218,197,167,0.5)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {STEPS.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`h-1 rounded-full transition-all duration-1000 ${idx <= currentStep ? 'bg-cream' : 'bg-cream/10'
                      }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              Secure Data Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ScreeningLoadingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
        <p className="text-cream/40 font-bold tracking-widest text-sm uppercase">Preparing Engine...</p>
      </div>
    }>
      <ScreeningLoadingContent />
    </Suspense>
  );
}
