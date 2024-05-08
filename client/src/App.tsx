import { Dashboard } from 'pages'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ListObject } from 'types/project_types'

const kanbanBoard: Map<string, ListObject> = new Map()
  .set('todo', { title: 'To Do', cards: [] })
  .set('done', { title: 'Done', cards: [] })
  .set('inProgress', { title: 'In Progress', cards: [] })
  .set('needsWork', { title: 'Needs Work', cards: [] })

function App() {
  return (
    <div className="relative overflow-hidden bg-white">
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard lists={kanbanBoard} />}
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
