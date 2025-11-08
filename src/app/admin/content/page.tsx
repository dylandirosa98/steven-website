'use client'

import { useEffect, useState } from 'react'

interface Setting {
  id: string
  key: string
  value: string
  description: string | null
  category: string
}

export default function ContentAdmin() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.filter((s: Setting) => s.category === 'content'))
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Content</h1>
        <p className="text-gray-600">Edit text content for your website pages</p>
      </div>

      <div className="space-y-6">
        {/* About Page Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Page</h2>
          <div className="space-y-4">
            {settings
              .filter(s => s.key.startsWith('about_'))
              .map((setting) => (
                <div key={setting.id}>
                  <label className="label">{setting.description}</label>
                  {setting.key.includes('heading') ? (
                    <input
                      type="text"
                      defaultValue={setting.value}
                      onBlur={(e) => handleUpdate(setting.key, e.target.value)}
                      className="input-field"
                    />
                  ) : (
                    <textarea
                      defaultValue={setting.value}
                      onBlur={(e) => handleUpdate(setting.key, e.target.value)}
                      className="input-field"
                      rows={3}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Contact Page Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Page</h2>
          <div className="space-y-4">
            {settings
              .filter(s => s.key.startsWith('contact_'))
              .map((setting) => (
                <div key={setting.id}>
                  <label className="label">{setting.description}</label>
                  <input
                    type="text"
                    defaultValue={setting.value}
                    onBlur={(e) => handleUpdate(setting.key, e.target.value)}
                    className="input-field"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
