import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SearchSession, LeadData } from '@/types';

interface LeadCRMDB extends DBSchema {
    sessions: {
        key: string;
        value: SearchSession;
        indexes: { 'by-timestamp': number };
    };
    leads: {
        key: string;
        value: LeadData;
        indexes: { 'by-status': string; 'by-updated': number };
    };
}

let dbPromise: Promise<IDBPDatabase<LeadCRMDB>> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<LeadCRMDB>('lead-crm-db', 2, {
            upgrade(db, oldVersion) {
                if (oldVersion < 1) {
                    const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
                    sessionStore.createIndex('by-timestamp', 'timestamp');
                }
                if (oldVersion < 2) {
                    const leadStore = db.createObjectStore('leads', { keyPath: 'place_id' });
                    leadStore.createIndex('by-status', 'status');
                    leadStore.createIndex('by-updated', 'updatedAt');
                }
            },
        });
    }
    return dbPromise;
}

export async function saveSession(session: SearchSession): Promise<void> {
    const db = await getDB();
    await db.put('sessions', session);
}

export async function getSession(id: string): Promise<SearchSession | undefined> {
    const db = await getDB();
    return db.get('sessions', id);
}

export async function getAllSessions(): Promise<SearchSession[]> {
    const db = await getDB();
    const sessions = await db.getAllFromIndex('sessions', 'by-timestamp');
    return sessions.reverse(); // newest first
}

export async function deleteSession(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('sessions', id);
}

// Lead CRM Methods
export async function saveLead(lead: LeadData): Promise<void> {
    const db = await getDB();
    await db.put('leads', lead);
}

export async function getLead(place_id: string): Promise<LeadData | undefined> {
    const db = await getDB();
    return db.get('leads', place_id);
}

export async function getAllLeads(): Promise<LeadData[]> {
    const db = await getDB();
    return db.getAllFromIndex('leads', 'by-updated');
}

export async function deleteLead(place_id: string): Promise<void> {
    const db = await getDB();
    await db.delete('leads', place_id);
}

export function buildSessionId(area: string, type: string): string {
    return `${area.trim().toLowerCase()}::${type.trim().toLowerCase()}`;
}
