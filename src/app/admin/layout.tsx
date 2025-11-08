'use client'

import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-primary">
                Admin Dashboard
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/admin/images"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Images
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Hero
                </Link>
                <Link
                  href="/admin/content"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Content
                </Link>
                <Link
                  href="/admin/fonts"
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Fonts
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
