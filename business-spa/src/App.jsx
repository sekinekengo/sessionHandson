import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("http://localhost:8080/business-app/api/data", {
        method: "GET",
        credentials: "include"
      })

      const result = await response.json()
      if (response.ok) {
        setData(result.data)
        setUser(result.user)
      } else if (response.status === 401) {
        setError(result.error || "Not logged in")
        setData(null)
        setUser(null)
      } else {
        setError("Unknown error occurred")
      }
    } catch (err) {
      setError("Network error: " + err.message)
      setData(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="app">
      <h1>実務用 SPA</h1>
      
      <div className="controls">
        <button onClick={fetchData} disabled={loading}>
          {loading ? '読み込み中...' : 'データ取得'}
        </button>
      </div>

      {error && (
        <div className="error">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {data && user && (
        <div className="data">
          <h2>データ</h2>
          <p><strong>ユーザー:</strong> {user}</p>
          <p><strong>データ:</strong> {data}</p>
        </div>
      )}

      {!data && !error && !loading && (
        <div className="info">
          <p>データを取得するには、まずログイン用SPAでログインしてください。</p>
        </div>
      )}
    </div>
  )
}

export default App
