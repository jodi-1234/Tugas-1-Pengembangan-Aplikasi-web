import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Gallery from './pages/Gallery'
import About from './pages/About'

export default function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4 flex justify-center gap-6">
        <Link to="/" className="hover:underline">Gallery</Link>
        <Link to="/about" className="hover:underline">Tentang</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}
