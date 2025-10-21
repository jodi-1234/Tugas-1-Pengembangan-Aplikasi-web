import React from 'react'
export default function GalleryCard({ title, image, category, description, onDelete }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <span className="card-tag">{category}</span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="btn-delete"
          >
            Hapus
          </button>
        )}
      </div>
    </div>
  )
}
