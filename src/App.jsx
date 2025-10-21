import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Gallery from './pages/Gallery'
import About from './pages/About'

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  useEffect(() => {
    const savedUser = localStorage.getItem('username')
    if (savedUser) {
      setUsername(savedUser)
    } else {
      setUsername('')
    }
  }, [])

  return (
    <Router>
      {/* Navbar hanya muncul kalau sudah login */}
      {username && (
        <nav className="nav-bar">
          <Link to="/dashboard" className="nav-link">Gallery</Link>
          <Link to="/about" className="nav-link">Foto Terhapus</Link>
          <button
            onClick={() => {
              localStorage.removeItem('username')
              window.location.href = '/'
            }}
            className="btn-logout"
          >
            Logout
          </button>
        </nav>
      )}

      <Routes>
        {/* Default route: kalau sudah login, langsung ke dashboard */}
        <Route
          path="/"
          element={
            username
              ? <Navigate to="/dashboard" replace />
              : <Login setUsername={setUsername} />
          }
        />
        <Route
          path="/dashboard"
          element={username ? <Gallery /> : <Navigate to="/" replace />}
        />
        <Route
          path="/about"
          element={username ? <About /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  )
}
