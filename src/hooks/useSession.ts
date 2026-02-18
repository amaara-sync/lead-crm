'use client';

import { useState, useEffect, useCallback } from 'react';
import { SearchSession, PlaceSummary } from '@/types';
import {
    saveSession,
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
        async (area: string, type: string, results: PlaceSummary[], nextPageToken?: string) => {
            const id = buildSessionId(area, type);
            const session: SearchSession = {
                id,
                area,
                type,
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
