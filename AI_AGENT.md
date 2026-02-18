# AI Agent Capabilities & API Reference

Welcome, Agent. This document defines the capabilities and interfaces of the Lead CRM system. You can use these APIs to discover businesses, fetch detailed profiles, and integrate with sales workflows.

## System Overview
The Lead CRM is a Next.js-powered tool that interfaces with the Google Places API. It provides structured business data and allows local persistence of lead status and interaction history.

## Authentication
All API requests require a Google Maps API Key passed in the custom header:
`x-api-key: YOUR_API_KEY`

---

## API Endpoints

### 1. Search Businesses
`GET /api/search`

Find businesses by query, location, and radius.

**Query Parameters:**
- `query` (string, optional): Search query (e.g., "Dentists in Bhopal").
- `location` (string, optional): Lat/Lng coordinates (e.g., "23.2599,77.4126").
- `radius` (number, optional): Radius in meters (e.g., 5000).
- `pagetoken` (string, optional): Token for the next page of results.

**Response Schema:**
```json
{
  "results": [
    {
      "place_id": "string",
      "name": "string",
      "vicinity": "string",
      "rating": number,
      "user_ratings_total": number,
      "business_status": "string"
    }
  ],
  "next_page_token": "string"
}
```

### 2. Get Place Details
`GET /api/place-details`

Fetch full profile for a specific business.

**Query Parameters:**
- `place_id` (string, required): The unique Google Place ID.

**Response Schema:**
Includes address, phone, website, opening hours, and reviews.

### 3. Fetch Photo
`GET /api/photo`

**Query Parameters:**
- `photo_reference` (string, required): Reference from search/details results.
- `maxwidth` (number, optional): Default 800.

---

## Tool Definitions (OpenAI Format)

Copy these definitions to your system prompt or tool configuration:

```json
[
  {
    "name": "search_leads",
    "description": "Search for local businesses and leads using keywords, location, and radius.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": { "type": "string", "description": "e.g. 'Software companies in Indrapuri'" },
        "location": { "type": "string", "description": "Lat,Lng coordinates" },
        "radius": { "type": "number", "description": "Radius in meters" }
      },
      "required": ["query"]
    }
  },
  {
    "name": "get_lead_details",
    "description": "Get full business profile including contact info, website, and reviews.",
    "parameters": {
      "type": "object",
      "properties": {
        "place_id": { "type": "string", "description": "The place_id from search results" }
      },
      "required": ["place_id"]
    }
  }
]
```

---

## Workspace Integration
The frontend uses **IndexedDB** for local persistence of lead status. While the APIs provide the raw data, the "CRM" logic (marking a lead as contacted) is currently client-side. Agents should focus on data discovery and profile extraction.
