const { Router } = require('express')
const { getRecommendations } = require('../services/recommendation')

const router = Router()

router.post('/', async (req, res, next) => {
  const { query } = req.body

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'query is required' })
  }

  try {
    const result = await getRecommendations(query.trim())
    res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
