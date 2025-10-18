import React from 'react'

export default function GalleryCard({ title, image, category, description, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">{category}</span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="mt-3 block bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  )
}
