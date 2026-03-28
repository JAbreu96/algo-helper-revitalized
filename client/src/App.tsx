import { useState, useCallback, useEffect } from 'react'
import { Card, ListId } from './types'
import { AuthProvider, useAuth } from './AuthContext'
import * as api from './api'
import Board from './components/Board'
import CardModal from './components/CardModal'
import AuthPage from './components/AuthPage'

interface BoardData {
  lists: Record<ListId, Card[]>
}

function emptyBoard(): BoardData {
  return {
    lists: { backlog: [], todo: [], doing: [], done: [], revisit: [] },
  }
}

function apiCardToCard(c: api.CardData): Card {
  return {
    id: c.id,
    listId: c.listId as ListId,
    title: c.title,
    description: c.description,
    timeCompleted: c.timeCompleted,
    notes: c.notes,
    techniques: c.techniques,
    websiteUrl: c.websiteUrl,
    difficulty: c.difficulty as Card['difficulty'],
    dataStructures: c.dataStructures,
    createdAt: c.createdAt,
  }
}

function KanbanApp() {
  const { user, loading, logout } = useAuth()
  const [board, setBoard] = useState<BoardData>(emptyBoard)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [addingToList, setAddingToList] = useState<ListId | null>(null)
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [boardLoading, setBoardLoading] = useState(true)

  // Fetch board data from API
  useEffect(() => {
    if (!user) return
    setBoardLoading(true)
    api
      .fetchBoard()
      .then((apiBoard) => {
        const lists = emptyBoard().lists
        for (const [listId, cards] of Object.entries(apiBoard)) {
          if (listId in lists) {
            lists[listId as ListId] = cards.map(apiCardToCard)
          }
        }
        setBoard({ lists })
      })
      .catch(console.error)
      .finally(() => setBoardLoading(false))
  }, [user])

  const findCardList = useCallback(
    (cardId: string): ListId | undefined => {
      return (Object.keys(board.lists) as ListId[]).find((lid) =>
        board.lists[lid].some((c) => c.id === cardId),
      )
    },
    [board.lists],
  )

  const findCard = useCallback(
    (cardId: string): Card | undefined => {
      for (const cards of Object.values(board.lists)) {
        const card = cards.find((c) => c.id === cardId)
        if (card) return card
      }
      return undefined
    },
    [board.lists],
  )

  const handleAddCard = useCallback(
    async (listId: ListId, card: Card) => {
      // Optimistic update
      setBoard((prev) => ({
        lists: {
          ...prev.lists,
          [listId]: [...prev.lists[listId], card],
        },
      }))

      try {
        await api.createCard({
          id: card.id,
          listId,
          title: card.title,
          description: card.description,
          timeCompleted: card.timeCompleted,
          notes: card.notes,
          techniques: card.techniques,
          websiteUrl: card.websiteUrl,
          difficulty: card.difficulty,
          dataStructures: card.dataStructures,
          createdAt: card.createdAt,
        })
      } catch (err) {
        console.error('Failed to create card:', err)
        // Revert
        setBoard((prev) => ({
          lists: {
            ...prev.lists,
            [listId]: prev.lists[listId].filter((c) => c.id !== card.id),
          },
        }))
      }
    },
    [],
  )

  const handleUpdateCard = useCallback(
    async (card: Card) => {
      const listId = findCardList(card.id)
      if (!listId) return

      setBoard((prev) => ({
        lists: {
          ...prev.lists,
          [listId]: prev.lists[listId].map((c) => (c.id === card.id ? card : c)),
        },
      }))

      try {
        await api.updateCard(card.id, {
          title: card.title,
          description: card.description,
          timeCompleted: card.timeCompleted,
          notes: card.notes,
          techniques: card.techniques,
          websiteUrl: card.websiteUrl,
          difficulty: card.difficulty,
          dataStructures: card.dataStructures,
        })
      } catch (err) {
        console.error('Failed to update card:', err)
      }
    },
    [findCardList],
  )

  const handleDeleteCard = useCallback(
    async (cardId: string) => {
      const listId = findCardList(cardId)
      if (!listId) return

      const removed = board.lists[listId].find((c) => c.id === cardId)
      setBoard((prev) => ({
        lists: {
          ...prev.lists,
          [listId]: prev.lists[listId].filter((c) => c.id !== cardId),
        },
      }))

      try {
        await api.deleteCard(cardId)
      } catch (err) {
        console.error('Failed to delete card:', err)
        if (removed) {
          setBoard((prev) => ({
            lists: { ...prev.lists, [listId]: [...prev.lists[listId], removed] },
          }))
        }
      }
    },
    [findCardList, board.lists],
  )

  const handleDrop = useCallback(
    async (targetList: ListId) => {
      if (!draggedCardId) return
      const sourceList = findCardList(draggedCardId)
      if (!sourceList || sourceList === targetList) {
        setDraggedCardId(null)
        return
      }

      const card = board.lists[sourceList].find((c) => c.id === draggedCardId)
      if (!card) return

      // Optimistic move
      setBoard((prev) => ({
        lists: {
          ...prev.lists,
          [sourceList]: prev.lists[sourceList].filter((c) => c.id !== draggedCardId),
          [targetList]: [...prev.lists[targetList], { ...card, listId: targetList }],
        },
      }))
      setDraggedCardId(null)

      try {
        await api.moveCard(draggedCardId, targetList)
      } catch (err) {
        console.error('Failed to move card:', err)
        // Revert
        setBoard((prev) => ({
          lists: {
            ...prev.lists,
            [targetList]: prev.lists[targetList].filter((c) => c.id !== card.id),
            [sourceList]: [...prev.lists[sourceList], card],
          },
        }))
      }
    },
    [draggedCardId, findCardList, board.lists],
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Algorithm &amp; Data Structures Study Board
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your problem-solving progress across topics and techniques
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {user.displayName || user.email}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        {boardLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Loading your board...</p>
          </div>
        ) : (
          <Board
            board={board}
            onAddCard={setAddingToList}
            onEditCard={(id) => setEditingCard(findCard(id) ?? null)}
            onDeleteCard={handleDeleteCard}
            onDragStart={setDraggedCardId}
            onDrop={handleDrop}
            draggedCardId={draggedCardId}
          />
        )}
      </main>

      {(addingToList || editingCard) && (
        <CardModal
          card={editingCard}
          listId={addingToList}
          onSave={(card, listId) => {
            if (editingCard) {
              handleUpdateCard(card)
            } else if (listId) {
              handleAddCard(listId, card)
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

function App() {
  return (
    <AuthProvider>
      <KanbanApp />
    </AuthProvider>
  )
}

export default App
