'use client'

import { motion } from 'framer-motion'
import { BookOpen, Star, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section id="beranda" className="relative pt-24 pb-16 overflow-hidden">
      {/* Background dengan pattern Islami */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        {/* Ornamen melingkar */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-amber-600 px-5 py-2.5 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 fill-current" />
              <span className="text-sm font-bold">Metode Ummi Bersertifikat</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Membentuk Generasi{' '}
              <span className="text-amber-300">Qur'ani</span> yang Berakhlak Mulia
            </h1>
            
            <p className="text-lg text-emerald-50 mb-8 leading-relaxed drop-shadow">
              TPQ Darussalam menggunakan Metode Ummi yang terbukti efektif dalam mengajarkan 
              Al-Qur&apos;an dengan tartil, tajwid yang benar, dan suasana yang menyenangkan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#daftar"
                className="bg-amber-400 text-emerald-900 px-8 py-4 rounded-xl hover:bg-amber-300 transition-all font-bold text-center shadow-2xl hover:shadow-amber-400/50 hover:scale-105 transform"
              >
                Daftar Sekarang
              </a>
              <a
                href="#metode-ummi"
                className="bg-white/90 backdrop-blur-sm text-emerald-700 px-8 py-4 rounded-xl hover:bg-white transition-all font-bold text-center border-2 border-white shadow-xl hover:scale-105 transform"
              >
                Pelajari Metode Ummi
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Card dengan glassmorphism effect */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                {/* Logo Metode Ummi */}
                <div className="w-40 h-40 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl"></div>
                  <img 
                    src="/logo-ummi.png" 
                    alt="Logo Metode Ummi" 
                    className="relative w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <BookOpen className="hidden w-40 h-40 text-emerald-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Metode Ummi</h3>
                  <p className="text-gray-600">Belajar Al-Qur&apos;an dengan Mudah</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
