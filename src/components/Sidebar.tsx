'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, MapPin, Tag, ChevronRight, History, Users } from 'lucide-react';
import { SearchSession } from '@/types';
import clsx from 'clsx';

interface Props {
    sessions: SearchSession[];
    currentSessionId?: string;
    onLoadSession: (session: SearchSession) => void;
    onDeleteSession: (id: string) => void;
    isGlobalCRM: boolean;
    onToggleGlobalCRM: (val: boolean) => void;
}

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function Sidebar({
    sessions, currentSessionId, onLoadSession, onDeleteSession,
    isGlobalCRM, onToggleGlobalCRM
}: Props) {
    return (
        <aside className="w-full h-full flex flex-col bg-slate-900/50 border-r border-slate-700/50">
            {/* Lead Workspace Section */}
            <div className="p-4 space-y-2 border-b border-slate-800">
                <button
                    onClick={() => onToggleGlobalCRM(!isGlobalCRM)}
                    className={clsx(
                        "w-full flex items-center justify-between p-3 rounded-2xl border transition-all",
                        isGlobalCRM
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lead Workspace</span>
                    </div>
                    {isGlobalCRM && <ChevronRight className="w-4 h-4" />}
                </button>
            </div>
            <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-slate-200">Saved Sessions</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Click to restore previous searches</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                <AnimatePresence>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <History className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                            <p className="text-slate-600 text-xs">No saved sessions yet. Search for businesses to get started.</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={clsx(
                                    'group relative rounded-xl border transition-all duration-150 cursor-pointer',
                                    currentSessionId === session.id
                                        ? 'bg-indigo-600/15 border-indigo-500/40'
                                        : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800 hover:border-slate-600'
                                )}
                                onClick={() => onLoadSession(session)}
                            >
                                <div className="p-3 pr-8">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                        <p className="text-xs font-medium text-slate-200 truncate">{session.area}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Tag className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                                        <p className="text-xs text-indigo-400 truncate">{session.type}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">{session.totalResults} results</span>
                                        <div className="flex items-center gap-1 text-slate-600">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs">{timeAgo(session.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                    className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                                    title="Delete session"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {currentSessionId === session.id && (
                                    <div className="absolute right-2 bottom-2">
                                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </aside>
    );
}
