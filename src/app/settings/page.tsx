'use client';

import { useState } from 'react';
import { Eye, EyeOff, Key, Save, Trash2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useApiKey } from '@/hooks/useApiKey';

export default function SettingsPage() {
    const { apiKey, maskedKey, setApiKey, clearApiKey, hasKey } = useApiKey();
    const [inputKey, setInputKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!inputKey.trim()) return;
        setApiKey(inputKey.trim());
        setInputKey('');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleClear = () => {
        clearApiKey();
        setInputKey('');
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                <p className="text-slate-400 text-sm">Configure your Google Maps API key to start fetching business data.</p>
            </div>

            {/* Current Key Status */}
            <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 ${hasKey ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                {hasKey ? (
                    <>
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-emerald-400 font-medium text-sm">API Key Configured</p>
                            <p className="text-emerald-400/70 text-xs mt-0.5 font-mono">{maskedKey}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-medium text-sm">No API Key Set</p>
                            <p className="text-red-400/70 text-xs mt-0.5">Add your Google Maps API key below to get started.</p>
                        </div>
                    </>
                )}
            </div>

            {/* API Key Input */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                    <Key className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-slate-200">Google Maps API Key</h2>
                </div>

                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        placeholder="AIza..."
                        className="w-full pr-12 pl-4 py-3 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl text-white placeholder-slate-600 text-sm font-mono outline-none transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!inputKey.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? 'Saved!' : 'Save Key'}
                    </button>
                    {hasKey && (
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Remove Key
                        </button>
                    )}
                </div>
            </div>

            {/* Setup Instructions */}
            <div className="mt-6 bg-slate-800/40 border border-slate-700/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">How to get your API Key</h3>
                <ol className="space-y-3 text-sm text-slate-400">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                        Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="w-3 h-3" /></a>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                        Create a new project or select an existing one
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">3</span>
                        Navigate to <strong className="text-slate-300">APIs & Services → Library</strong>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">4</span>
                        Enable <strong className="text-slate-300">Places API</strong> (search for "Places API")
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">5</span>
                        Go to <strong className="text-slate-300">APIs & Services → Credentials</strong> → Create API Key
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">6</span>
                        Copy the key and paste it above
                    </li>
                </ol>

                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <p className="text-amber-400 text-xs">
                        <strong>Note:</strong> Your API key is stored locally in your browser and sent securely to our server-side proxy. It is never exposed in the browser network tab for Google API calls.
                    </p>
                </div>
            </div>
        </div>
    );
}
