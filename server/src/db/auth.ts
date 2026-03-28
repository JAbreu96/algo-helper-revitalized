import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(__dirname, '../../data/auth.db')

let db: Database.Database

export function getAuthDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initAuthSchema(db)
  }
  return db
}

function initAuthSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

export interface UserRow {
  id: number
  email: string
  password_hash: string
  display_name: string
  created_at: string
}
