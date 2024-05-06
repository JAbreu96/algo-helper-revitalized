import { Dashboard } from 'pages'

const kanbanBoard: Map<string, Array<object>> = new Map()
  .set('todo', [])
  .set('done', [])
  .set('inProgress', [])
  .set('needsWork', [])

function App() {
  return (
    <div className="relative overflow-hidden bg-white">
      <Dashboard lists={kanbanBoard} />
    </div>
  )
}

export default App
