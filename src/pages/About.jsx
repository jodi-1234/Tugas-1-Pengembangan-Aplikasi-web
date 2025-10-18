import React, { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    document.title = 'Tentang Gallery'
  }, [])

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Tentang Aplikasi</h1>
      <p className="text-gray-700 max-w-xl mx-auto">
        Aplikasi ini dibuat menggunakan <b>React + Vite</b> tanpa framework tambahan. 
        Menampilkan galeri sederhana dengan fitur menambah item menggunakan 
        <b> state</b>, <b>props</b>, <b>hooks</b>, dan <b>routing</b> antar halaman.
      </p>
    </div>
  )
}
