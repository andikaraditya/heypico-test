const OpenAI = require('openai')
const config = require('../config')

const openai = new OpenAI({ baseURL: config.baseURL, apiKey: config.apiKey })

async function callLLM(messages, tools) {
  const params = { model: config.model, messages }

  if (tools) {
    params.tools = tools
  }

  const response = await openai.chat.completions.create(params)

  return response
}

module.exports = { callLLM }
