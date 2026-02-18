'use client';

import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE = 'gmaps_api_key';

export function useApiKey() {
    const [apiKey, setApiKeyState] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(API_KEY_STORAGE) || '';
        setApiKeyState(stored);
        setIsLoaded(true);
    }, []);

    const setApiKey = useCallback((key: string) => {
        localStorage.setItem(API_KEY_STORAGE, key);
        setApiKeyState(key);
    }, []);

    const clearApiKey = useCallback(() => {
        localStorage.removeItem(API_KEY_STORAGE);
        setApiKeyState('');
    }, []);

    const maskedKey = apiKey
        ? apiKey.slice(0, 8) + '•'.repeat(Math.max(0, apiKey.length - 12)) + apiKey.slice(-4)
        : '';

    return { apiKey, maskedKey, setApiKey, clearApiKey, isLoaded, hasKey: !!apiKey };
}
