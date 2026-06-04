const baseURL = process.env.LLM_BASE_URL
const apiKey = process.env.LLM_API_KEY
const model = process.env.LLM_MODEL
const latlngApiKey = process.env.LATLNG_API_KEY
const lat = parseFloat(process.env.LAT) || -6.2
const lon = parseFloat(process.env.LON) || 106.816666

console.log("Config loaded:", { baseURL, model, latlngApiKey: !!latlngApiKey, lat, lon })

if (!baseURL || !apiKey || !model) {
  throw new Error("Missing required env vars: LLM_BASE_URL, LLM_API_KEY, LLM_MODEL")
}

if (!latlngApiKey) {
  throw new Error("Missing required env var: LATLNG_API_KEY")
}

module.exports = { baseURL, apiKey, model, latlngApiKey, lat, lon }
