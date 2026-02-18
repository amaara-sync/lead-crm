'use client';

import { useState, useCallback, useEffect } from 'react';
import { LeadData, LeadStatus, LeadNote, InteractionLog, PlaceSummary } from '@/types';
import { saveLead, getLead, getAllLeads, deleteLead } from '@/lib/db';

export function useLeadCRM() {
    const [interactedLeads, setInteractedLeads] = useState<Record<string, LeadData>>({});

    const refreshLeads = useCallback(async () => {
        const all = await getAllLeads();
        const map = all.reduce((acc, lead) => {
            acc[lead.place_id] = lead;
            return acc;
        }, {} as Record<string, LeadData>);
        setInteractedLeads(map);
    }, []);

    useEffect(() => {
        refreshLeads();
    }, [refreshLeads]);

    const updateLeadStatus = useCallback(async (place: PlaceSummary, status: LeadStatus) => {
        const existing = await getLead(place.place_id);
        const updated: LeadData = {
            place_id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address || '',
            rating: place.rating,
            status,
            notes: existing?.notes || [],
            interactions: existing?.interactions || [],
            updatedAt: Date.now(),
            lastContacted: existing?.lastContacted
        };
        await saveLead(updated);
        await refreshLeads();
    }, [refreshLeads]);

    const addLeadNote = useCallback(async (place: PlaceSummary, text: string) => {
        const existing = await getLead(place.place_id);
        const note: LeadNote = { id: Math.random().toString(36).substr(2, 9), text, timestamp: Date.now() };
        const updated: LeadData = {
            place_id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address || '',
            rating: place.rating,
            status: existing?.status || 'New',
            notes: [note, ...(existing?.notes || [])],
            interactions: existing?.interactions || [],
            updatedAt: Date.now(),
        };
        await saveLead(updated);
        await refreshLeads();
    }, [refreshLeads]);

    const logInteraction = useCallback(async (place: PlaceSummary, type: InteractionLog['type'], details: string) => {
        const existing = await getLead(place.place_id);
        const log: InteractionLog = { id: Math.random().toString(36).substr(2, 9), type, details, timestamp: Date.now() };
        const updated: LeadData = {
            place_id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address || '',
            rating: place.rating,
            status: existing?.status || 'New',
            notes: existing?.notes || [],
            interactions: [log, ...(existing?.interactions || [])],
            updatedAt: Date.now(),
            lastContacted: Date.now()
        };
        await saveLead(updated);
        await refreshLeads();
    }, [refreshLeads]);

    return {
        interactedLeads,
        updateLeadStatus,
        addLeadNote,
        logInteraction,
        refreshLeads
    };
}
