'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavigationItem {
  id: string
  label: string
  href: string
  order: number
  visible: boolean
  external: boolean
}

interface HeaderProps {
  navigation: NavigationItem[]
}

export default function Header({ navigation }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-white/10 z-50">
        <div className="w-full px-12 h-32 flex justify-between items-center">
          {/* Logo/Brand - Left Side */}
          <Link
            href="/"
            className="text-white text-4xl md:text-5xl font-normal tracking-wide"
            style={{ fontFamily: 'var(--font-header-logo)' }}
          >
            Steven Quach
          </Link>

          {/* Desktop Navigation - Right Aligned */}
          <nav className="hidden md:block">
            <ul className="flex gap-12">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-base font-normal text-white hover:text-white/60 transition-colors duration-200 tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-header-nav)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav
        className={`fixed top-0 right-0 w-4/5 max-w-sm h-screen bg-black shadow-2xl z-40 transition-transform duration-400 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <ul className="pt-36 px-6">
          {navigation.map((item) => (
            <li key={item.id} className="mb-4">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-normal py-3 border-b border-white/10 text-white hover:text-white/60 transition-colors"
                style={{ fontFamily: 'var(--font-header-nav)' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
