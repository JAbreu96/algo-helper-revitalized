import { Dashboard, Auth } from 'pages'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const kanbanBoard: Map<string, object[]> = new Map()
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
          {/* <Route path="/signin" element={<Auth authType="signIn" />} />
          <Route path="/signup" element={<Auth authType="signUp" />} />
          <Route
            path="/forgotpassword"
            element={<Auth authType="forgotPassword" />}
          /> */}
        </Routes>
      </Router>
    </div>
  )
}

export default App
