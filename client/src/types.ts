export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type ListId = 'backlog' | 'todo' | 'doing' | 'done' | 'revisit'

export interface Card {
  id: string
  listId?: ListId
  title: string
  description: string
  timeCompleted: string
  notes: string
  techniques: string[]
  websiteUrl: string
  difficulty: Difficulty
  dataStructures: string[]
  createdAt: string
}

export const LIST_META: { id: ListId; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { id: 'doing', label: 'Doing', color: 'bg-yellow-500' },
  { id: 'done', label: 'Done', color: 'bg-green-500' },
  { id: 'revisit', label: 'Revisit', color: 'bg-red-500' },
]
