'use client'

import Image from 'next/image'

interface HeroProps {
  title: string
  image: string
}

export default function Hero({ title, image }: HeroProps) {
  return (
    <section className="relative pt-32 bg-black">
      {/* Hero Image */}
      <div className="relative w-full flex items-center justify-center" style={{ minHeight: '60vh', maxHeight: '85vh' }}>
        <img
          src={image}
          alt="Hero"
          className="w-full h-auto object-contain max-h-[85vh]"
        />
      </div>

      {/* Title Below Image */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-96 flex flex-col items-center justify-center">
        <h1
          className="text-2xl md:text-5xl lg:text-6xl font-normal text-white text-center leading-tight mb-4 md:mb-8"
          style={{ fontFamily: 'var(--font-home-page)' }}
        >
          {title}
        </h1>
        <p
          className="text-base md:text-2xl lg:text-3xl font-light text-white text-center"
          style={{ fontFamily: 'var(--font-home-page)' }}
        >
          Unique moments seen through a creative lens.
        </p>
      </div>
    </section>
  )
}
