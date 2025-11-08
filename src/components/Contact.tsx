'use client'

import { useEffect, useRef, useState } from 'react'

interface ContactProps {
  title: string
  content: string
}

export default function Contact({ title, content }: ContactProps) {
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={ref} id="contact" className="py-24 bg-[#1d1d22] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4">
            {title}
          </h2>
          <p className="text-lg mb-8 opacity-90">{content}</p>

          {submitted ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-2">Thank you!</h3>
              <p className="opacity-90">Your message has been received. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/60 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/60 transition-colors"
              />
              <textarea
                placeholder="Message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/60 focus:outline-none focus:border-white/60 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-white text-primary rounded font-medium tracking-wide uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
