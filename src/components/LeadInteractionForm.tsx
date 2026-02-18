'use client';

import { useState } from 'react';
import { LeadData, LeadStatus, LeadNote, InteractionLog } from '@/types';
import {
    CheckCircle2, Clock, MessageSquare, Phone,
    Send, Trash2, AlertCircle, Plus, History
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
    placeId: string;
    leadData?: LeadData;
    onUpdateStatus: (status: LeadStatus) => void;
    onAddNote: (text: string) => void;
    onLogInteraction: (type: InteractionLog['type'], details: string) => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
    { value: 'New', label: 'New Lead', color: 'bg-indigo-500' },
    { value: 'Attempted', label: 'Contact Attempted', color: 'bg-amber-500' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-blue-500' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-emerald-500' },
    { value: 'Unqualified', label: 'Unqualified', color: 'bg-slate-500' },
    { value: 'Won', label: 'Closed Won', color: 'bg-pink-500' },
    { value: 'Lost', label: 'Closed Lost', color: 'bg-red-500' },
];

export default function LeadInteractionForm({
    placeId, leadData, onUpdateStatus, onAddNote, onLogInteraction
}: Props) {
    const [noteText, setNoteText] = useState('');
    const [activeTab, setActiveTab] = useState<'status' | 'notes' | 'history'>('status');

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!noteText.trim()) return;
        onAddNote(noteText.trim());
        setNoteText('');
    };

    return (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-700/50 bg-slate-800/40">
                <button
                    onClick={() => setActiveTab('status')}
                    className={clsx("flex-1 px-4 py-2.5 text-xs font-semibold transition-colors", activeTab === 'status' ? "text-indigo-400 bg-indigo-500/5 shadow-[inset_0_-2px_0_0_#6366f1]" : "text-slate-500 hover:text-slate-300")}
                >
                    Status
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={clsx("flex-1 px-4 py-2.5 text-xs font-semibold transition-colors", activeTab === 'notes' ? "text-indigo-400 bg-indigo-500/5 shadow-[inset_0_-2px_0_0_#6366f1]" : "text-slate-500 hover:text-slate-300")}
                >
                    Notes ({leadData?.notes.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={clsx("flex-1 px-4 py-2.5 text-xs font-semibold transition-colors", activeTab === 'history' ? "text-indigo-400 bg-indigo-500/5 shadow-[inset_0_-2px_0_0_#6366f1]" : "text-slate-500 hover:text-slate-300")}
                >
                    History
                </button>
            </div>

            <div className="p-4">
                {activeTab === 'status' && (
                    <div className="space-y-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Set Lead Status</p>
                        <div className="grid grid-cols-2 gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => onUpdateStatus(opt.value)}
                                    className={clsx(
                                        "flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all",
                                        leadData?.status === opt.value
                                            ? `border-transparent text-white ${opt.color}`
                                            : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500"
                                    )}
                                >
                                    {opt.label}
                                    {leadData?.status === opt.value && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => onLogInteraction('Call', 'Manual call logged')}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                Log a Call
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="space-y-4">
                        <form onSubmit={handleAddNote} className="relative">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a private note about this lead..."
                                className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl p-3 text-sm text-white placeholder-slate-600 outline-none min-h-[80px] resize-none"
                            />
                            <button
                                type="submit"
                                className="absolute bottom-3 right-3 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                                disabled={!noteText.trim()}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                            {leadData?.notes.map((note) => (
                                <div key={note.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/30">
                                    <p className="text-sm text-slate-300 mb-1">{note.text}</p>
                                    <p className="text-[10px] text-slate-500">{new Date(note.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                            {(!leadData?.notes || leadData.notes.length === 0) && (
                                <p className="text-center py-4 text-xs text-slate-600">No notes yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="space-y-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Interaction History</p>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {leadData?.interactions.map((log) => (
                                <div key={log.id} className="flex gap-3 bg-slate-900/30 p-3 rounded-xl border border-slate-700/10">
                                    <div className="mt-0.5">
                                        {log.type === 'Call' && <Phone className="w-3.5 h-3.5 text-indigo-400" />}
                                        {log.type === 'Note' && <MessageSquare className="w-3.5 h-3.5 text-amber-400" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-200">{log.type}</p>
                                        <p className="text-xs text-slate-400 mb-1">{log.details}</p>
                                        <p className="text-[10px] text-slate-600">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {(!leadData?.interactions || leadData.interactions.length === 0) && (
                                <div className="text-center py-8">
                                    <History className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                                    <p className="text-xs text-slate-600">No activity logged yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
