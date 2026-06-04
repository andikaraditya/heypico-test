# API Documentation

Base URL: `http://localhost:3000`

---

## GET /test

Health check endpoint.

**Response `200`:**

```json
{
  "message": "Hello, world!"
}
```

---

## POST /api/recommendations

Get location recommendations for a given query. The server calls an LLM to generate a search query, fetches locations via the LatLng API, then asks the LLM to produce a final recommendation.

**Request body:**

| Field | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| query | string | yes      | The user's search request |

**Response `200`:**

| Field          | Type   | Description                              |
|----------------|--------|------------------------------------------|
| recommendation | string | LLM-generated recommendation text        |
| locations      | array  | List of locations from the LatLng API    |

Each location object:

| Field        | Type   | Description                     |
|--------------|--------|---------------------------------|
| name         | string | Place name                      |
| address      | string | Formatted address               |
| rating       | number | Google Maps rating (nullable)   |
| totalRatings | number | Total number of user ratings    |
| placeId      | string | Google Maps place ID            |
| location     | object | `{ lat, lng }` or `null`       |

**Response `400`:**

```json
{
  "error": "query is required"
}
```

**Response `500`:**

```json
{
  "error": "Internal server error"
}
```

### Sample request

```json
{
  "query": "coffee shops in downtown"
}
```

### Sample response

```json
{
  "recommendation": "Here are some great coffee shops in downtown I found for you!",
  "locations": [
    {
      "name": "Starbucks",
      "address": "123 Main St, Downtown, CA 90210",
      "rating": 4.3,
      "totalRatings": 1250,
      "placeId": "ChIJ...",
      "location": {
        "lat": 34.0522,
        "lng": -118.2437
      }
    }
  ]
}
```

---

## Environment Variables

| Variable            | Description                     |
|---------------------|---------------------------------|
| `PORT`              | Server port (default: `3000`)   |
| `LLM_BASE_URL`      | OpenAI-compatible base URL      |
| `LLM_API_KEY`       | API key for the LLM             |
| `LLM_MODEL`         | Model name (e.g. `gpt-4o-mini`) |
| `LATLNG_API_KEY`      | API key for the LatLng API    |
| `LAT`                 | Default latitude (default: `-6.200000`) |
| `LON`                 | Default longitude (default: `106.816666`) |
