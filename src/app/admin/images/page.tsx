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
  const [mobileRowType, setMobileRowType] = useState<string>('16:9-single')
  const [rowImages, setRowImages] = useState<Array<{url: string, aspectRatio: string}>>([
    { url: '', aspectRatio: '16:9' }
  ])
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

  const handleRowTypeChange = (newRowType: string) => {
    setMobileRowType(newRowType)

    // Update rowImages array based on selected row type
    switch (newRowType) {
      case '16:9-single':
        setRowImages([{ url: '', aspectRatio: '16:9' }])
        break
      case '1:1-9:16':
        setRowImages([
          { url: '', aspectRatio: '1:1' },
          { url: '', aspectRatio: '9:16' }
        ])
        break
      case '1:1-1:1':
        setRowImages([
          { url: '', aspectRatio: '1:1' },
          { url: '', aspectRatio: '1:1' }
        ])
        break
      case '9:16-9:16':
        setRowImages([
          { url: '', aspectRatio: '9:16' },
          { url: '', aspectRatio: '9:16' }
        ])
        break
      case '16:9-9:16':
        setRowImages([
          { url: '', aspectRatio: '16:9' },
          { url: '', aspectRatio: '9:16' }
        ])
        break
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Get the highest mobile row order
      const maxRowOrder = images.reduce((max, img: any) => {
        return img.mobileRowOrder > max ? img.mobileRowOrder : max
      }, 0)

      // Create all images in the row
      const promises = rowImages.map((imgData, index) => {
        if (!imgData.url) return null

        return fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: imgData.url,
            order: formData.order + index,
            alt: null,
            title: null,
            category: null,
            featured: false,
            mobileRowType,
            mobileRowOrder: maxRowOrder + 1,
            mobilePosition: index,
            aspectRatio: imgData.aspectRatio,
          }),
        })
      }).filter(Boolean)

      await Promise.all(promises)

      setShowCreateModal(false)
      setFormData({ url: '', order: 0 })
      setMobileRowType('16:9-single')
      setRowImages([{ url: '', aspectRatio: '16:9' }])
      fetchImages()
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

      {/* Aspect Ratio Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Recommended Aspect Ratios</h3>
        <p className="text-sm text-blue-800 mb-2">
          For best results, use images with these aspect ratios:
        </p>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li><strong>16:9</strong> - Horizontal/Landscape (e.g., 1920x1080, 1600x900)</li>
          <li><strong>9:16</strong> - Vertical/Portrait (e.g., 1080x1920, 900x1600)</li>
          <li><strong>1:1</strong> - Square (e.g., 1080x1080, 1000x1000)</li>
        </ul>
        <p className="text-xs text-blue-700 mt-2">
          The layout automatically scales images to fill rows perfectly on all screen sizes.
        </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full text-gray-900 my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Mobile Row</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                {/* Row Type Selector */}
                <div>
                  <label className="label">Mobile Row Template</label>
                  <select
                    value={mobileRowType}
                    onChange={(e) => handleRowTypeChange(e.target.value)}
                    className="input-field"
                  >
                    <option value="16:9-single">1x Horizontal (16:9)</option>
                    <option value="1:1-9:16">1x Square (1:1) + 1x Vertical (9:16)</option>
                    <option value="1:1-1:1">2x Square (1:1)</option>
                    <option value="9:16-9:16">2x Vertical (9:16)</option>
                    <option value="16:9-9:16">1x Horizontal (16:9) + 1x Vertical (9:16)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select how images should be arranged in this row on mobile
                  </p>
                </div>

                {/* Dynamic Image Inputs */}
                {rowImages.map((imgData, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
                    <label className="label">
                      Image {index + 1} - {imgData.aspectRatio} ratio
                    </label>
                    <input
                      type="url"
                      required
                      value={imgData.url}
                      onChange={(e) => {
                        const newRowImages = [...rowImages]
                        newRowImages[index].url = e.target.value
                        setRowImages(newRowImages)
                      }}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Image will be cropped/displayed as {imgData.aspectRatio}
                    </p>
                  </div>
                ))}

                <div>
                  <label className="label">Desktop Order (optional)</label>
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
                    Order for desktop layout (lower numbers first)
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  Add Row
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({ url: '', order: 0 })
                    setMobileRowType('16:9-single')
                    setRowImages([{ url: '', aspectRatio: '16:9' }])
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
