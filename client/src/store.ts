import { BoardState } from './types'

const STORAGE_KEY = 'algo-kanban-board'

export function loadBoard(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as BoardState
  } catch {
    // ignore corrupt data
  }
  return {
    lists: {
      backlog: [],
      todo: [],
      doing: [],
      done: [],
      revisit: [],
    },
    cards: {},
  }
}

export function saveBoard(state: BoardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
