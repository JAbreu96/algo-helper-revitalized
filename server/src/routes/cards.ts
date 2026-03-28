import { Router, Request, Response } from 'express'
import { getCardsDb, CardRow } from '../db/cards'
import { requireAuth } from '../middleware/auth'

const router = Router()

// All card routes require authentication
router.use(requireAuth)

const VALID_LISTS = ['backlog', 'todo', 'doing', 'done', 'revisit']

function formatCard(row: CardRow) {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    description: row.description,
    timeCompleted: row.time_completed,
    notes: row.notes,
    techniques: JSON.parse(row.techniques),
    websiteUrl: row.website_url,
    difficulty: row.difficulty,
    dataStructures: JSON.parse(row.data_structures),
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// GET /api/cards — get all cards for the authenticated user
router.get('/', (req: Request, res: Response) => {
  const db = getCardsDb()
  const rows = db
    .prepare('SELECT * FROM cards WHERE user_id = ? ORDER BY list_id, position')
    .all(req.user!.userId) as CardRow[]

  // Group by list
  const board: Record<string, ReturnType<typeof formatCard>[]> = {}
  for (const listId of VALID_LISTS) {
    board[listId] = []
  }
  for (const row of rows) {
    const card = formatCard(row)
    if (board[card.listId]) {
      board[card.listId].push(card)
    }
  }

  res.json({ board })
})

// POST /api/cards — create a new card
router.post('/', (req: Request, res: Response) => {
  const {
    id,
    listId,
    title,
    description,
    timeCompleted,
    notes,
    techniques,
    websiteUrl,
    difficulty,
    dataStructures,
  } = req.body

  if (!id || !title) {
    res.status(400).json({ error: 'id and title are required' })
    return
  }

  if (listId && !VALID_LISTS.includes(listId)) {
    res.status(400).json({ error: 'Invalid list ID' })
    return
  }

  const db = getCardsDb()

  // Get next position in the target list
  const maxPos = db
    .prepare('SELECT COALESCE(MAX(position), -1) as max_pos FROM cards WHERE user_id = ? AND list_id = ?')
    .get(req.user!.userId, listId || 'backlog') as { max_pos: number }

  db.prepare(
    `INSERT INTO cards (id, user_id, list_id, title, description, time_completed, notes, techniques, website_url, difficulty, data_structures, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    req.user!.userId,
    listId || 'backlog',
    title,
    description || '',
    timeCompleted || '',
    notes || '',
    JSON.stringify(techniques || []),
    websiteUrl || '',
    difficulty || 'Medium',
    JSON.stringify(dataStructures || []),
    maxPos.max_pos + 1,
  )

  const row = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(
    id,
    req.user!.userId,
  ) as CardRow

  res.status(201).json({ card: formatCard(row) })
})

// PUT /api/cards/:id — update a card
router.put('/:id', (req: Request, res: Response) => {
  const db = getCardsDb()

  const existing = db
    .prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.userId) as CardRow | undefined

  if (!existing) {
    res.status(404).json({ error: 'Card not found' })
    return
  }

  const {
    title,
    description,
    timeCompleted,
    notes,
    techniques,
    websiteUrl,
    difficulty,
    dataStructures,
  } = req.body

  db.prepare(
    `UPDATE cards SET
       title = ?, description = ?, time_completed = ?, notes = ?,
       techniques = ?, website_url = ?, difficulty = ?, data_structures = ?,
       updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`,
  ).run(
    title ?? existing.title,
    description ?? existing.description,
    timeCompleted ?? existing.time_completed,
    notes ?? existing.notes,
    techniques ? JSON.stringify(techniques) : existing.techniques,
    websiteUrl ?? existing.website_url,
    difficulty ?? existing.difficulty,
    dataStructures ? JSON.stringify(dataStructures) : existing.data_structures,
    req.params.id,
    req.user!.userId,
  )

  const updated = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(
    req.params.id,
    req.user!.userId,
  ) as CardRow

  res.json({ card: formatCard(updated) })
})

// PATCH /api/cards/:id/move — move a card to a different list
router.patch('/:id/move', (req: Request, res: Response) => {
  const { listId } = req.body

  if (!listId || !VALID_LISTS.includes(listId)) {
    res.status(400).json({ error: 'Valid listId is required' })
    return
  }

  const db = getCardsDb()

  const existing = db
    .prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user!.userId) as CardRow | undefined

  if (!existing) {
    res.status(404).json({ error: 'Card not found' })
    return
  }

  const maxPos = db
    .prepare('SELECT COALESCE(MAX(position), -1) as max_pos FROM cards WHERE user_id = ? AND list_id = ?')
    .get(req.user!.userId, listId) as { max_pos: number }

  db.prepare(
    `UPDATE cards SET list_id = ?, position = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
  ).run(listId, maxPos.max_pos + 1, req.params.id, req.user!.userId)

  const updated = db.prepare('SELECT * FROM cards WHERE id = ? AND user_id = ?').get(
    req.params.id,
    req.user!.userId,
  ) as CardRow

  res.json({ card: formatCard(updated) })
})

// DELETE /api/cards/:id — delete a card
router.delete('/:id', (req: Request, res: Response) => {
  const db = getCardsDb()

  const result = db
    .prepare('DELETE FROM cards WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user!.userId)

  if (result.changes === 0) {
    res.status(404).json({ error: 'Card not found' })
    return
  }

  res.json({ success: true })
})

export default router
