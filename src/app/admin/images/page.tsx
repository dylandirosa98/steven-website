'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ImageData {
  id: string
  url: string
  alt: string | null
  title: string | null
  category: string | null
  order: number
  featured: boolean
}

export default function ImagesAdmin() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    order: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editOrder, setEditOrder] = useState<number>(0)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images')
      const data = await res.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          alt: null,
          title: null,
          category: null,
          featured: false,
        }),
      })

      if (res.ok) {
        setShowCreateModal(false)
        setFormData({ url: '', order: 0 })
        fetchImages()
      }
    } catch (error) {
      console.error('Error creating image:', error)
    }
  }

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const res = await fetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order: newOrder }),
      })

      if (res.ok) {
        setEditingId(null)
        fetchImages()
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const res = await fetch(`/api/images?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchImages()
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Images</h1>
          <p className="text-gray-600">Manage your photography portfolio images</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Upload New Image
        </button>
      </div>

      <div className="space-y-4">
        {images
          .sort((a, b) => a.order - b.order)
          .map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={image.url}
                  alt={image.alt || 'Image'}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 truncate">{image.url}</p>
              </div>
              <div className="flex items-center gap-3">
                {editingId === image.id ? (
                  <>
                    <input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateOrder(image.id, editOrder)}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-900 font-medium">Order: {image.order}</div>
                    <button
                      onClick={() => {
                        setEditingId(image.id)
                        setEditOrder(image.order)
                      }}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      Edit Order
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-gray-900">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Image</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="label">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use Cloudinary, Unsplash, or any image hosting service
                  </p>
                </div>
                <div>
                  <label className="label">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="input-field"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({ url: '', order: 0 })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
