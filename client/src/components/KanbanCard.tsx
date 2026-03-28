import { Card, Difficulty } from '../types'

interface KanbanCardProps {
  card: Card
  onEdit: () => void
  onDelete: () => void
  onDragStart: () => void
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: 'bg-green-600 text-green-100',
  Medium: 'bg-yellow-600 text-yellow-100',
  Hard: 'bg-red-600 text-red-100',
}

export default function KanbanCard({ card, onEdit, onDelete, onDragStart }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-gray-700 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:bg-gray-650 border border-gray-600 hover:border-gray-500 transition-colors group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-tight">{card.title}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${difficultyColors[card.difficulty]}`}
        >
          {card.difficulty}
        </span>
      </div>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{card.description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.dataStructures.map((ds) => (
          <span
            key={ds}
            className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded"
          >
            {ds}
          </span>
        ))}
        {card.techniques.map((t) => (
          <span
            key={t}
            className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {card.timeCompleted && <span>Time: {card.timeCompleted}</span>}
          {card.websiteUrl && (
            <a
              href={card.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Source
            </a>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-gray-300"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 rounded bg-gray-600 hover:bg-red-600 text-gray-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
