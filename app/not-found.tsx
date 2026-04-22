import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-dark text-cream flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-9xl font-black mb-4">404</h1>
            <h2 className="text-3xl font-black mb-8">Page not found</h2>
            <Link
                href="/"
                className="bg-cream text-dark px-8 py-3 rounded-md font-bold hover:bg-white transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
