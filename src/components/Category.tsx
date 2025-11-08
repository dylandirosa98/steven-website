'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface CategoryImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface CategoryProps {
  title: string
  images: CategoryImage[]
}

export default function Category({ title, images }: CategoryProps) {
  const [visible, setVisible] = useState(false)
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

  return (
    <section ref={ref} id="bw" className="py-24 bg-[#f7f7f8]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2
          className={`text-3xl sm:text-4xl md:text-5xl font-normal text-center mb-16 text-[#1d1d22] transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`overflow-hidden rounded shadow-md transition-all duration-1500 ${
                visible ? 'opacity-100 clip-path-none' : 'opacity-0 clip-path-right'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.url}
                  alt={image.alt || 'Category image'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
