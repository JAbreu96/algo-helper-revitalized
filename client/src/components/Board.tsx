import { BoardState, ListId, LIST_META } from '../types'
import KanbanList from './KanbanList'

interface BoardProps {
  board: BoardState
  onAddCard: (listId: ListId) => void
  onEditCard: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
  onDragStart: (cardId: string) => void
  onDrop: (targetList: ListId) => void
  draggedCardId: string | null
}

export default function Board({
  board,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDrop,
  draggedCardId,
}: BoardProps) {
  return (
    <div className="flex gap-4 min-w-max">
      {LIST_META.map((list) => (
        <KanbanList
          key={list.id}
          listId={list.id}
          label={list.label}
          color={list.color}
          cards={board.lists[list.id].map((id) => board.cards[id]).filter(Boolean)}
          onAddCard={() => onAddCard(list.id)}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onDragStart={onDragStart}
          onDrop={() => onDrop(list.id)}
          isDragTarget={draggedCardId !== null}
        />
      ))}
    </div>
  )
}
