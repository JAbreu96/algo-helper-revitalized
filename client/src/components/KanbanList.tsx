import { Card, ListId } from '../types'
import KanbanCard from './KanbanCard'
import { DragEvent, useState } from 'react'

interface KanbanListProps {
  listId: ListId
  label: string
  color: string
  cards: Card[]
  onAddCard: () => void
  onEditCard: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
  onDragStart: (cardId: string) => void
  onDrop: () => void
  isDragTarget: boolean
}

export default function KanbanList({
  label,
  color,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDrop,
  isDragTarget,
}: KanbanListProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => setIsOver(false)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    onDrop()
  }

  return (
    <div
      className={`w-80 flex-shrink-0 rounded-lg bg-gray-800 flex flex-col max-h-[calc(100vh-140px)] transition-all ${
        isDragTarget && isOver ? 'ring-2 ring-blue-400 bg-gray-750' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* List header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="font-semibold text-sm uppercase tracking-wider">{label}</h2>
        <span className="ml-auto text-xs text-gray-400 bg-gray-700 rounded-full px-2 py-0.5">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="kanban-list flex-1 overflow-y-auto p-3 space-y-3">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onEdit={() => onEditCard(card.id)}
            onDelete={() => onDeleteCard(card.id)}
            onDragStart={() => onDragStart(card.id)}
          />
        ))}

        {cards.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-8">No cards yet</p>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={onAddCard}
        className="m-3 mt-0 py-2 rounded-md border-2 border-dashed border-gray-600 text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
      >
        + Add Card
      </button>
    </div>
  )
}
