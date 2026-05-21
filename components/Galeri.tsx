'use client'

import { motion } from 'framer-motion'
import { Camera, Users, BookOpen, Heart, Award, Smile } from 'lucide-react'
import { useState } from 'react'

const categories = [
  { id: 'semua', label: 'Semua Foto', icon: Camera },
  { id: 'belajar', label: 'Kegiatan Belajar', icon: BookOpen },
  { id: 'hafalan', label: 'Hafalan', icon: Award },
  { id: 'kebersamaan', label: 'Kebersamaan', icon: Heart },
]

// Placeholder untuk foto - nanti bisa diganti dengan foto asli
const photos = [
  {
    id: 1,
    category: 'belajar',
    title: 'Pembelajaran Metode Ummi',
    description: 'Santri sedang belajar membaca Al-Qur&apos;an dengan Metode Ummi',
    placeholder: 'BookOpen',
  },
  {
    id: 2,
    category: 'hafalan',
    title: 'Setoran Hafalan',
    description: 'Santri menyetorkan hafalan kepada ustadz',
    placeholder: 'Award',
  },
  {
    id: 3,
    category: 'kebersamaan',
    title: 'Kegiatan Bersama',
    description: 'Suasana kebersamaan santri TPQ Darussalam',
    placeholder: 'Users',
  },
  {
    id: 4,
    category: 'belajar',
    title: 'Kelas Pra-TK',
    description: 'Pembelajaran untuk santri usia dini',
    placeholder: 'Smile',
  },
  {
    id: 5,
    category: 'hafalan',
    title: 'Wisuda Tahfidz',
    description: 'Wisuda santri yang telah menyelesaikan hafalan',
    placeholder: 'Award',
  },
  {
    id: 6,
    category: 'kebersamaan',
    title: 'Kegiatan Outdoor',
    description: 'Kegiatan outdoor learning santri',
    placeholder: 'Heart',
  },
]

const iconMap = {
  BookOpen,
  Award,
  Users,
  Smile,
  Heart,
}

export default function Galeri() {
  const [activeCategory, setActiveCategory] = useState('semua')

  const filteredPhotos = activeCategory === 'semua' 
    ? photos 
    : photos.filter(photo => photo.category === activeCategory)

  return (
    <section id="galeri" className="relative py-20 overflow-hidden bg-slate-800">
      {/* Dekorasi */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Galeri Kegiatan
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Dokumentasi kegiatan pembelajaran dan kebersamaan santri TPQ Darussalam
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => {
            const IconComponent = iconMap[photo.placeholder as keyof typeof iconMap]
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                {/* Placeholder Image - Ganti dengan <img> untuk foto asli */}
                <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20"></div>
                  <IconComponent className="w-24 h-24 text-emerald-600 relative z-10 group-hover:scale-110 transition-transform" />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Camera className="w-6 h-6 mb-2" />
                      <p className="text-sm">Lihat Detail</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{photo.title}</h3>
                  <p className="text-gray-500 text-sm">{photo.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
