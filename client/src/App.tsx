import { useState, useCallback } from 'react'
import { BoardState, Card, ListId } from './types'
import { loadBoard, saveBoard } from './store'
import Board from './components/Board'
import CardModal from './components/CardModal'

function App() {
  const [board, setBoard] = useState<BoardState>(loadBoard)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [addingToList, setAddingToList] = useState<ListId | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)

  const persist = useCallback((next: BoardState) => {
    setBoard(next)
    saveBoard(next)
  }, [])

  const addCard = useCallback(
    (listId: ListId, card: Card) => {
      persist({
        lists: { ...board.lists, [listId]: [...board.lists[listId], card.id] },
        cards: { ...board.cards, [card.id]: card },
      })
    },
    [board, persist],
  )

  const updateCard = useCallback(
    (card: Card) => {
      persist({
        ...board,
        cards: { ...board.cards, [card.id]: card },
      })
    },
    [board, persist],
  )

  const deleteCard = useCallback(
    (cardId: string) => {
      const nextLists = { ...board.lists }
      for (const listId of Object.keys(nextLists) as ListId[]) {
        nextLists[listId] = nextLists[listId].filter((id) => id !== cardId)
      }
      const nextCards = { ...board.cards }
      delete nextCards[cardId]
      persist({ lists: nextLists, cards: nextCards })
    },
    [board, persist],
  )

  const moveCard = useCallback(
    (cardId: string, fromList: ListId, toList: ListId) => {
      if (fromList === toList) return
      persist({
        ...board,
        lists: {
          ...board.lists,
          [fromList]: board.lists[fromList].filter((id) => id !== cardId),
          [toList]: [...board.lists[toList], cardId],
        },
      })
    },
    [board, persist],
  )

  const handleDrop = useCallback(
    (targetList: ListId) => {
      if (!draggedCardId) return
      const sourceList = (Object.keys(board.lists) as ListId[]).find((lid) =>
        board.lists[lid].includes(draggedCardId),
      )
      if (sourceList) moveCard(draggedCardId, sourceList, targetList)
      setDraggedCardId(null)
    },
    [draggedCardId, board.lists, moveCard],
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Algorithm &amp; Data Structures Study Board
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Track your problem-solving progress across topics and techniques
        </p>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        <Board
          board={board}
          onAddCard={setAddingToList}
          onEditCard={(id) => setEditingCard(board.cards[id])}
          onDeleteCard={deleteCard}
          onDragStart={setDraggedCardId}
          onDrop={handleDrop}
          draggedCardId={draggedCardId}
        />
      </main>

      {(addingToList || editingCard) && (
        <CardModal
          card={editingCard}
          listId={addingToList}
          onSave={(card, listId) => {
            if (editingCard) {
              updateCard(card)
            } else if (listId) {
              addCard(listId, card)
            }
            setEditingCard(null)
            setAddingToList(null)
          }}
          onClose={() => {
            setEditingCard(null)
            setAddingToList(null)
          }}
        />
      )}
    </div>
  )
}

export default App
