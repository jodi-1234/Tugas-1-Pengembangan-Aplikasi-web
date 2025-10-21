import React, { useState, useEffect } from 'react'
import GalleryCard from '../components/GalleryCard'
import '../pages/Gallery.css'

// IndexedDB setup
const DB_NAME = 'my-gallery-db'
const DB_STORE = 'files'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' })
      }
    }
    request.onsuccess = (e) => resolve(e.target.result)
    request.onerror = (e) => reject(e.target.error)
  })
}

async function saveFileToIDB(id, file) {
  const db = await openDB()
  const tx = db.transaction(DB_STORE, 'readwrite')
  const store = tx.objectStore(DB_STORE)
  store.put({ id, file })
  return tx.complete
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

export default function Gallery() {
  const username = localStorage.getItem('username')
  const [galleryItems, setGalleryItems] = useState([])
  const [deletedItems, setDeletedItems] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Alam')
  const [file, setFile] = useState(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [uploadMethod, setUploadMethod] = useState('url')

  useEffect(() => {
    const loadData = async () => {
      const savedGallery = JSON.parse(localStorage.getItem(`gallery_${username}`)) || []
      const savedDeleted = JSON.parse(localStorage.getItem(`deleted_${username}`)) || []

      const resolvedGallery = await Promise.all(
        savedGallery.map(async (item) => {
          if (item.localFileId && !item.image) {
            try {
              const blob = await getFileFromIDB(item.localFileId)
              if (blob) {
                const blobUrl = URL.createObjectURL(blob)
                return { ...item, image: blobUrl }
              }
            } catch {
              return item
            }
          }
          return item
        })
      )

      setGalleryItems(resolvedGallery)
      setDeletedItems(savedDeleted)
    }

    loadData()
  }, [username])

  const saveData = (updatedGallery, updatedDeleted) => {
    const cleanedGallery = updatedGallery.map((item) => {
      const copy = { ...item }
      if (copy.image && copy.image.startsWith('blob:')) copy.image = ''
      return copy
    })
    const cleanedDeleted = updatedDeleted.map((item) => {
      const copy = { ...item }
      if (copy.image && copy.image.startsWith('blob:')) copy.image = ''
      return copy
    })
    localStorage.setItem(`gallery_${username}`, JSON.stringify(cleanedGallery))
    localStorage.setItem(`deleted_${username}`, JSON.stringify(cleanedDeleted))
  }

  const handleAddItem = () => {
    if (!newTitle.trim()) return alert('Judul wajib diisi!')

    if (uploadMethod === 'url') {
      if (!newImage.trim()) return alert('URL gambar wajib diisi!')
      const newItem = {
        id: Date.now(),
        title: newTitle.trim(),
        image: newImage.trim(),
        category: newCategory,
        description: newDesc.trim(),
        source: 'url',
      }
      const updated = [newItem, ...galleryItems]
      setGalleryItems(updated)
      saveData(updated, deletedItems)
      resetForm()
      return
    }

    if (uploadMethod === 'file') {
      if (!file) return alert('Pilih file gambar dulu!')
      if (!file.type.startsWith('image/')) return alert('File harus gambar!')

      const id = Date.now()
      const localFileId = `file_${id}`
      saveFileToIDB(localFileId, file)

      const blobUrl = URL.createObjectURL(file)
      const newItem = {
        id,
        title: newTitle.trim(),
        image: blobUrl,
        category: newCategory,
        description: newDesc.trim(),
        source: 'local',
        localFileId,
      }

      const updated = [newItem, ...galleryItems]
      setGalleryItems(updated)
      saveData(updated, deletedItems)
      resetForm()
    }
  }

  const resetForm = () => {
    setNewTitle('')
    setNewImage('')
    setNewDesc('')
    setNewCategory('Alam')
    setFile(null)
    setUploadMethod('url')
  }

  const handleDelete = (id) => {
    const itemToDelete = galleryItems.find((i) => i.id === id)
    if (!itemToDelete) return

    const updatedGallery = galleryItems.filter((i) => i.id !== id)
    const updatedDeleted = [{ ...itemToDelete }, ...deletedItems]

    setGalleryItems(updatedGallery)
    setDeletedItems(updatedDeleted)
    saveData(updatedGallery, updatedDeleted)
  }

  const filteredItems = galleryItems.filter((item) => {
    const matchCategory = filter === 'All' || item.category === filter
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="page-wrap-alt">
      <h1 className="page-heading">Gallery {username}</h1>

      <div className="filter-wrap">
        {['All', 'Alam', 'Kota', 'Hewan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
        <div className="search-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#618264"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            type="text"
            placeholder="Cari gambar..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="gallery-grid">
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} {...item} onDelete={() => handleDelete(item.id)} />
        ))}
      </div>

      <div className="info-card">
        <h2 className="info-title">Tambah Gambar Baru</h2>
        <div className="info-list">
          <div className="info-row">
            <label className="inline-flex">
              <input
                type="radio"
                name="uploadMethod"
                value="url"
                checked={uploadMethod === 'url'}
                onChange={() => {
                  setUploadMethod('url')
                  setFile(null)
                }}
              />
              <span className="ml-small">Upload dari URL</span>
            </label>
            <label className="inline-flex">
              <input
                type="radio"
                name="uploadMethod"
                value="file"
                checked={uploadMethod === 'file'}
                onChange={() => {
                  setUploadMethod('file')
                  setNewImage('')
                }}
              />
              <span className="ml-small">Upload dari File Lokal</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Judul"
            className="input-box"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          {uploadMethod === 'url' && (
            <input
              type="text"
              placeholder="URL gambar"
              className="input-box"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
          )}

          {uploadMethod === 'file' && (
            <div className="upload-btn-wrapper">
              <label className="btn-upload">
                📁 Pilih File Gambar
                {file && <span className="file-name-inline"> — {file.name}</span>}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          )}

          <select
            className="input-box"
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
            className="input-box"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <button onClick={handleAddItem} className="btn-submit">
            + Tambah Gambar
          </button>
        </div>
      </div>
    </div>
  )
}
