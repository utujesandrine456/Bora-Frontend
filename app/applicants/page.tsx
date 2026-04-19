'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CandidateCard } from '@/components/CandidateCard';
import { Filter, Users, Bookmark } from 'lucide-react';

const candidates = [
  { 
    name: 'Alex Johnson', 
    skills: ['React', 'TypeScript', 'Node.js'], 
    experience: '6 years', 
    education: 'BS Computer Science' 
  },
  { 
    name: 'Sarah Williams', 
    skills: ['React', 'JavaScript', 'CSS'], 
    experience: '4 years', 
    education: 'BS Software Engineering' 
  },
  { 
    name: 'Michael Chen', 
    skills: ['Vue', 'TypeScript', 'React'], 
    experience: '7 years', 
    education: 'MS Computer Science' 
  },
  { 
    name: 'Emma Davis', 
    skills: ['React', 'Redux', 'GraphQL'], 
    experience: '5 years', 
    education: 'BS Information Technology' 
  },
];

export default function ApplicantsPage() {
  const [activeTab, setActiveTab] = useState('platform');

  return (
    <DashboardLayout 
      title="Applicants" 
      subtitle="Review and manage all job applicants. Find the best candidates for your team easily by analyzing their CVs."
    >
      <div className="bg-black backdrop-blur-xl rounded-[3.5rem] p-6 border border-[#E5D4B6]/10 overflow-hidden ring-1 ring-[#E5D4B6]/5 animate-in fade-in zoom-in duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
        {/* Tabs */}
        <div className="flex border-b border-[#E5D4B6]/10 px-8">
          <button 
            onClick={() => setActiveTab('platform')}
            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${
              activeTab === 'platform' ? 'text-bora-accent' : 'text-[#E5D4B6]/40 hover:text-bora-accent'
            }`}
          >
            <span className="relative z-10 transition-transform group-hover:-translate-y-0.5 inline-block">Main List</span>
            {activeTab === 'platform' && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-bora-accent rounded-t-full shadow-[0_-5px_20px_rgba(229,212,182,0.4)]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('external')}
            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${
              activeTab === 'external' ? 'text-bora-accent' : 'text-[#E5D4B6]/40 hover:text-bora-accent'
            }`}
          >
            <span className="relative z-10 transition-transform group-hover:-translate-y-0.5 inline-block">Imported</span>
            {activeTab === 'external' && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-bora-accent rounded-t-full shadow-[0_-5px_20px_rgba(229,212,182,0.4)]" />
            )}
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 animate-in fade-in zoom-in duration-1000">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div className="flex bg-[#111111] p-1.5 rounded-2xl w-fit border border-[#E5D4B6]/10">
              <button className="px-6 py-2.5 bg-bora-accent text-black text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg">Main List</button>
              <button className="px-6 py-2.5 text-[#E5D4B6]/40 text-[11px] font-black uppercase tracking-widest hover:text-bora-accent transition-all">Imported</button>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3 bg-black border border-[#E5D4B6]/10 px-5 py-2.5 rounded-xl shadow-sm">
                  <Users size={16} className="text-bora-accent" />
                  <span className="text-[11px] font-black text-bora-accent uppercase tracking-widest">{candidates.length} Total Applicants</span>
               </div>
               <button className="flex items-center gap-2 px-5 py-2.5 bg-black border border-[#E5D4B6]/10 rounded-xl text-[10px] font-black text-[#E5D4B6]/60 hover:text-bora-accent hover:border-bora-accent/30 transition-all uppercase tracking-widest">
                  <Bookmark size={14} />
                  Filters
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {candidates.map((applicant, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-6 duration-1000" style={{ animationDelay: `${index * 100}ms` }}>
                <CandidateCard {...applicant} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
