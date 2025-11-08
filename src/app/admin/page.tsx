'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    images: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const imagesRes = await fetch('/api/images')
        const images = await imagesRes.json()

        setStats({
          images: Array.isArray(images) ? images.length : 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your photography portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Images</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.images}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/images"
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Images</h3>
          <p className="text-sm text-gray-600">Upload and organize your portfolio images</p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hero Settings</h3>
          <p className="text-sm text-gray-600">Configure your homepage hero section</p>
        </Link>

        <Link
          href="/admin/content"
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Content</h3>
          <p className="text-sm text-gray-600">Edit text for About and Contact pages</p>
        </Link>

        <Link
          href="/admin/fonts"
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Font Settings</h3>
          <p className="text-sm text-gray-600">Customize fonts used across your site</p>
        </Link>
      </div>
    </div>
  )
}
