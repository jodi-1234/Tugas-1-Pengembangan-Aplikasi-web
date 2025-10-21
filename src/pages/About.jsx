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
    <div className="page-wrap">
      <h1 className="page-title">
        🗑️ Daftar Foto Terhapus ({username})
      </h1>

      {deletedItems.length > 0 && (
        <div className="btn-wrap">
          <button
            onClick={handleRestoreAll}
            className="btn-add"
          >
            🔁 Pulihkan Semua Foto
          </button>
        </div>
      )}

      {deletedItems.length === 0 ? (
        <p className="empty-text">Belum ada foto yang dihapus.</p>
      ) : (
        <div className="card-grid">
          {deletedItems.map((item) => (
            <div
              key={item.id}
              className="card"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="card-img" />
              ) : (
                <div className="img-placeholder">
                  (gambar tidak tersedia)
                </div>
              )}
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">
                  {item.description || 'Tidak ada deskripsi'}
                </p>
                <span className="card-tag">
                  {item.category || 'Tanpa Kategori'}
                </span>
                <button
                  onClick={() => handleRestore(item.id)}
                  className="btn-delete"
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
