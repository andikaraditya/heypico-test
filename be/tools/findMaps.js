const { googleMapsApiKey } = require('../config')

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
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
  url.searchParams.set('query', query)
  url.searchParams.set('key', googleMapsApiKey)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Google Maps API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Maps API error: ${data.status} - ${data.error_message || ''}`)
  }

  return (data.results || []).map((place) => ({
    name: place.name,
    address: place.formatted_address,
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || 0,
    placeId: place.place_id,
    location: place.geometry?.location || null,
  }))
}

module.exports = { toolDefinition, executeFindMaps }
