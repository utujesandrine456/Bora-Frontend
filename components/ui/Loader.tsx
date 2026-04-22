'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-dark">
            {/* Subtle background texture */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #DAC5A7 1px, transparent 0)`, backgroundSize: '40px 40px' }}
            />

            <div className="relative flex flex-col items-center justify-center gap-14 z-10">
                {/* Logo mark */}
                <div className="relative flex items-center justify-center">
                    {/* Outer slow orbit */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-28 h-28 rounded-full border border-cream/10"
                        style={{ borderTopColor: 'rgba(218,197,167,0.5)' }}
                    />
                    {/* Mid ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-20 h-20 rounded-full border border-cream/5"
                        style={{ borderRightColor: 'rgba(218,197,167,0.3)' }}
                    />
                    {/* Inner pulsing core */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-12 h-12 bg-cream rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(218,197,167,0.25)]"
                    >
                        <motion.img
                            src="/logo.png"
                            alt="BORA"
                            className="w-full h-full object-cover rounded-full"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </motion.div>

                    {/* Orbiting dot */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-28 h-28"
                        style={{ transformOrigin: 'center' }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cream rounded-full shadow-[0_0_8px_#DAC5A7]" />
                    </motion.div>
                </div>

                {/* Text section */}
                <div className="flex flex-col items-center gap-3">
                    <motion.h2
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-cream font-black text-2xl"
                    >
                        BORA
                    </motion.h2>

                    {/* Animated dot loader */}
                    <div className="flex items-center gap-2 mt-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                className="w-1.5 h-1.5 rounded-full bg-cream"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
