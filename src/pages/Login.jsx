import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUsername }) {
  const [username, setInputUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      alert('Masukkan username terlebih dahulu!')
      return
    }

    // Simpan username ke localStorage
    localStorage.setItem('username', trimmed)
    setUsername(trimmed)

    // Buat data awal untuk user baru
    if (!localStorage.getItem(`gallery_${trimmed}`)) {
      localStorage.setItem(`gallery_${trimmed}`, JSON.stringify([]))
      localStorage.setItem(`deleted_${trimmed}`, JSON.stringify([]))
    }

    // Arahkan ke dashboard (password bebas)
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <h1 className="login-title">
        <span role="img" aria-label="camera">📷</span> Login Gallery
      </h1>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Masukkan username"
          className="login-input"
          value={username}
          onChange={(e) => setInputUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Masukkan password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
    </div>
  )
}
