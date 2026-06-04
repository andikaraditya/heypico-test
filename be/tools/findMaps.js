const { latlngApiKey, lat, lon } = require('../config')

const toolDefinition = {
  type: 'function',
  function: {
    name: 'findMaps',
    description: 'Search for locations based on a query',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for finding locations',
        },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
}

async function executeFindMaps(query) {
  const url = new URL('https://api.latlng.work/v1/places/search')
  url.searchParams.set('q', query)
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('limit', 5)

  const response = await fetch(url.toString(), {
    headers: { 'X-Api-Key': latlngApiKey },
  })

  if (!response.ok) {
    throw new Error(`LatLng API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  return (data.places || []).map((place) => ({
    name: place.name,
    address: [place.locality, place.country].filter(Boolean).join(', '),
    rating: null,
    totalRatings: 0,
    placeId: place.id,
    location: { lat: place.lat, lng: place.lon },
    mapsUrl: `https://www.google.com/maps?q=${place.lat},${place.lon}`,
  }))
}

module.exports = { toolDefinition, executeFindMaps }
