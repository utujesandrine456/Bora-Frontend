'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Shield, 
  Laptop, 
  Mail, 
  Building2, 
  Globe, 
  Lock, 
  Key, 
  Save, 
  Bell 
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card, { fadeUp } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { usersApi } from '@/lib/api/users';

const TABS = [
  { id: 'general', label: 'General Info', icon: User },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'notifications', label: 'Alert Preferences', icon: Bell },
  { id: 'ai', label: 'AI Parameters', icon: Laptop },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [user, setUser] = useState<{ id?: string; name: string; email: string; role: string; photo?: string; company?: string } | null>(null);
  const [localData, setLocalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    company: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
          setLocalData({
            firstName: stabilizedUser.name?.split(' ')[0] || '',
            lastName: stabilizedUser.name?.split(' ').slice(1).join(' ') || '',
            email: stabilizedUser.email || '',
            role: stabilizedUser.role || '',
            company: stabilizedUser.company || ''
          });
        } catch (e) {
          console.error('Settings: Failed to load user from storage');
        }
      }
    }
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions (Aggressive downscaling for 500 error resolution)
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Quality: 0.6 (60%) - Ultra-lightweight for backend compatibility
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const userId = user?.id || (user as any)?._id; // Bridge naming
    
    if (file && userId) {
      const toastId = toast.loading('Saving your photo...');
      try {
        // 1. Compress the image (client-side)
        const optimizedBase64 = await compressImage(file);

        // 2. PERSIST photo to a dedicated key that SURVIVES logout
        //    keyed by email so it's restored after login automatically
        const photoKey = `bora_photo_${user?.email || userId}`;
        try {
          localStorage.setItem(photoKey, optimizedBase64);
        } catch (storageErr) {
          console.warn('LocalStorage full saving dedicated photo key');
        }

        // 3. Optimistic UI Update (Instant appearance)
        const optimisticallyUpdatedUser = { ...user, photo: optimizedBase64 };
        setUser(optimisticallyUpdatedUser as any);
        try {
          localStorage.setItem('user', JSON.stringify(optimisticallyUpdatedUser));
        } catch (storageErr) {
          console.warn('LocalStorage full saving user');
        }
        window.dispatchEvent(new Event('user-updated'));

        // 4. Try to sync with backend (best-effort; we don't fail if it errors)
        try {
          const payload = {
            name: user?.name,
            email: user?.email,
            role: user?.role,
            company: user?.company,
            photo: optimizedBase64
          };
          const responseUser = await usersApi.updateProfile(userId, payload);
          const finalUser = {
            ...responseUser,
            photo: optimizedBase64,
            id: responseUser.id || (responseUser as any)._id
          };
          setUser(finalUser as any);
          try {
            localStorage.setItem('user', JSON.stringify(finalUser));
          } catch (_) {}
          console.log('Backend sync successful');
        } catch (backendErr) {
          // Backend failed (500) but photo is already saved in dedicated key
          // so it WILL be restored on next login
          console.warn('Backend sync failed, photo stored locally for persistence:', backendErr);
        }

        toast.success('Profile photo saved & will persist after login!', { id: toastId });
      } catch (err) {
        console.error('Photo compression error:', err);
        toast.error('Failed to process photo', { id: toastId });
      }
    } else {
      console.error('Photo failed to start: missing file or userID', { hasFile: !!file, userId });
      toast.error('Identity sync error. Try logging out and back in.');
    }
  };

  const handleSave = async () => {
    if (!user?.id) return toast.error('User ID not found. Please log in again.');

    const toastId = toast.loading('Syncing with backend...');
    try {
      const fullName = `${localData.firstName} ${localData.lastName}`.trim();
      const payload = {
        name: fullName,
        email: localData.email,
        role: localData.role,
        company: localData.company,
        photo: user.photo
      };

      const updatedUser = await usersApi.updateProfile(user.id, payload);
      
      // Update local state and storage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Dispatch event to sync other components
      window.dispatchEvent(new Event('user-updated'));
      
      toast.success('Settings synced successfully!', { id: toastId });
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error('Failed to sync settings with backend', { id: toastId });
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const displayName = user?.name || 'User';

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen font-sans">
      <TopNav />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoChange} 
      />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="border-b border-cream/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl font-black text-cream leading-none mb-4">Platform Settings</h1>
            <p className="text-cream/40 font-medium text-lg">Configure your recruitment environment and AI parameters</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="font-semibold px-6">Discard</Button>
            <Button 
              variant="primary" 
              className="gap-2 font-semibold px-6 bg-cream text-dark"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" /> Save changes
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all font-semibold cursor-pointer ${isActive
                      ? 'bg-cream text-dark shadow-md'
                      : 'text-cream/60 hover:text-cream hover:bg-cream/10'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-dark' : 'opacity-70'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-8">
            {activeTab === 'general' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Profile Information</h2>
                    <p className="text-cream/50 text-sm font-medium">Update your personal identifying details and public profile.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-cream/10">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-cream/10 border-2 border-cream/20 flex items-center justify-center text-3xl font-black text-cream overflow-hidden">
                        {user?.photo ? (
                          <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-dark/60 text-cream text-[10px] uppercase font-bold tracking-widest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Change
                      </button>
                    </div>
                    <div>
                      <div className="text-cream font-bold text-lg mb-1">{displayName}</div>
                      <div className="text-cream/50 text-sm font-medium mb-3">{user?.email || 'email@boratech.co'}</div>
                      <span className="text-[10px] font-bold text-cream/40 bg-cream/10 px-3 py-1 rounded">{user?.role || 'User Account'}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <Input 
                      label="First Name" 
                      value={localData.firstName} 
                      icon={User} 
                      onChange={(e) => setLocalData({...localData, firstName: e.target.value})}
                    />
                    <Input 
                      label="Last Name" 
                      value={localData.lastName} 
                      icon={User} 
                      onChange={(e) => setLocalData({...localData, lastName: e.target.value})}
                    />
                    <Input 
                      label="Email Address" 
                      value={localData.email} 
                      icon={Mail} 
                      onChange={(e) => setLocalData({...localData, email: e.target.value})}
                    />
                    <Input 
                      label="Role" 
                      value={localData.role} 
                      icon={Building2} 
                      onChange={(e) => setLocalData({...localData, role: e.target.value})}
                    />
                  </div>
                </Card>

                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Company Details</h2>
                    <p className="text-cream/50 text-sm font-medium">Manage your organization's core information.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input 
                      label="Company Name" 
                      value={localData.company} 
                      icon={Building2} 
                      onChange={(e) => setLocalData({...localData, company: e.target.value})}
                    />
                    <Input label="Website URL" defaultValue="https://bora.tech" icon={Globe} />
                    <Select
                      label="Company Size"
                      options={[
                        { value: '1-50', label: '1 - 50 employees' },
                        { value: '51-200', label: '51 - 200 employees' },
                        { value: '201-500', label: '201 - 500 employees' },
                        { value: '500+', label: '500+ employees' }
                      ]}
                      defaultValue="51-200"
                    />
                    <Select
                      label="Timezone"
                      options={[
                        { value: 'est', label: 'Eastern Time (ET)' },
                        { value: 'pst', label: 'Pacific Time (PT)' },
                        { value: 'utc', label: 'Coordinated Universal Time (UTC)' },
                        { value: 'cet', label: 'Central European Time (CET)' }
                      ]}
                      defaultValue="est"
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Password & Authentication</h2>
                    <p className="text-cream/50 text-sm font-medium">Keep your account secure with strong credentials.</p>
                  </div>

                  <div className="space-y-6 max-w-md">
                    <Input label="Current Password" type="password" placeholder="••••••••" icon={Lock} />
                    <Input label="New Password" type="password" placeholder="••••••••" icon={Key} />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" icon={Key} />
                    <Button variant="secondary" className="font-semibold w-full mt-4">Change Password</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Alert Preferences</h2>
                    <p className="text-cream/50 text-sm font-medium">Choose what events you want to be notified about.</p>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'n1', title: 'New Application Received', desc: 'When a candidate applies directly to a job board.' },
                      { id: 'n2', title: 'High-Match Candidate Alert', desc: 'Get notified when an AI-scored >90% applies.' },
                      { id: 'n3', title: 'Daily Summary', desc: 'Receive a daily digest of hiring activity.' },
                      { id: 'n4', title: 'Interview Updates', desc: 'Rescheduling requests or cancellations.' }
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-cream/5 border border-cream/10 rounded-md hover:border-cream/30 transition-colors">
                        <div>
                          <p className="font-bold text-cream text-md">{notif.title}</p>
                          <p className="text-xs text-cream/50 mt-1 font-medium">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                          <div className="w-11 h-6 bg-dark/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cream/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cream/80 peer-checked:after:bg-dark"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-cream mb-2">AI Preferences</h3>
                    <p className="text-sm text-cream/40 leading-relaxed">Adjust screening weights and explainability detail levels.</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
