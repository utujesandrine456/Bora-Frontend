'use client';

import React from 'react';
import { User, Shield, Laptop } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminSettings() {
    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32 focus-visible:outline-none">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
                    <h1 className="text-6xl font-black text-cream leading-none mb-4">Platform Settings</h1>
                    <p className="text-cream/40 font-medium text-lg">Configure your recruitment environment and AI parameters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-cream/5 border border-cream/10 rounded-xl flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">Workspace Profile</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Update company details, logo, and public landing page info.</p>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Laptop className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">AI Preferences</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Adjust screening weights and explainability detail levels.</p>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-cream/5 border border-cream/10 rounded-xl flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">Security & Access</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Manage team permissions and multi-factor authentication.</p>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="pt-12 text-left">
                    <Button variant="primary" className="bg-cream text-dark py-5 px-12 text-sm font-black shadow-xl">
                        Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
}
