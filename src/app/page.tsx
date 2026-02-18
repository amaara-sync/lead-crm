'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Building2, Search, Settings as SettingsIcon, LayoutGrid,
  List as ListIcon, Users, CheckCircle2, History, AlertCircle,
  PanelLeftClose, PanelLeft, MapPin, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import SearchForm from '@/components/SearchForm';
import BusinessCard from '@/components/BusinessCard';
import Pagination from '@/components/Pagination';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import { useApiKey } from '@/hooks/useApiKey';
import { useApiClient } from '@/hooks/useApiClient';
import { useSession } from '@/hooks/useSession';
import { useLeadCRM } from '@/hooks/useLeadCRM';
import { PlaceSummary, LeadStatus, InteractionLog } from '@/types';
import clsx from 'clsx';
import Link from 'next/link';

export default function DashboardPage() {
  const { apiKey, hasKey } = useApiKey();
  const { loading, error, results, pagination, search, getPhotoUrl, setResults, setPagination, setError } = useApiClient();
  const { sessions, currentSession, loadSession, saveCurrentSession, removeSession } = useSession();
  const {
    interactedLeads, updateLeadStatus, addLeadNote,
    logInteraction
  } = useLeadCRM();

  const [selectedPlace, setSelectedPlace] = useState<PlaceSummary | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyLeads, setShowOnlyLeads] = useState(false);
  const [isGlobalCRM, setIsGlobalCRM] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [currentQuery, setCurrentQuery] = useState<{ area: string, type: string } | null>(null);

  const handleSearch = async (area: string, type: string, radius?: number, location?: string) => {
    setIsGlobalCRM(false);
    setCurrentQuery({ area, type });
    const data = await search(`${type} in ${area}`, undefined, location, radius);
    if (data) {
      saveCurrentSession(area, type, data.results, data.next_page_token);
    }
  };

  const handlePageChange = async (token: string) => {
    const data = await search('', token);
    if (data && currentQuery) {
      saveCurrentSession(currentQuery.area, currentQuery.type, data.results, data.next_page_token, true);
    }
  };

  const handleLoadSession = (session: any) => {
    setIsGlobalCRM(false);
    setCurrentQuery({ area: session.area, type: session.type });
    setResults(session.results);
    setPagination({ nextPageToken: session.nextPageToken });
    loadSession(session);
  };

  const displayResults = useMemo(() => {
    if (isGlobalCRM) {
      return Object.values(interactedLeads).map(lead => ({
        place_id: lead.place_id,
        name: lead.name,
        vicinity: lead.address,
        rating: lead.rating,
        photos: [], // Fallback for global view
      } as PlaceSummary));
    }

    if (!showOnlyLeads) return results;
    return results.filter(r => interactedLeads[r.place_id]);
  }, [results, showOnlyLeads, interactedLeads, isGlobalCRM]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-white">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0"
          >
            <Sidebar
              sessions={sessions}
              currentSessionId={isGlobalCRM ? undefined : currentSession?.id}
              onLoadSession={handleLoadSession}
              onDeleteSession={removeSession}
              isGlobalCRM={isGlobalCRM}
              onToggleGlobalCRM={setIsGlobalCRM}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/30">
          <div className="flex flex-col gap-4">
            {!hasKey && (
              <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-amber-500">API Key Required</p>
                    <p className="text-[11px] text-amber-500/70">Configuration required in settings to enable business search.</p>
                  </div>
                </div>
                <Link href="/settings" className="px-3 py-1.5 bg-amber-500 text-slate-900 text-xs font-bold rounded-lg hover:bg-amber-400">Settings</Link>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700/30 h-[46px] w-[46px] flex items-center justify-center flex-shrink-0 transition-colors"
              >
                {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </button>
              <div className="flex-1">
                <SearchForm onSearch={handleSearch} loading={loading} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                  <button onClick={() => setViewMode('grid')} className={clsx("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-indigo-600 text-white" : "text-slate-500")}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={clsx("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-indigo-600 text-white" : "text-slate-500")}><ListIcon className="w-4 h-4" /></button>
                </div>
                {isGlobalCRM && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">ALL LEADS WORKSPACE</span>
                  </div>
                )}
              </div>

              {!isGlobalCRM && (
                <button
                  onClick={() => setShowOnlyLeads(!showOnlyLeads)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[11px] font-bold transition-all",
                    showOnlyLeads ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-800 border-slate-700 text-slate-400"
                  )}
                >
                  <Users className="w-3.5 h-3.5" />
                  {showOnlyLeads ? 'VIEWING QUALIFIED' : 'SHOW INTERACTED'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading && results.length === 0 ? (
            <div className={clsx("grid gap-6", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto")}>
              {[...Array(8)].map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
          ) : displayResults.length > 0 ? (
            <div className="space-y-8 pb-10">
              <div className={clsx("grid gap-6", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto")}>
                {displayResults.map((place, i) => (
                  <BusinessCard
                    key={place.place_id}
                    place={place}
                    index={i}
                    onViewDetails={setSelectedPlace}
                    getPhotoUrl={getPhotoUrl}
                    viewMode={viewMode}
                    leadData={interactedLeads[place.place_id]}
                  />
                ))}
              </div>

              {!isGlobalCRM && pagination.nextPageToken && (
                <Pagination nextPageToken={pagination.nextPageToken} onPageChange={handlePageChange} loading={loading} />
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 rotate-3 shadow-2xl">
                {isGlobalCRM ? <Users className="w-10 h-10 text-indigo-500" /> : <Building2 className="w-10 h-10 text-indigo-500" />}
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {isGlobalCRM ? 'No Saved Leads Yet' : 'Start Your Search'}
              </h2>
              <p className="max-w-md text-slate-400 text-sm">
                {isGlobalCRM
                  ? 'Your lead pipeline is currently empty. Start by searching for businesses and marking them as leads in your sessions.'
                  : 'Enter area and business type above to begin discovering new opportunities.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <BusinessDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        getPhotoUrl={getPhotoUrl}
        leadData={selectedPlace ? interactedLeads[selectedPlace.place_id] : undefined}
        onUpdateLeadStatus={(status) => selectedPlace && updateLeadStatus(selectedPlace, status)}
        onAddLeadNote={(text) => selectedPlace && addLeadNote(selectedPlace, text)}
        onLogInteraction={(type, details) => selectedPlace && logInteraction(selectedPlace, type, details)}
      />
    </div>
  );
}
