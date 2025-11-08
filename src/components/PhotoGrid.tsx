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

export default function PhotoGrid({ images }: PhotoGridProps) {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

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
  }, [images])

  return (
    <section className="bg-black">
      <div className="w-full">
        <div className="flex flex-wrap">
          {images.map((image, index) => (
            <div
              key={image.id}
              id={image.id}
              className={`photo-item overflow-hidden group cursor-pointer transition-all duration-600 ${
                visibleImages.has(image.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
                height: '300px',
                flex: '0 0 auto',
              }}
            >
              <img
                src={image.url}
                alt={image.alt || 'Photography'}
                className="h-full w-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
