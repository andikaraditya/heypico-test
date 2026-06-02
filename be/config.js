const baseURL = process.env.LLM_BASE_URL
const apiKey = process.env.LLM_API_KEY
const model = process.env.LLM_MODEL
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY

if (!baseURL || !apiKey || !model) {
  throw new Error('Missing required env vars: LLM_BASE_URL, LLM_API_KEY, LLM_MODEL')
}

if (!googleMapsApiKey) {
  throw new Error('Missing required env var: GOOGLE_MAPS_API_KEY')
}

module.exports = { baseURL, apiKey, model, googleMapsApiKey }
