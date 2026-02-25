'use client'

import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Keunggulan', href: '#keunggulan' },
    { label: 'Metode Ummi', href: '#metode-ummi' },
    { label: 'Program', href: '#program' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Kontak', href: '#kontak' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg shadow-lg z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              {/* Logo TPQ Darussalam - berbeda dari logo Metode Ummi */}
              <img 
                src="/logo-tpq.png" 
                alt="Logo TPQ Darussalam" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback jika logo belum ada
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-emerald-700 leading-tight">TPQ Darussalam</span>
              <span className="text-xs text-gray-600 leading-tight">Jl.Kemantren RT 06 RW 01, Keputran</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-emerald-600 transition-all font-semibold relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all"></span>
              </a>
            ))}
            <a
              href="#daftar"
              className="bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 px-6 py-2.5 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all font-bold shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Daftar Sekarang
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-emerald-100">
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-gray-700 hover:text-emerald-600 transition-colors font-semibold py-2 hover:bg-emerald-50 px-3 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#daftar"
              className="block text-center bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 px-6 py-3 rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all font-bold shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
