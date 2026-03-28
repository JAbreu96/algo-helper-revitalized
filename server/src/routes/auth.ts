import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { getAuthDb, UserRow } from '../db/auth'
import { signToken, requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' })
      return
    }

    const db = getAuthDb()
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = db
      .prepare('INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)')
      .run(email, passwordHash, displayName || '')

    const token = signToken({ userId: Number(result.lastInsertRowid), email })

    res.status(201).json({
      token,
      user: { id: result.lastInsertRowid, email, displayName: displayName || '' },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const db = getAuthDb()
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
      | UserRow
      | undefined

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email })

    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.display_name },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const db = getAuthDb()
  const user = db.prepare('SELECT id, email, display_name, created_at FROM users WHERE id = ?').get(
    req.user!.userId,
  ) as UserRow | undefined

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: user.created_at,
  })
})

export default router
