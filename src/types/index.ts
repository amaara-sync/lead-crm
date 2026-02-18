export interface PlaceSummary {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  types?: string[];
  price_level?: number;
  opening_hours?: { open_now?: boolean };
  formatted_phone_number?: string;
  website?: string;
  photos?: { photo_reference: string; height: number; width: number; html_attributions: string[] }[];
  geometry?: { location: { lat: number; lng: number } };
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  plus_code?: { compound_code?: string; global_code?: string };
}

export interface PlaceReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

export interface OpeningHoursPeriod {
  open: { day: number; time: string };
  close?: { day: number; time: string };
}

export interface PlaceDetail extends PlaceSummary {
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  utc_offset_minutes?: number;
  adr_address?: string;
  formatted_address?: string;
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
    periods?: OpeningHoursPeriod[];
  };
  secondary_opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
    periods?: OpeningHoursPeriod[];
    secondary_hours_type?: string;
  }[];
  reviews?: PlaceReview[];
  photos?: PlacePhoto[];
  editorial_summary?: { language?: string; overview?: string };
  permanently_closed?: boolean;
  // Service options
  curbside_pickup?: boolean;
  delivery?: boolean;
  takeout?: boolean;
  dine_in?: boolean;
  serves_beer?: boolean;
  serves_wine?: boolean;
  serves_breakfast?: boolean;
  serves_lunch?: boolean;
  serves_dinner?: boolean;
  serves_brunch?: boolean;
  serves_vegetarian_food?: boolean;
  wheelchair_accessible_entrance?: boolean;
  reservable?: boolean;
  // CRM Data (attached locally)
  lead_data?: LeadData;
}

export type LeadStatus = 'New' | 'Attempted' | 'Contacted' | 'Qualified' | 'Unqualified' | 'Won' | 'Lost';

export interface LeadNote {
  id: string;
  text: string;
  timestamp: number;
}

export interface InteractionLog {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  details: string;
  timestamp: number;
}

export interface LeadData {
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  status: LeadStatus;
  lastContacted?: number;
  notes: LeadNote[];
  interactions: InteractionLog[];
  updatedAt: number;
}

export interface SearchSession {
  id: string; // "{area}::{type}"
  area: string;
  type: string;
  results: PlaceSummary[];
  nextPageToken?: string;
  timestamp: number;
  totalResults: number;
  radius?: number;
  unit?: 'km' | 'm';
}

export interface SearchResponse {
  results: PlaceSummary[];
  next_page_token?: string;
  status: string;
  error_message?: string;
}
