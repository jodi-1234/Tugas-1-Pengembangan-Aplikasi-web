import React, { useEffect, useState } from 'react'

const DB_NAME = 'my-gallery-db'
const DB_STORE = 'files'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

async function getFileFromIDB(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly')
    const store = tx.objectStore(DB_STORE)
    const req = store.get(id)
    req.onsuccess = (e) => {
      const rec = e.target.result
      resolve(rec ? rec.file : null)
      db.close()
    }
    req.onerror = (e) => {
      reject(e.target.error)
      db.close()
    }
  })
}

export default function About() {
  const username = localStorage.getItem('username')
  const [deletedItems, setDeletedItems] = useState([])
  const [galleryItems, setGalleryItems] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${username}`)) || []
      const savedGallery = JSON.parse(localStorage.getItem(`gallery_${username}`)) || []

      const resolvedDeleted = await Promise.all(
        savedDeleted.map(async (item) => {
          if ((!item.image || item.image === '') && item.localFileId) {
            try {
              const blob = await getFileFromIDB(item.localFileId)
              if (blob) {
                const url = URL.createObjectURL(blob)
                return { ...item, image: url }
              }
            } catch (err) {
              console.error('Gagal ambil file dari IndexedDB:', err)
            }
          }
          return item
        })
      )

      setDeletedItems(resolvedDeleted)
      setGalleryItems(savedGallery)
    }

    loadData()
  }, [username])

  const saveData = (updatedDeleted, updatedGallery) => {
    localStorage.setItem(`deleted_${username}`, JSON.stringify(updatedDeleted))
    localStorage.setItem(`gallery_${username}`, JSON.stringify(updatedGallery))
  }

  const handleRestore = async (id) => {
    const restoredItem = deletedItems.find((item) => item.id === id)
    if (!restoredItem) return

    let restoredWithImage = { ...restoredItem }

    if ((!restoredWithImage.image || restoredWithImage.image === '') && restoredWithImage.localFileId) {
      try {
        const blob = await getFileFromIDB(restoredWithImage.localFileId)
        if (blob) {
          const url = URL.createObjectURL(blob)
          restoredWithImage.image = url
        }
      } catch (err) {
        console.error('Gagal ambil file saat restore:', err)
      }
    }

    const updatedDeleted = deletedItems.filter((item) => item.id !== id)
    const updatedGallery = [restoredWithImage, ...galleryItems]

    setDeletedItems(updatedDeleted)
    setGalleryItems(updatedGallery)
    saveData(updatedDeleted, updatedGallery)
  }

  const handleRestoreAll = async () => {
    if (deletedItems.length === 0) return

    const resolvedRestored = await Promise.all(
      deletedItems.map(async (item) => {
        if ((!item.image || item.image === '') && item.localFileId) {
          try {
            const blob = await getFileFromIDB(item.localFileId)
            if (blob) {
              const url = URL.createObjectURL(blob)
              return { ...item, image: url }
            }
          } catch (err) {
            console.error('Gagal ambil file lokal di restore semua:', err)
          }
        }
        return item
      })
    )

    const updatedGallery = [...resolvedRestored, ...galleryItems]
    setDeletedItems([])
    setGalleryItems(updatedGallery)
    saveData([], updatedGallery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        🗑️ Daftar Foto Terhapus ({username})
      </h1>

      {deletedItems.length > 0 && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRestoreAll}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-md"
          >
            🔁 Pulihkan Semua Foto
          </button>
        </div>
      )}

      {deletedItems.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada foto yang dihapus.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {deletedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  (gambar tidak tersedia)
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description || 'Tidak ada deskripsi'}
                </p>
                <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                  {item.category || 'Tanpa Kategori'}
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
