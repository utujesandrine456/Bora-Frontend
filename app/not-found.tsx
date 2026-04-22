'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center p-6 text-center relative overflow-hidden selection:bg-cream selection:text-dark">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180, 270, 360],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/4 w-full h-full border border-cream/5 rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [360, 270, 180, 90, 0],
                        opacity: [0.03, 0.08, 0.03]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -right-1/4 w-full h-full border border-cream/5 rounded-[40%]"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 relative inline-block text-cream"
                >
                    <Ghost className="w-24 h-24 mx-auto mb-8 opacity-20" strokeWidth={1} />

                    <motion.h1
                        animate={{
                            textShadow: [
                                "0px 0px 0px rgba(218,197,167,0)",
                                "10px 0px 20px rgba(218,197,167,0.3)",
                                "0px 0px 0px rgba(218,197,167,0)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[12rem] md:text-[18rem] font-black leading-none mb-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 italic serif select-none"
                    >
                        404
                    </motion.h1>

                    <h1 className="text-8xl md:text-9xl font-black mb-2 relative z-10">
                        Lost?
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="space-y-6"
                >
                    <h2 className="text-2xl md:text-3xl font-black italic serif text-cream/80">
                        This coordinate does not exist.
                    </h2>
                    <p className="text-cream/40 font-medium text-lg max-w-md mx-auto leading-relaxed">
                        The resource you are looking for has been moved, deleted, or simply vanished into the recruitment void.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link
                        href="/"
                        className="group relative flex items-center gap-3 bg-cream text-dark px-10 py-5 rounded-md font-black hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[0_10px_30px_-10px_rgba(218,197,167,0.5)]"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group flex items-center gap-3 bg-transparent border border-cream/20 text-cream/60 px-10 py-5 rounded-md font-black hover:border-cream hover:text-cream transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        <span>Go Back</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
