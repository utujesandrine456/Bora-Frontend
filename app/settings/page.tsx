'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { User, Mail, Briefcase, Phone, Building2, MapPin, Globe, Save, Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your personal profile and company information details."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-black">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="bg-black backdrop-blur-2xl rounded-[2.5rem] p-8 border border-[#E5D4B6]/10 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-bora-accent/10 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-black border border-[#E5D4B6]/20 rounded-2xl mx-auto flex items-center justify-center text-bora-accent shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500 ring-4 ring-bora-accent/5">
                <User size={36} />
              </div>
              <h3 className="text-lg font-black text-bora-accent tracking-tighter mb-0.5">Sarah Chen</h3>
              <p className="text-[9px] font-black text-[#E5D4B6]/50 uppercase tracking-[0.2em]">HR Manager at BORA AI</p>
              
              <div className="mt-8 grid grid-cols-2 gap-3">
                 <div className="bg-black p-3 rounded-xl border border-[#E5D4B6]/10">
                    <p className="text-xs font-black text-bora-accent">128</p>
                    <p className="text-[7px] font-bold text-[#E5D4B6]/30 uppercase tracking-widest mt-0.5">Reviews</p>
                 </div>
                 <div className="bg-black p-3 rounded-xl border border-[#E5D4B6]/10">
                    <p className="text-xs font-black text-bora-accent">24</p>
                    <p className="text-[7px] font-bold text-[#E5D4B6]/30 uppercase tracking-widest mt-0.5">Open Jobs</p>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-2">
              <button className="flex-1 px-5 py-2.5 bg-bora-accent text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                Edit Profile
              </button>
              <button className="px-5 py-2.5 bg-black text-[#E5D4B6]/40 rounded-xl border border-[#E5D4B6]/10 hover:text-bora-accent hover:border-bora-accent transition-all">
                <Settings size={14} />
              </button>
            </div>
          </div>

          <div className="bg-black rounded-[2rem] p-6 text-bora-accent relative overflow-hidden group shadow-2xl border border-[#E5D4B6]/10">
             <div className="absolute -top-12 -right-12 w-24 h-24 bg-bora-accent rounded-full blur-3xl opacity-10 group-hover:scale-150 transition-transform duration-1000" />
             <p className="text-[8px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] mb-3">Account Security</p>
             <h4 className="text-xs font-black mb-5">2-Factor Authentication inactive</h4>
             <button className="w-full py-2.5 bg-[#E5D4B6]/10 hover:bg-[#E5D4B6]/20 text-bora-accent rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#E5D4B6]/10 transition-all">
               Enable 2FA
             </button>
          </div>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          <section className="bg-black backdrop-blur-xl rounded-[2.5rem] p-10 border border-[#E5D4B6]/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 bg-bora-accent rounded-xl flex items-center justify-center text-black ring-2 ring-bora-accent/5">
                 <User size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-bora-accent tracking-tighter">Personal Information</h2>
                 <p className="text-[11px] font-bold text-[#E5D4B6]/40">Update your profile details and contact info</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1 opacity-80 flex items-center gap-2">
                  <User size={10} className="text-bora-accent" />
                  Full Name
                </label>
                <input 
                  type="text" 
                  defaultValue="Sarah Chen"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1 opacity-80 flex items-center gap-2">
                  <Mail size={10} className="text-bora-accent" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  defaultValue="sarah@bora.ai"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1 opacity-80 flex items-center gap-2">
                  <Briefcase size={10} className="text-bora-accent" />
                  Role
                </label>
                <input 
                  type="text" 
                  defaultValue="HR Manager"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1 opacity-80 flex items-center gap-2">
                  <Phone size={10} className="text-bora-accent" />
                  Phone Number
                </label>
                <input 
                  type="text" 
                  defaultValue="+1 (555) 000-0000"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
            </div>
          </section>

          <section className="bg-black backdrop-blur-xl rounded-[2.5rem] p-10 border border-[#E5D4B6]/10 shadow-2xl mb-20">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 bg-bora-accent rounded-xl flex items-center justify-center text-black ring-2 ring-bora-accent/5">
                 <Building2 size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-bora-accent tracking-tighter">Company Profile</h2>
                 <p className="text-[11px] font-bold text-[#E5D4B6]/40">Manage your company information</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue="BORA AI Recruitment"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest ml-1">HQ Location</label>
                <input 
                  type="text" 
                  defaultValue="San Francisco, CA"
                   className="w-full bg-black border border-[#E5D4B6]/10 rounded-xl px-5 py-3 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all shadow-sm" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E5D4B6]/10 pt-8">
               <button className="px-8 py-3 bg-black text-[#E5D4B6]/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-bora-accent hover:bg-[#E5D4B6]/5 transition-all border border-[#E5D4B6]/10">
                 Cancel
               </button>
               <button className="px-8 py-3 bg-bora-accent text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                 <Save size={14} />
                 Save Changes
               </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
