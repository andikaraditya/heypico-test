const express = require('express')
const cors = require('cors')
const recommendationsRouter = require('./routes/recommendations')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`)
  })
  next()
})

app.get('/test', (req, res) => {
  res.json({ message: 'Hello, world!' })
})

app.use('/api/recommendations', recommendationsRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = app
