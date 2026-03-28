import { useState, FormEvent } from 'react'
import { Card, Difficulty, ListId } from '../types'

interface CardModalProps {
  card: Card | null
  listId: ListId | null
  onSave: (card: Card, listId?: ListId) => void
  onClose: () => void
}

const COMMON_DATA_STRUCTURES = [
  'Array',
  'Linked List',
  'Stack',
  'Queue',
  'Hash Map',
  'Hash Set',
  'Binary Tree',
  'BST',
  'Heap',
  'Graph',
  'Trie',
  'Matrix',
]

const COMMON_TECHNIQUES = [
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'BFS',
  'DFS',
  'Dynamic Programming',
  'Backtracking',
  'Greedy',
  'Divide & Conquer',
  'Recursion',
  'Sorting',
  'Bit Manipulation',
  'Union Find',
  'Topological Sort',
  'Memoization',
]

export default function CardModal({ card, listId, onSave, onClose }: CardModalProps) {
  const [title, setTitle] = useState(card?.title ?? '')
  const [description, setDescription] = useState(card?.description ?? '')
  const [timeCompleted, setTimeCompleted] = useState(card?.timeCompleted ?? '')
  const [notes, setNotes] = useState(card?.notes ?? '')
  const [techniques, setTechniques] = useState<string[]>(card?.techniques ?? [])
  const [customTechnique, setCustomTechnique] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState(card?.websiteUrl ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(card?.difficulty ?? 'Medium')
  const [dataStructures, setDataStructures] = useState<string[]>(card?.dataStructures ?? [])
  const [customDs, setCustomDs] = useState('')

  const toggleTag = (tag: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag])
  }

  const addCustomTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setClear: (v: string) => void,
  ) => {
    const trimmed = value.trim()
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed])
    }
    setClear('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newCard: Card = {
      id: card?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      timeCompleted: timeCompleted.trim(),
      notes: notes.trim(),
      techniques,
      websiteUrl: websiteUrl.trim(),
      difficulty,
      dataStructures,
      createdAt: card?.createdAt ?? new Date().toISOString(),
    }

    onSave(newCard, listId ?? undefined)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-12 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl mx-4 mb-12 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">
            {card ? 'Edit Card' : 'New Card'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Problem Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Two Sum"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Problem Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the problem..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Difficulty + Time row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
              <div className="flex gap-2">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-green-600 text-white'
                          : d === 'Medium'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time Completed</label>
              <input
                type="text"
                value={timeCompleted}
                onChange={(e) => setTimeCompleted(e.target.value)}
                placeholder="e.g. 25 min"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Website / Source URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="e.g. https://leetcode.com/problems/two-sum"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Data Structures */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data Structures</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_DATA_STRUCTURES.map((ds) => (
                <button
                  key={ds}
                  type="button"
                  onClick={() => toggleTag(ds, dataStructures, setDataStructures)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    dataStructures.includes(ds)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {ds}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDs}
                onChange={(e) => setCustomDs(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomTag(customDs, dataStructures, setDataStructures, setCustomDs)
                  }
                }}
                placeholder="Add custom data structure..."
                className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomTag(customDs, dataStructures, setDataStructures, setCustomDs)
                }
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Techniques */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Techniques</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_TECHNIQUES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t, techniques, setTechniques)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    techniques.includes(t)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTechnique}
                onChange={(e) => setCustomTechnique(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomTag(customTechnique, techniques, setTechniques, setCustomTechnique)
                  }
                }}
                placeholder="Add custom technique..."
                className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() =>
                  addCustomTag(customTechnique, techniques, setTechniques, setCustomTechnique)
                }
                className="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Key takeaways, patterns to remember, edge cases..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 font-medium transition-colors"
            >
              {card ? 'Save Changes' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
