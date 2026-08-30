'use client'

import { motion } from 'framer-motion'
import { Camera, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

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

  // Duplikat foto supaya loop terlihat mulus
  const displayFotos = fotos.length > 0 ? [...fotos, ...fotos, ...fotos] : []

  const handleTouchStart = () => setPaused(true)
  const handleTouchEnd = () => setPaused(false)

  return (
    <section id="galeri" className="relative py-20 overflow-hidden bg-slate-800">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full opacity-10 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Galeri Kegiatan</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Dokumentasi kegiatan pembelajaran dan kebersamaan santri TPQ Darussalam
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex gap-4 px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-64 h-48 flex-shrink-0 bg-slate-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : fotos.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Belum ada foto galeri</p>
        </div>
      ) : (
        <>
          {/* Fade overlay kiri & kanan */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-800 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 to-transparent z-10 pointer-events-none" />

            {/* Track bergerak */}
            <div
              className="overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                ref={trackRef}
                className="flex gap-3 py-2"
                style={{
                  animation: `marquee ${fotos.length * 3}s linear infinite`,
                  animationPlayState: paused ? 'paused' : 'running',
                  width: 'max-content',
                }}
              >
                {displayFotos.map((foto, index) => (
                  <div
                    key={`${foto.id}-${index}`}
                    className="group relative w-44 h-36 sm:w-64 sm:h-48 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                    onClick={() => setSelected(foto)}
                  >
                    <img
                      src={foto.url}
                      alt={foto.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 active:bg-black/40 transition-all flex items-end justify-start p-3">
                      <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all truncate drop-shadow">
                        {foto.nama}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-1.5">
                        <Camera className="text-white w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 text-xs mt-4">
            Sentuh untuk berhenti • Klik foto untuk memperbesar
          </p>
        </>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <button className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition">
            <Camera size={20} />
          </button>
          <img
            src={selected.url}
            alt={selected.nama}
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white/70 text-sm">{selected.nama}</p>
        </div>
      )}

      {/* CSS animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  )
}
