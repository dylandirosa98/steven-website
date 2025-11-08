'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  alt: string | null
  order: number
}

interface PhotoGridProps {
  images: Photo[]
}

interface ImageWithDimensions extends Photo {
  aspectRatio: number
  width: number
  height: number
}

export default function PhotoGrid({ images }: PhotoGridProps) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const [imagesWithDimensions, setImagesWithDimensions] = useState<ImageWithDimensions[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load image dimensions
  useEffect(() => {
    const loadImageDimensions = async () => {
      const promises = images.map((image) => {
        return new Promise<ImageWithDimensions>((resolve) => {
          const img = new window.Image()
          img.onload = () => {
            resolve({
              ...image,
              width: img.naturalWidth,
              height: img.naturalHeight,
              aspectRatio: img.naturalWidth / img.naturalHeight,
            })
          }
          img.onerror = () => {
            // Default to 16:9 if image fails to load
            resolve({
              ...image,
              width: 1600,
              height: 900,
              aspectRatio: 16 / 9,
            })
          }
          img.src = image.url
        })
      })

      const loadedImages = await Promise.all(promises)
      setImagesWithDimensions(loadedImages)
    }

    if (images.length > 0) {
      loadImageDimensions()
    }
  }, [images])

  // Track container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages((prev) => {
              const newSet = new Set(prev)
              newSet.add(entry.target.id)
              return newSet
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const imageElements = document.querySelectorAll('.photo-item')
    imageElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    })
  }, [imagesWithDimensions])

  // Group images into rows that fill the screen width
  const groupImagesIntoRows = () => {
    if (imagesWithDimensions.length === 0 || containerWidth === 0) return []

    const rowHeight = containerWidth < 768 ? 200 : 300
    const rows: ImageWithDimensions[][] = []
    let currentRow: ImageWithDimensions[] = []
    let currentRowWidth = 0

    imagesWithDimensions.forEach((image) => {
      const imageWidth = rowHeight * image.aspectRatio

      if (currentRowWidth + imageWidth <= containerWidth) {
        currentRow.push(image)
        currentRowWidth += imageWidth
      } else {
        if (currentRow.length > 0) {
          rows.push([...currentRow])
        }
        currentRow = [image]
        currentRowWidth = imageWidth
      }
    })

    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    return rows
  }

  const rows = groupImagesIntoRows()

  return (
    <section className="bg-black overflow-hidden w-full">
      <div className="w-full" ref={containerRef}>
        {rows.map((row, rowIndex) => {
          const rowHeight = containerWidth < 768 ? 200 : 300
          const totalAspectRatio = row.reduce((sum, img) => sum + img.aspectRatio, 0)
          const scaledHeight = containerWidth / totalAspectRatio

          return (
            <div key={rowIndex} className="flex w-full" style={{ height: `${scaledHeight}px` }}>
              {row.map((image, imageIndex) => {
                const width = scaledHeight * image.aspectRatio
                const globalIndex = images.findIndex(img => img.id === image.id)

                return (
                  <div
                    key={image.id}
                    id={image.id}
                    className={`photo-item overflow-hidden group cursor-pointer transition-all duration-600 ${
                      visibleImages.has(image.id)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12'
                    }`}
                    style={{
                      transitionDelay: `${globalIndex * 50}ms`,
                      width: `${width}px`,
                      height: `${scaledHeight}px`,
                      flex: '0 0 auto',
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || 'Photography'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </section>
  )
}
