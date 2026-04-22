'use client';

import React, { useState } from 'react';
import { User, Shield, Laptop, Check, Save } from 'lucide-react';
import TopNav from '@/components/TopNav';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'workspace' | 'ai' | 'security';


export default function AdminSettings() {
    const [activeCategory, setActiveCategory] = useState<Category>('workspace');
    const [loading, setLoading] = useState(false);

    const [workspaceData, setWorkspaceData] = useState({
        companyName: 'Bora Technologies',
        website: 'https://bora.ai',
        industry: 'Tech',
        description: 'Next-generation AI recruitment platform.'
    });

    const [aiData, setAiData] = useState({
        model: 'advanced',
        experienceWeight: 40,
        educationWeight: 30,
        skillsWeight: 30
    });

    const handleSave = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        toast.success(`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} configuration saved!`);
    };

    const categories: { id: Category; label: string; icon: any; color: string }[] = [
        { id: 'workspace', label: 'Workspace Profile', icon: User, color: 'text-cream' },
        { id: 'ai', label: 'AI Preferences', icon: Laptop, color: 'text-emerald-500' },
    ];

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
                    <div>
                        <h1 className="text-5xl font-black text-cream leading-none mb-4">Platform Settings</h1>
                        <p className="text-cream/40 font-medium text-md">Configure your recruitment environment and AI parameters</p>
                    </div>

                    <div className="flex items-center gap-4 bg-cream/5 p-1.5 rounded-md border border-cream/10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`cursor-pointer px-6 py-3 rounded-md flex items-center gap-3 transition-all font-bold text-sm ${activeCategory === cat.id
                                    ? 'bg-cream text-dark shadow-xl'
                                    : 'text-cream/40 hover:text-cream hover:bg-cream/5'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-cream/5 border border-cream/10 rounded-3xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cream/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            {activeCategory === 'workspace' && (
                                <div className="space-y-8 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Company Name"
                                            value={workspaceData.companyName}
                                            onChange={(e) => setWorkspaceData({ ...workspaceData, companyName: e.target.value })}
                                            placeholder="Enter company name"
                                        />
                                        <Input
                                            label="Website URL"
                                            value={workspaceData.website}
                                            onChange={(e) => setWorkspaceData({ ...workspaceData, website: e.target.value })}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <Select
                                        label="Industry Category"
                                        options={[
                                            { value: 'Tech', label: 'Technology' },
                                            { value: 'Finance', label: 'Finance' },
                                            { value: 'Healthcare', label: 'Healthcare' }
                                        ]}
                                        value={workspaceData.industry}
                                        onChange={(e) => setWorkspaceData({ ...workspaceData, industry: e.target.value })}
                                    />
                                    <Textarea
                                        label="Company Description"
                                        rows={4}
                                        value={workspaceData.description}
                                        onChange={(e) => setWorkspaceData({ ...workspaceData, description: e.target.value })}
                                        placeholder="Briefly describe your workspace..."
                                    />
                                </div>
                            )}

                            {activeCategory === 'ai' && (
                                <div className="space-y-8 max-w-2xl">
                                    <Select
                                        label="Model Engine"
                                        options={[
                                            { value: 'standard', label: 'Standard (Fast)' },
                                            { value: 'advanced', label: 'Advanced (Precise)' },
                                            { value: 'experimental', label: 'Experimental (Cutting Edge)' }
                                        ]}
                                        value={aiData.model}
                                        onChange={(e) => setAiData({ ...aiData, model: e.target.value })}
                                    />

                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-cream">Screening Weight Distribution</h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Work Experience', key: 'experienceWeight' },
                                                { label: 'Education & Certs', key: 'educationWeight' },
                                                { label: 'Skill Proficiency', key: 'skillsWeight' }
                                            ].map((weight) => (
                                                <div key={weight.key} className="space-y-2">
                                                    <div className="flex justify-between text-xs font-bold text-cream/60">
                                                        <span>{weight.label}</span>
                                                        <span>{aiData[weight.key as keyof typeof aiData]}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        className="w-full accent-cream"
                                                        value={aiData[weight.key as keyof typeof aiData]}
                                                        onChange={(e) => setAiData({ ...aiData, [weight.key]: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="pt-12 text-left flex items-center gap-6">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-cream text-dark py-5 px-12 text-sm font-black shadow-xl h-14 flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Save Configuration
                    </Button>
                    {loading && (
                        <p className="text-cream/40 font-bold text-sm animate-pulse">Syncing changes with neural engine...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
