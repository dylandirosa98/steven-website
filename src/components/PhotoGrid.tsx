'use client'

import { useEffect, useRef, useState } from 'react'

interface Photo {
  id: string
  url: string
  alt: string | null
  order: number
  mobileRowType?: string | null
  mobileRowOrder?: number | null
  mobilePosition?: number | null
  aspectRatio?: string | null
}

interface PhotoGridProps {
  images: Photo[]
}

interface ImageWithDimensions extends Photo {
  calculatedAspectRatio: number
  width: number
  height: number
}

export default function PhotoGrid({ images }: PhotoGridProps) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const [imagesWithDimensions, setImagesWithDimensions] = useState<ImageWithDimensions[]>([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
              calculatedAspectRatio: img.naturalWidth / img.naturalHeight,
            })
          }
          img.onerror = () => {
            // Default to 16:9 if image fails to load
            resolve({
              ...image,
              width: 1600,
              height: 900,
              calculatedAspectRatio: 16 / 9,
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
  }, [imagesWithDimensions, isMobile])

  // Group images into mobile rows
  const getMobileRows = () => {
    if (imagesWithDimensions.length === 0) return []

    // Group by mobileRowOrder
    const rowMap = new Map<number, ImageWithDimensions[]>()

    imagesWithDimensions.forEach((img) => {
      const rowOrder = img.mobileRowOrder ?? 0
      if (!rowMap.has(rowOrder)) {
        rowMap.set(rowOrder, [])
      }
      rowMap.get(rowOrder)!.push(img)
    })

    // Sort each row by mobilePosition
    const rows = Array.from(rowMap.values()).map((row) => {
      return row.sort((a, b) => (a.mobilePosition ?? 0) - (b.mobilePosition ?? 0))
    })

    return rows
  }

  // Group images into desktop rows that fill the screen width
  const getDesktopRows = () => {
    if (imagesWithDimensions.length === 0 || containerWidth === 0) return []

    const rowHeight = 300
    const rows: ImageWithDimensions[][] = []
    let currentRow: ImageWithDimensions[] = []
    let currentRowWidth = 0

    imagesWithDimensions.forEach((image) => {
      const imageWidth = rowHeight * image.calculatedAspectRatio

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

  const rows = isMobile ? getMobileRows() : getDesktopRows()

  // Render mobile row
  const renderMobileRow = (row: ImageWithDimensions[], rowIndex: number) => {
    if (row.length === 0) return null

    const rowType = row[0].mobileRowType

    // Calculate proportional widths based on aspect ratios
    const getAspectRatioValue = (aspectRatio: string | null | undefined): number => {
      if (aspectRatio === '16:9') return 16 / 9
      if (aspectRatio === '9:16') return 9 / 16
      if (aspectRatio === '1:1') return 1
      return 16 / 9 // default
    }

    // Calculate width percentages for multi-image rows
    const calculateWidthPercentages = () => {
      if (rowType === '16:9-single') {
        return ['100%']
      }

      const aspectRatios = row.map(img => getAspectRatioValue(img.aspectRatio))
      const totalRatio = aspectRatios.reduce((sum, ratio) => sum + ratio, 0)

      return aspectRatios.map(ratio => `${(ratio / totalRatio) * 100}%`)
    }

    const widthPercentages = calculateWidthPercentages()

    return (
      <div key={rowIndex} className="w-full flex gap-0">
        {row.map((image, imageIndex) => {
          const globalIndex = images.findIndex((img) => img.id === image.id)

          return (
            <div
              key={image.id}
              id={image.id}
              className={`photo-item overflow-hidden group cursor-pointer transition-all duration-600 ${
                visibleImages.has(image.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${globalIndex * 50}ms`,
                width: widthPercentages[imageIndex],
                aspectRatio: image.aspectRatio || '16/9',
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
  }

  // Render desktop row
  const renderDesktopRow = (row: ImageWithDimensions[], rowIndex: number) => {
    const totalAspectRatio = row.reduce((sum, img) => sum + img.calculatedAspectRatio, 0)
    const scaledHeight = containerWidth / totalAspectRatio

    return (
      <div key={rowIndex} className="flex w-full" style={{ height: `${scaledHeight}px` }}>
        {row.map((image) => {
          const width = scaledHeight * image.calculatedAspectRatio
          const globalIndex = images.findIndex((img) => img.id === image.id)

          return (
            <div
              key={image.id}
              id={image.id}
              className={`photo-item overflow-hidden group cursor-pointer transition-all duration-600 ${
                visibleImages.has(image.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
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
  }

  return (
    <section className="bg-black overflow-hidden w-full">
      <div className="w-full" ref={containerRef}>
        {rows.map((row, rowIndex) => (isMobile ? renderMobileRow(row, rowIndex) : renderDesktopRow(row, rowIndex)))}
      </div>
    </section>
  )
}
