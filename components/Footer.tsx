'use client'

import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="kontak" className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 rounded-full opacity-10 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-2xl font-bold">TPQ Darussalam</h3>
            </div>
            <p className="text-emerald-100 leading-relaxed">
              Taman Pendidikan Al-Qur'an dengan Metode Ummi yang terpercaya untuk membentuk generasi Qur&apos;ani.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg text-amber-300">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <MapPin className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-emerald-100">
                  Jl. Kemantren RT06 RW01, Keputran, Kec. Tulangan, Kabupaten Sidoarjo, Jawa Timur 61273
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <Phone className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-emerald-100">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <Mail className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-emerald-100">info@tpqdarussalam.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg text-amber-300">Ikuti Kami</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-amber-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 transform shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-amber-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 transform shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-amber-400 rounded-xl flex items-center justify-center transition-all hover:scale-110 transform shadow-lg"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-700/50 pt-8 text-center">
          <p className="text-emerald-200">&copy; {new Date().getFullYear()} TPQ Darussalam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
