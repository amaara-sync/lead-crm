'use client';

import { useState, useCallback } from 'react';
import { useApiKey } from './useApiKey';
import { PlaceSummary } from '@/types';

export function useApiClient() {
    const { apiKey } = useApiKey();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<PlaceSummary[]>([]);
    const [pagination, setPagination] = useState<{ nextPageToken?: string }>({});

    const getHeaders = useCallback((): HeadersInit => {
        const headers: HeadersInit = {};
        if (apiKey) headers['x-api-key'] = apiKey;
        return headers;
    }, [apiKey]);

    const search = useCallback(
        async (query: string, pageToken?: string, location?: string, radius?: number) => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (pageToken) {
                    params.set('pagetoken', pageToken);
                } else {
                    if (query) params.set('query', query);
                    if (location) params.set('location', location);
                    if (radius) params.set('radius', String(radius));
                }
                const res = await fetch(`/api/search?${params.toString()}`, {
                    headers: getHeaders(),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Search failed');

                if (pageToken) {
                    setResults(prev => [...prev, ...data.results]);
                } else {
                    setResults(data.results);
                }
                setPagination({ nextPageToken: data.next_page_token });
                return data;
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Unknown error';
                setError(msg);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [getHeaders]
    );

    const getPlaceDetails = useCallback(
        async (placeId: string) => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/place-details?place_id=${encodeURIComponent(placeId)}`, {
                    headers: getHeaders(),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to fetch details');
                return data.result;
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Unknown error';
                setError(msg);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [getHeaders]
    );

    const getPhotoUrl = useCallback(
        (photoReference: string, maxwidth = 800) => {
            const params = new URLSearchParams({
                photo_reference: photoReference,
                maxwidth: String(maxwidth),
            });
            return `/api/photo?${params.toString()}`;
        },
        []
    );

    return { search, getPlaceDetails, getPhotoUrl, loading, error, results, pagination, setResults, setPagination, setError };
}
