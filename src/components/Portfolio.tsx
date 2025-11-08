'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface PortfolioImage {
  id: string
  url: string
  alt: string | null
  title: string | null
  order: number
}

interface PortfolioProps {
  title: string
  images: PortfolioImage[]
}

export default function Portfolio({ title, images }: PortfolioProps) {
  const [visible, setVisible] = useState(false)
  const [lightbox, setLightbox] = useState<{ open: boolean; image: string | null }>({
    open: false,
    image: null,
  })
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const openLightbox = (imageUrl: string) => {
    setLightbox({ open: true, image: imageUrl })
  }

  const closeLightbox = () => {
    setLightbox({ open: false, image: null })
  }

  return (
    <>
      <section ref={ref} id="portfolio" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-16 text-[#1d1d22] transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
          >
            {title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden rounded shadow-sm hover:shadow-xl transition-all duration-600 cursor-pointer ${
                  visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => openLightbox(image.url)}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.url}
                    alt={image.alt || 'Portfolio image'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                    <span className="text-white text-lg tracking-widest uppercase border-2 border-white px-6 py-3">
                      View
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox.open && lightbox.image && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:opacity-70 transition-opacity"
            onClick={closeLightbox}
          >
            &times;
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={lightbox.image}
              alt="Lightbox image"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
