import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const photoReference = searchParams.get('photo_reference');
    const maxwidth = searchParams.get('maxwidth') || '800';
    const apiKey = request.headers.get('x-api-key') || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    if (!photoReference) {
        return NextResponse.json({ error: 'photo_reference is required' }, { status: 400 });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${encodeURIComponent(photoReference)}&key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch photo' }, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Photo API error:', error);
        return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 });
    }
}
