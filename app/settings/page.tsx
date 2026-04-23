'use client';

import React, { useState } from 'react';
import {
  User,
  Laptop,
  Shield,
  Save,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api/auth';
import { systemApi } from '@/lib/api/system';

type Category = 'workspace' | 'ai' | 'security';

/* ───────────────── Password Strength ───────────────── */
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

/* ───────────────── Security Panel ───────────────── */
function SecurityPanel() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(newPassword);

  const handleReset = async () => {
    if (!newPassword) return toast.error('Enter password');
    if (newPassword.length < 8) return toast.error('Min 8 chars');
    if (newPassword !== confirmPassword) return toast.error('Passwords mismatch');

    setLoading(true);
    setSuccess(false);

    try {
      await authApi.changePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      {success && (
        <div className="flex gap-2 text-emerald-400">
          <CheckCircle2 /> Password updated
        </div>
      )}

      <input
        type={showNew ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full p-3 bg-dark border border-cream/20"
      />

      <input
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm password"
        className="w-full p-3 bg-dark border border-cream/20"
      />

      <button onClick={handleReset} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
      </button>
    </div>
  );
}

/* ───────────────── Defaults ───────────────── */
const DEFAULT_WORKSPACE = {
  companyName: '',
  website: '',
  industry: 'Tech',
  description: '',
};

const DEFAULT_AI = {
  model: 'advanced',
  experienceWeight: 40,
  educationWeight: 30,
  skillsWeight: 30,
};

/* ───────────────── Main Component ───────────────── */
export default function AdminSettings() {
  const [activeCategory, setActiveCategory] = useState<Category>('workspace');
  const [loading, setLoading] = useState(false);

  const [workspaceData, setWorkspaceData] = useState(DEFAULT_WORKSPACE);
  const [aiData, setAiData] = useState(DEFAULT_AI);

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('workspace', JSON.stringify(workspaceData));
      localStorage.setItem('ai', JSON.stringify(aiData));
      toast.success('Saved!');
    } catch {
      toast.error('Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings?')) return;

    setLoading(true);
    try {
      await systemApi.resetPlatform();
      setWorkspaceData(DEFAULT_WORKSPACE);
      setAiData(DEFAULT_AI);
      localStorage.clear();
      toast.success('Reset done');
    } catch {
      toast.error('Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'workspace', label: 'Workspace', icon: User },
    { id: 'ai', label: 'AI', icon: Laptop },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <TopNav />

      <div className="p-8 max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-cream">Settings</h1>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory}>
            {activeCategory === 'workspace' && (
              <div className="space-y-4">
                <Input
                  label="Company"
                  value={workspaceData.companyName}
                  onChange={(e) =>
                    setWorkspaceData({ ...workspaceData, companyName: e.target.value })
                  }
                />
                <Textarea
                  label="Description"
                  value={workspaceData.description}
                  onChange={(e) =>
                    setWorkspaceData({ ...workspaceData, description: e.target.value })
                  }
                />
              </div>
            )}

            {activeCategory === 'ai' && (
              <div>
                <Select
                  label="Model"
                  value={aiData.model}
                  onChange={(e) =>
                    setAiData({ ...aiData, model: e.target.value })
                  }
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
              </div>
            )}

            {activeCategory === 'security' && <SecurityPanel />}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        {activeCategory !== 'security' && (
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={loading}>
              <Save /> Save
            </Button>

            <button onClick={handleReset}>
              <RotateCcw /> Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}