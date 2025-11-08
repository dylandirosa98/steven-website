'use client'

import { useEffect, useState } from 'react'

interface Setting {
  id: string
  key: string
  value: string
  description: string | null
  category: string
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (key: string, value: string) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      fetchSettings()
    } catch (error) {
      console.error('Error updating setting:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const heroImage = settings.find(s => s.key === 'hero_image')
  const heroTitle = settings.find(s => s.key === 'hero_title')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Settings</h1>
        <p className="text-gray-600">Configure your homepage hero section</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="label">Hero Image URL</label>
            <p className="text-sm text-gray-500 mb-2">The main hero image displayed at the top of your homepage</p>
            <input
              type="url"
              defaultValue={heroImage?.value || ''}
              onBlur={(e) => handleUpdate('hero_image', e.target.value)}
              className="input-field"
              placeholder="https://example.com/hero-image.jpg"
            />
          </div>

          <div>
            <label className="label">Hero Title</label>
            <p className="text-sm text-gray-500 mb-2">The title text displayed below the hero image</p>
            <input
              type="text"
              defaultValue={heroTitle?.value || 'Photography by Steven Quach'}
              onBlur={(e) => handleUpdate('hero_title', e.target.value)}
              className="input-field"
              placeholder="Photography by Steven Quach"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
