'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.password || !formData.confirmPassword) {
            return toast.error('Please complete all fields');
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
            toast.success('Password reset successfully!');
        } catch (error: unknown) {
            toast.error('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark relative overflow-hidden">
            {/* Left Side: Hero / Brand */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-cream/10 border-r border-cream/5">
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 border-2 border-cream/30 bg-dark rounded-full flex items-center justify-center transition-all group-hover:border-cream group-hover:rotate-12 duration-500 overflow-hidden shadow-2xl shadow-cream/20">
                            <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-3xl font-bold text-cream transition-all duration-700">
                            Bora
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-5xl xl:text-6xl font-bold text-cream leading-tight">
                            Secure your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cream to-cream/40 italic font-serif">Workspace</span>
                        </h1>
                        <p className="text-xl text-cream/70 max-w-xl leading-relaxed">
                            Create a strong and secure password to protect your recruitment data and access insightful metrics.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 bg-dark">
                <div className="w-full max-w-lg">
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 border border-cream/20 bg-dark rounded-full flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-bold text-cream">Bora</span>
                        </Link>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-cream">Create New Password</h2>
                        <p className="text-cream/50 mt-2 font-medium">Please enter and confirm your new password below to regain access.</p>
                    </div>

                    <div className="bg-cream/5 border border-cream/10 p-10 rounded-2xl space-y-8">
                        {!submitted ? (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2 group relative">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-medium text-cream/60 group-focus-within:text-cream transition-colors">New Password</label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                            className="bg-cream/5 border-cream/20 h-14 pl-4 pr-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 group relative">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-medium text-cream/60 group-focus-within:text-cream transition-colors">Confirm Password</label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="bg-cream/5 border-cream/20 h-14 pl-4 pr-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-cream text-dark hover:bg-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-cream/10 group/btn disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? 'Resetting...' : <>Reset password <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-4 space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                    <Lock className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-cream">Password Reset!</h3>
                                <p className="text-cream/60 font-medium mb-6">Your password has been successfully updated.</p>
                                <Link href="/auth/login" className="block w-full">
                                    <Button className="w-full bg-cream text-dark hover:bg-white h-14 font-bold rounded-xl">
                                        Continue to login
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
