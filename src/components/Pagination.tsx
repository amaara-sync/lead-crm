'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    nextPageToken?: string;
    onPageChange: (token: string) => void;
    loading: boolean;
}

export default function Pagination({ nextPageToken, onPageChange, loading }: Props) {
    if (!nextPageToken) return null;

    return (
        <div className="flex justify-center p-4">
            <button
                onClick={() => onPageChange(nextPageToken)}
                disabled={loading}
                className={clsx(
                    'flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-bold transition-all',
                    loading
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 active:scale-95'
                )}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Fetching Results...</span>
                    </>
                ) : (
                    <>
                        Load More Results
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
}
