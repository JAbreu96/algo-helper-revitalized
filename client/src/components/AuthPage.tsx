import { useState, FormEvent } from 'react'
import { useAuth } from '../AuthContext'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, displayName)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Algorithm Study Board</h1>
          <p className="text-gray-400 mt-2">Track your progress across algorithms and data structures</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
          {/* Tab toggle */}
          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                isLogin ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
