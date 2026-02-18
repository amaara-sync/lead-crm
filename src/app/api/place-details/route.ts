import { NextRequest, NextResponse } from 'next/server';

const PLACE_FIELDS = [
    'place_id',
    'name',
    'types',
    'business_status',
    'geometry',
    'vicinity',
    'plus_code',
    'icon',
    'url',
    'utc_offset',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'address_components',
    'formatted_address',
    'opening_hours',
    'rating',
    'user_ratings_total',
    'reviews',
    'photos',
    'price_level',
    'permanently_closed',
    'adr_address',
    'icon_mask_base_uri',
    'icon_background_color',
    'editorial_summary',
    'secondary_opening_hours',
    'curbside_pickup',
    'delivery',
    'takeout',
    'dine_in',
    'serves_beer',
    'serves_wine',
    'serves_breakfast',
    'serves_lunch',
    'serves_dinner',
    'serves_brunch',
    'serves_vegetarian_food',
    'wheelchair_accessible_entrance',
    'reservable',
].join(',');

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');
    const apiKey = request.headers.get('x-api-key') || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 400 });
    }

    if (!placeId) {
        return NextResponse.json({ error: 'place_id parameter is required' }, { status: 400 });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${PLACE_FIELDS}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            return NextResponse.json(
                { error: data.error_message || data.status, status: data.status },
                { status: 400 }
            );
        }

        return NextResponse.json({ result: data.result, status: data.status });
    } catch (error) {
        console.error('Place details API error:', error);
        return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
    }
}
