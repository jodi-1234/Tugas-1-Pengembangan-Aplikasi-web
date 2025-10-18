import React, { useState, useEffect } from 'react'
import GalleryCard from '../components/GalleryCard'

export default function Gallery() {
  const username = localStorage.getItem('username')
  const defaultItems = [
    { id: 1, title: 'Gunung', image: 'https://source.unsplash.com/400x300/?mountain', category: 'Alam', description: 'Pemandangan gunung yang indah' },
    { id: 2, title: 'Pantai', image: 'https://source.unsplash.com/400x300/?beach', category: 'Alam', description: 'Suasana pantai yang menenangkan' },
  ]

  const [galleryItems, setGalleryItems] = useState([])
  const [deletedItems, setDeletedItems] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Alam')
  const [file, setFile] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Load data saat pertama kali
  useEffect(() => {
    const savedGallery = JSON.parse(localStorage.getItem(`gallery_${username}`)) || defaultItems
    const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${username}`)) || []
    setGalleryItems(savedGallery)
    setDeletedItems(savedDeleted)
  }, [username])

  const saveData = (updatedGallery, updatedDeleted) => {
    localStorage.setItem(`gallery_${username}`, JSON.stringify(updatedGallery))
    localStorage.setItem(`deleted_${username}`, JSON.stringify(updatedDeleted))
  }

  const handleAddItem = () => {
    if (!newTitle || (!newImage && !file)) {
      alert('Lengkapi data terlebih dahulu!')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newItem = {
        id: Date.now(),
        title: newTitle,
        image: file ? event.target.result : newImage,
        category: newCategory,
        description: newDesc,
      }
      const updated = [newItem, ...galleryItems]
      setGalleryItems(updated)
      saveData(updated, deletedItems)
    }

    if (file) reader.readAsDataURL(file)
    else {
      const newItem = {
        id: Date.now(),
        title: newTitle,
        image: newImage,
        category: newCategory,
        description: newDesc,
      }
      const updated = [newItem, ...galleryItems]
      setGalleryItems(updated)
      saveData(updated, deletedItems)
    }

    setNewTitle('')
    setNewImage('')
    setNewDesc('')
    setNewCategory('Alam')
    setFile(null)
  }

  const handleDelete = (id) => {
    const itemToDelete = galleryItems.find(i => i.id === id)
    const updatedGallery = galleryItems.filter(i => i.id !== id)
    const updatedDeleted = [itemToDelete, ...deletedItems]
    setGalleryItems(updatedGallery)
    setDeletedItems(updatedDeleted)
    saveData(updatedGallery, updatedDeleted)
  }

  const filteredItems = galleryItems.filter(item => {
    const matchCategory = filter === 'All' || item.category === filter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700">📸 Dashboard {username}</h1>

      {/* Filter & Search */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        {['All', 'Alam', 'Kota', 'Hewan'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full ${
              filter === cat ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            {cat}
          </button>
        ))}
        <input
          type="text"
          placeholder="Cari gambar..."
          className="border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} {...item} onDelete={() => handleDelete(item.id)} />
        ))}
      </div>

      {/* Form Tambah Gambar */}
      <div className="mt-16 bg-white/80 shadow-xl p-8 rounded-2xl max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-center text-blue-800">🖼️ Tambah Gambar Baru</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Judul" className="border p-3 w-full rounded-lg" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input type="text" placeholder="URL gambar (opsional)" className="border p-3 w-full rounded-lg" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
          <input type="file" accept="image/*" className="w-full" onChange={(e) => setFile(e.target.files[0])} />
          <select className="border p-3 w-full rounded-lg" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            <option>Alam</option>
            <option>Kota</option>
            <option>Hewan</option>
          </select>
          <input type="text" placeholder="Deskripsi" className="border p-3 w-full rounded-lg" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <button onClick={handleAddItem} className="bg-blue-500 text-white px-5 py-3 rounded-lg w-full hover:bg-blue-600 font-semibold">
            + Tambah ke Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
