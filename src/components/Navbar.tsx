'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Map, Building2 } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';
import clsx from 'clsx';

export default function Navbar() {
    const pathname = usePathname();
    const { hasKey, maskedKey } = useApiKey();

    return (
        <header className="h-14 flex-shrink-0 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm flex items-center px-4 gap-4 z-40">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mr-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-sm hidden sm:block">Lead CRM</span>
                <span className="text-slate-600 text-xs hidden sm:block">by Google Maps</span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-1 flex-1">
                <Link
                    href="/"
                    className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === '/' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                >
                    <Map className="w-4 h-4" />
                    Dashboard
                </Link>
            </nav>

            {/* API Key status + Settings */}
            <div className="flex items-center gap-2">
                {hasKey ? (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-mono">{maskedKey}</span>
                    </div>
                ) : (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span className="text-red-400 text-xs">No API Key</span>
                    </div>
                )}
                <Link
                    href="/settings"
                    className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        pathname === '/settings' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:block">Settings</span>
                </Link>
            </div>
        </header>
    );
}
