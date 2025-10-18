import React, { useState } from 'react'
import GalleryCard from '../components/GalleryCard'

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, title: 'Gunung', image: 'https://source.unsplash.com/400x300/?mountain', category: 'Alam', description: 'Pemandangan gunung yang indah' },
    { id: 2, title: 'Pantai', image: 'https://source.unsplash.com/400x300/?beach', category: 'Alam', description: 'Suasana pantai yang menenangkan' },
    { id: 3, title: 'Kota', image: 'https://source.unsplash.com/400x300/?city', category: 'Kota', description: 'Gedung-gedung megah di malam hari' },
    { id: 4, title: 'Hewan', image: 'https://source.unsplash.com/400x300/?animal', category: 'Hewan', description: 'Satwa liar di alam bebas' },
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Alam')
  const [file, setFile] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const handleAddItem = () => {
    if (!newTitle || (!newImage && !file)) {
      alert('Lengkapi data terlebih dahulu!')
      return
    }

    const imageUrl = file ? URL.createObjectURL(file) : newImage
    const newItem = {
      id: Date.now(),
      title: newTitle,
      image: imageUrl,
      category: newCategory,
      description: newDesc,
    }

    setGalleryItems([newItem, ...galleryItems])
    setNewTitle('')
    setNewImage('')
    setNewDesc('')
    setNewCategory('Alam')
    setFile(null)
  }

  const filteredItems = galleryItems.filter(item => {
    const matchCategory = filter === 'All' || item.category === filter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700 tracking-wide">
        📸 Filter Gallery
      </h1>

      {/* Filter + Search */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        {['All', 'Alam', 'Kota', 'Hewan'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-100'
            }`}
          >
            {cat}
          </button>
        ))}

        <input
          type="text"
          placeholder="Cari gambar..."
          className="border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} {...item} />
        ))}
      </div>

      {/* Form Tambah Gambar */}
      <div className="mt-16 bg-white/80 backdrop-blur-lg shadow-xl p-8 rounded-2xl max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-center text-blue-800">🖼️ Tambah Gambar Baru</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Judul gambar"
            className="border p-3 w-full rounded-lg"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL gambar (opsional)"
            className="border p-3 w-full rounded-lg"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <select
            className="border p-3 w-full rounded-lg"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          >
            <option>Alam</option>
            <option>Kota</option>
            <option>Hewan</option>
          </select>
          <input
            type="text"
            placeholder="Deskripsi (opsional)"
            className="border p-3 w-full rounded-lg"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button
            onClick={handleAddItem}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-lg w-full hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold"
          >
            + Tambah ke Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
