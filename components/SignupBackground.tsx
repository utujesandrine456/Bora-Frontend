'use client';

import React from 'react';

export default function SignupBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-dark">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-cream/10 blur-[150px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cream/5 blur-[150px] mix-blend-screen" />
                <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] rounded-full bg-cream/10 blur-[130px] mix-blend-screen" />
            </div>
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
        </div>
    );
}
