import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(__dirname, '../../data/cards.db')

let db: Database.Database

export function getCardsDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initCardsSchema(db)
  }
  return db
}

function initCardsSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      list_id TEXT NOT NULL DEFAULT 'backlog',
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      time_completed TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      techniques TEXT NOT NULL DEFAULT '[]',
      website_url TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL DEFAULT 'Medium',
      data_structures TEXT NOT NULL DEFAULT '[]',
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_cards_user_list
      ON cards(user_id, list_id);
  `)
}

export interface CardRow {
  id: string
  user_id: number
  list_id: string
  title: string
  description: string
  time_completed: string
  notes: string
  techniques: string
  website_url: string
  difficulty: string
  data_structures: string
  position: number
  created_at: string
  updated_at: string
}
