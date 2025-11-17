import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch("http://localhost:8080/business-app/api/session", {
        method: "GET",
        credentials: "include"
      })
      const data = await response.json()
      if (data.loggedIn) {
        setLoggedIn(true)
        setUser(data.user)
      } else {
        setLoggedIn(false)
        setUser(null)
      }
    } catch (err) {
      console.error("Session check failed:", err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/business-app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
        credentials: "include"
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setLoggedIn(true)
        setUser(username)
        setUsername('')
        setPassword('')
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/business-app/api/logout", {
        method: "POST",
        credentials: "include"
      })

      const data = await response.json()
      if (data.success) {
        setLoggedIn(false)
        setUser(null)
      }
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <div className="app">
      <h1>ログイン用 SPA</h1>
      
      {loggedIn ? (
        <div className="logged-in">
          <p>ログイン済み: <strong>{user}</strong></p>
          <button onClick={handleLogout}>ログアウト</button>
          <button onClick={checkSession} style={{ marginLeft: '10px' }}>セッション確認</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error">{error}</div>}
          <div>
            <label>
              ユーザー名:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              パスワード:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      )}

      <div className="info">
        <p>テストユーザー: testuser / secret</p>
      </div>
    </div>
  )
}

export default App
