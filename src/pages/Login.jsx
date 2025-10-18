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
    <div className="flex flex-col justify-center items-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-6 flex items-center gap-2">
        <span role="img" aria-label="camera">📷</span> Login Gallery
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col items-center gap-3">
        <input
          type="text"
          placeholder="Masukkan username"
          className="border rounded-md px-4 py-2 text-center w-60"
          value={username}
          onChange={(e) => setInputUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Masukkan password"
          className="border rounded-md px-4 py-2 text-center w-60"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}
