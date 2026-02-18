'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchSession, PlaceSummary } from '@/types';
import {
    saveSession,
    getSession,
    getAllSessions,
    deleteSession,
    buildSessionId,
} from '@/lib/db';

export function useSession() {
    const [sessions, setSessions] = useState<SearchSession[]>([]);
    const [currentSession, setCurrentSession] = useState<SearchSession | null>(null);

    const loadAllSessions = useCallback(async () => {
        const all = await getAllSessions();
        setSessions(all);
    }, []);

    useEffect(() => {
        loadAllSessions();
    }, [loadAllSessions]);

    const saveCurrentSession = useCallback(
        async (areaCode: string, typeCode: string, newResults: PlaceSummary[], nextPageToken?: string, append = false) => {
            const id = buildSessionId(areaCode, typeCode);
            let results = newResults;

            if (append) {
                // Fetch directly from DB instead of relying on state to avoid stale data
                const existing = await getSession(id);
                if (existing) {
                    const map = new Map();
                    existing.results.forEach(r => map.set(r.place_id, r));
                    newResults.forEach(r => map.set(r.place_id, r));
                    results = Array.from(map.values());
                }
            }

            const session: SearchSession = {
                id,
                area: areaCode,
                type: typeCode,
                results,
                nextPageToken,
                timestamp: Date.now(),
                totalResults: results.length,
            };
            await saveSession(session);
            setCurrentSession(session);
            await loadAllSessions();
        },
        [loadAllSessions]
    );

    const loadSession = useCallback((session: SearchSession) => {
        setCurrentSession(session);
    }, []);

    const removeSession = useCallback(
        async (id: string) => {
            await deleteSession(id);
            if (currentSession?.id === id) setCurrentSession(null);
            await loadAllSessions();
        },
        [currentSession, loadAllSessions]
    );

    return {
        sessions,
        currentSession,
        setCurrentSession,
        saveCurrentSession,
        loadSession,
        removeSession,
    };
}
