import React, { useEffect, useState } from 'react'
import GalleryCard from '../components/GalleryCard'

export default function About() {
  const username = localStorage.getItem('username')
  const [deletedItems, setDeletedItems] = useState([])
  const [galleryItems, setGalleryItems] = useState([])

  // 🔹 Ambil data dari localStorage saat halaman dibuka
  useEffect(() => {
    const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${username}`)) || []
    const savedGallery = JSON.parse(localStorage.getItem(`gallery_${username}`)) || []
    setDeletedItems(savedDeleted)
    setGalleryItems(savedGallery)
  }, [username])

  // 🔹 Fungsi simpan data ke localStorage
  const saveData = (updatedDeleted, updatedGallery) => {
    localStorage.setItem(`deleted_${username}`, JSON.stringify(updatedDeleted))
    localStorage.setItem(`gallery_${username}`, JSON.stringify(updatedGallery))
  }

  // 🔹 Fungsi restore foto ke gallery
  const handleRestore = (id) => {
    const restoredItem = deletedItems.find((item) => item.id === id)
    const updatedDeleted = deletedItems.filter((item) => item.id !== id)
    const updatedGallery = [restoredItem, ...galleryItems]

    setDeletedItems(updatedDeleted)
    setGalleryItems(updatedGallery)
    saveData(updatedDeleted, updatedGallery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        🗑️ Daftar Foto Terhapus ({username})
      </h1>

      {deletedItems.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada foto yang dihapus.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {deletedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                  {item.category}
                </span>
                <button
                  onClick={() => handleRestore(item.id)}
                  className="mt-3 block bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 w-full text-center font-medium"
                >
                  🔁 Pulihkan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
