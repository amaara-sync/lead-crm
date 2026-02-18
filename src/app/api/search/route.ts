import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const pageToken = searchParams.get('pagetoken');
    const location = searchParams.get('location'); // lat,lng
    const radius = searchParams.get('radius'); // in meters
    const apiKey = request.headers.get('x-api-key') || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    if (!query && !pageToken && !location) {
        return NextResponse.json({ error: 'query or location parameter is required' }, { status: 400 });
    }

    try {
        let url: string;

        if (pageToken) {
            url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${encodeURIComponent(pageToken)}&key=${apiKey}`;
        } else {
            url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}`;
            if (query) url += `&query=${encodeURIComponent(query)}`;
            if (location) url += `&location=${encodeURIComponent(location)}`;
            if (radius) url += `&radius=${encodeURIComponent(radius)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            return NextResponse.json(
                { error: data.error_message || data.status, status: data.status },
                { status: 400 }
            );
        }

        return NextResponse.json({
            results: data.results || [],
            next_page_token: data.next_page_token,
            status: data.status,
        });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Failed to fetch from Google Maps API' }, { status: 500 });
    }
}
