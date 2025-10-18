import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Gallery from './pages/Gallery'
import About from './pages/About'

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  // Cek localStorage setiap kali refresh
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
        <nav className="bg-blue-600 text-white p-4 flex justify-center gap-6">
          <Link to="/dashboard" className="hover:underline">Gallery</Link>
          <Link to="/about" className="hover:underline">Foto Terhapus</Link>
          <button
            onClick={() => {
              localStorage.removeItem('username')
              window.location.href = '/'  // paksa reload ke login
            }}
            className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
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
