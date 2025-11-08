'use client'

import { useEffect, useState } from 'react'

interface Setting {
  id: string
  key: string
  value: string
  description: string | null
  category: string
}

export default function FontsAdmin() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<{ header_logo: boolean; header_nav: boolean; home_page: boolean; about_page: boolean; contact_page: boolean }>({
    header_logo: false,
    header_nav: false,
    home_page: false,
    about_page: false,
    contact_page: false,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      setSettings(data.filter((s: Setting) => s.category === 'fonts'))
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

  const handleFontUpload = async (file: File, fontType: 'header_logo' | 'header_nav' | 'home_page' | 'about_page' | 'contact_page') => {
    const fontName = prompt('Enter a name for this font (e.g., "My Custom Font"):')
    if (!fontName) return

    setUploading({ ...uploading, [fontType]: true })

    try {
      const formData = new FormData()
      formData.append('font', file)
      formData.append('fontName', fontName)
      formData.append('fontType', fontType)

      const res = await fetch('/api/upload-font', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        // Update settings with the uploaded font
        await handleUpdate(`font_${fontType}_file`, data.fontPath)
        await handleUpdate(`font_${fontType}_name`, data.fontFamily)
        await handleUpdate(`font_${fontType}`, `"${data.fontFamily}", sans-serif`)

        alert('Font uploaded successfully!')
        fetchSettings()
      } else {
        alert(data.error || 'Failed to upload font')
      }
    } catch (error) {
      console.error('Error uploading font:', error)
      alert('Failed to upload font')
    } finally {
      setUploading({ ...uploading, [fontType]: false })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Font file paths and names for each section
  const headerLogoFontFile = settings.find(s => s.key === 'font_header_logo_file')?.value
  const headerLogoFontName = settings.find(s => s.key === 'font_header_logo_name')?.value
  const headerNavFontFile = settings.find(s => s.key === 'font_header_nav_file')?.value
  const headerNavFontName = settings.find(s => s.key === 'font_header_nav_name')?.value
  const homePageFontFile = settings.find(s => s.key === 'font_home_page_file')?.value
  const homePageFontName = settings.find(s => s.key === 'font_home_page_name')?.value
  const aboutPageFontFile = settings.find(s => s.key === 'font_about_page_file')?.value
  const aboutPageFontName = settings.find(s => s.key === 'font_about_page_name')?.value
  const contactPageFontFile = settings.find(s => s.key === 'font_contact_page_file')?.value
  const contactPageFontName = settings.find(s => s.key === 'font_contact_page_name')?.value

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Font Settings</h1>
        <p className="text-gray-600">Upload custom fonts or use Google Fonts</p>
      </div>

      {/* Custom Font Upload - Section by Section */}
      <div className="space-y-6 mb-8">
        {/* Header Logo Font (Steven Quach) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Header Logo Font (Steven Quach)</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Custom Font
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Download fonts from <a href="https://www.dafont.com" target="_blank" className="text-blue-600 underline">dafont.com</a> or other sites. Accepts .ttf, .otf, .woff, .woff2
            </p>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, 'header_logo')
                e.target.value = ''
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading.header_logo}
            />
            {uploading.header_logo && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {headerLogoFontFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Uploaded: <span className="font-semibold">{headerLogoFontName}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Path: {headerLogoFontFile}</p>
              </div>
            )}
          </div>
        </div>

        {/* Header Navigation Font (About, Contact) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Header Navigation Font (About, Contact)</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Custom Font
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Download fonts from <a href="https://www.dafont.com" target="_blank" className="text-blue-600 underline">dafont.com</a> or other sites. Accepts .ttf, .otf, .woff, .woff2
            </p>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, 'header_nav')
                e.target.value = ''
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading.header_nav}
            />
            {uploading.header_nav && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {headerNavFontFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Uploaded: <span className="font-semibold">{headerNavFontName}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Path: {headerNavFontFile}</p>
              </div>
            )}
          </div>
        </div>

        {/* Home Page Font */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Home Page Font (Hero Section)</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Custom Font
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Download fonts from <a href="https://www.dafont.com" target="_blank" className="text-blue-600 underline">dafont.com</a> or other sites. Accepts .ttf, .otf, .woff, .woff2
            </p>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, 'home_page')
                e.target.value = ''
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading.home_page}
            />
            {uploading.home_page && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {homePageFontFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Uploaded: <span className="font-semibold">{homePageFontName}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Path: {homePageFontFile}</p>
              </div>
            )}
          </div>
        </div>

        {/* About Page Font */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Page Font</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Custom Font
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Download fonts from <a href="https://www.dafont.com" target="_blank" className="text-blue-600 underline">dafont.com</a> or other sites. Accepts .ttf, .otf, .woff, .woff2
            </p>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, 'about_page')
                e.target.value = ''
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading.about_page}
            />
            {uploading.about_page && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {aboutPageFontFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Uploaded: <span className="font-semibold">{aboutPageFontName}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Path: {aboutPageFontFile}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Page Font */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Page Font</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Custom Font
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Download fonts from <a href="https://www.dafont.com" target="_blank" className="text-blue-600 underline">dafont.com</a> or other sites. Accepts .ttf, .otf, .woff, .woff2
            </p>
            <input
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, 'contact_page')
                e.target.value = ''
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading.contact_page}
            />
            {uploading.contact_page && (
              <p className="text-sm text-blue-600 mt-2">Uploading...</p>
            )}
            {contactPageFontFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  ✓ Uploaded: <span className="font-semibold">{contactPageFontName}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Path: {contactPageFontFile}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use Custom Fonts</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Download fonts from <a href="https://www.dafont.com" target="_blank" className="underline">dafont.com</a> or other font sites</li>
            <li>Upload the font file (.ttf, .otf, .woff, .woff2) in the appropriate section above</li>
            <li>Enter a name for the font when prompted</li>
            <li>The font will be applied to that specific text section automatically</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
