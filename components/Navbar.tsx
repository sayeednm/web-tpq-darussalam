'use client'

import { useState, useEffect } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'logo'))
      .then(snap => { if (snap.exists()) setLogoUrl(snap.data().url) })
      .catch(() => {})
  }, [])

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
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-9 h-9 flex-shrink-0 relative">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo TPQ Darussalam" className="w-full h-full object-contain" />
              ) : (
                <>
                  <img 
                    src="/logo-tpq.png" 
                    alt="Logo TPQ Darussalam" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-9 h-9 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-emerald-700 leading-tight truncate">TPQ Darussalam</span>
              <span className="text-xs text-gray-500 leading-tight hidden sm:block truncate">Jl.Kemantren RT 06 RW 01, Keputran</span>
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
