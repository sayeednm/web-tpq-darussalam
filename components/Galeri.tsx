'use client'

import { motion } from 'framer-motion'
import { Camera, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface FotoGaleri {
  id: string
  url: string
  nama: string
  createdAt: string
}

export default function Galeri() {
  const [fotos, setFotos] = useState<FotoGaleri[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FotoGaleri | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setFotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as FotoGaleri)))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section id="galeri" className="relative py-20 overflow-hidden bg-slate-800">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Galeri Kegiatan</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Dokumentasi kegiatan pembelajaran dan kebersamaan santri TPQ Darussalam
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : fotos.length === 0 ? (
          <div className="py-16 text-center">
            <ImageIcon size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Belum ada foto galeri</p>
            <p className="text-slate-500 text-sm mt-1">Admin dapat menambahkan foto melalui panel admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fotos.map((foto, index) => (
              <motion.div
                key={foto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                onClick={() => setSelected(foto)}
              >
                <img src={foto.url} alt={foto.nama}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-all w-8 h-8 drop-shadow-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition">
            <Camera size={20} />
          </button>
          <img src={selected.url} alt={selected.nama}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()} />
          <p className="absolute bottom-6 text-white/70 text-sm">{selected.nama}</p>
        </div>
      )}
    </section>
  )
}
