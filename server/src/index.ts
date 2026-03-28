import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import authRoutes from './routes/auth'
import cardRoutes from './routes/cards'

const app = express()
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// Ensure data directory exists for SQLite databases
const dataDir = path.resolve(__dirname, '../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Middleware
if (NODE_ENV === 'production') {
  // In production, client is served from the same origin
  app.use(cors())
} else {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
}
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/cards', cardRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: NODE_ENV })
})

// Serve client static files in production
const clientDist = path.resolve(__dirname, '../client-dist')
if (NODE_ENV === 'production' && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))

  // SPA fallback — serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${NODE_ENV}]`)
})
