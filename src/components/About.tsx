'use client'

import { useEffect, useRef, useState } from 'react'

interface AboutProps {
  title: string
  content: string
}

export default function About({ title, content }: AboutProps) {
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
    <section
      ref={ref}
      id="about"
      className="py-24 bg-[#f7f7f8]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 delay-150 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-6 text-[#1d1d22]">
            {title}
          </h2>
          <p className="text-lg text-[#1d1d22]/80 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </section>
  )
}
