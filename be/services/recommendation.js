const { toolDefinition, executeFindMaps } = require('../tools/findMaps')
const { callLLM } = require('../llm/client')

const systemPrompt = `You are a helpful maps recommendation assistant.
Your job is to help users find places based on their needs.
Always use the findMaps tool to search for relevant locations before giving recommendations.`

function enhanceQuery(rawQuery) {
  return `Find me places matching this request: "${rawQuery}".
Search for relevant locations and provide a helpful recommendation.`
}

async function getRecommendations(userQuery) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: enhanceQuery(userQuery) },
  ]

  const firstResponse = await callLLM(messages, [toolDefinition])

  const toolCalls = firstResponse.choices[0]?.message?.tool_calls
  if (!toolCalls || toolCalls.length === 0) {
    throw new Error('LLM did not produce a tool call')
  }

  messages.push(firstResponse.choices[0].message)

  const locations = []

  for (const toolCall of toolCalls) {
    if (toolCall.function.name === 'findMaps') {
      const { query } = JSON.parse(toolCall.function.arguments)
      const result = await executeFindMaps(query)
      locations.push(...result)

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      })
    }
  }

  const secondResponse = await callLLM(messages)

  const recommendation = secondResponse.choices[0]?.message?.content || ''

  return { recommendation, locations }
}

module.exports = { getRecommendations }
