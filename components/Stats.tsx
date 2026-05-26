'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Users, BookOpen, Award, Heart, X, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface GuruPublic {
  id: string
  nama: string
  jabatan: string
  jenisKelamin: 'L' | 'P'
  tanggalMasuk: string
  tempatLahir?: string
}

interface SantriPublic {
  id: string
  nama: string
  jenisKelamin: 'L' | 'P'
  tanggalMasuk: string
}

export default function Stats() {
  const [santriCount, setSantriCount] = useState<number | null>(null)
  const [guruCount, setGuruCount] = useState<number | null>(null)
  const [showGuru, setShowGuru] = useState(false)
  const [showSantri, setShowSantri] = useState(false)
  const [guruList, setGuruList] = useState<GuruPublic[]>([])
  const [santriList, setSantriList] = useState<SantriPublic[]>([])
  const [selectedGuru, setSelectedGuru] = useState<GuruPublic | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guruSnap, santriSnap] = await Promise.all([
          getDocs(query(collection(db, 'guru'), where('status', '==', 'aktif'))),
          getDocs(query(collection(db, 'santri'), where('status', '==', 'aktif'))),
        ])
        setGuruCount(guruSnap.size)
        setSantriCount(santriSnap.size)
        setGuruList(guruSnap.docs.map(d => ({ id: d.id, ...d.data() } as GuruPublic)))
        setSantriList(santriSnap.docs.map(d => ({ id: d.id, ...d.data() } as SantriPublic)))
      } catch {}
    }
    fetchData()
  }, [])

  const stats = [
    { icon: Users, number: santriCount !== null ? `${santriCount}` : '–', label: 'Santri Aktif', color: 'emerald', onClick: () => setShowSantri(true) },
    { icon: BookOpen, number: '10+', label: 'Tahun Pengalaman', color: 'amber', onClick: undefined },
    { icon: Award, number: guruCount !== null ? `${guruCount}` : '–', label: 'Guru Bersertifikat', color: 'emerald', onClick: () => setShowGuru(true) },
    { icon: Heart, number: '98%', label: 'Kepuasan Orang Tua', color: 'amber', onClick: undefined },
  ]

  return (
    <>
      {/* ── STATS SECTION ── */}
      <section className="relative py-16 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 block" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#10b981" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <div onClick={stat.onClick} className={`rounded-2xl p-6 text-center shadow-lg border transition-all duration-300 ${stat.color === 'amber' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'} ${stat.onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl active:scale-95' : ''}`}>
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${stat.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-500'}`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-4xl font-bold mb-1 ${stat.color === 'amber' ? 'text-amber-500' : 'text-emerald-600'}`}>{stat.number}</div>
                  <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                  {stat.onClick && <p className="text-xs text-emerald-500 mt-1.5 font-medium">Lihat detail →</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL GURU ── */}
      <AnimatePresence>
        {showGuru && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowGuru(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><GraduationCap size={20} /><span className="text-emerald-100 text-sm font-medium">Tim Pengajar</span></div>
                    <h2 className="text-2xl font-bold">Guru TPQ Darussalam</h2>
                    <p className="text-emerald-200 text-sm mt-1">{guruCount} guru aktif · Bersyahadah Metode Ummi</p>
                  </div>
                  <button onClick={() => setShowGuru(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition flex-shrink-0"><X size={18} /></button>
                </div>
              </div>
              <div className="overflow-y-auto p-5">
                {guruList.length === 0 ? (
                  <div className="py-16 text-center text-gray-400"><GraduationCap size={48} className="mx-auto mb-3 text-gray-200" /><p className="font-medium">Belum ada data guru</p></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guruList.map((g) => (
                      <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer hover:border-emerald-200 hover:-translate-y-0.5 active:scale-95"
                        onClick={() => setSelectedGuru(g)}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm ${g.jenisKelamin === 'P' ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white' : 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'}`}>
                            {g.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate">{g.nama}</p>
                            <p className="text-sm text-emerald-600 font-medium">{g.jabatan || 'Pengajar'}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${g.jenisKelamin === 'P' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'}`}>{g.jenisKelamin === 'P' ? 'Ustadzah' : 'Ustadz'}</span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">🎓 Bersyahadah Ummi</span>
                        </div>
                        {g.tanggalMasuk && <p className="text-xs text-gray-400 mt-2">Bergabung {new Date(g.tanggalMasuk).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>}
                        <p className="text-xs text-emerald-500 mt-2 font-medium">Lihat profil →</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL SANTRI ── */}
      <AnimatePresence>
        {showSantri && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowSantri(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Users size={20} /><span className="text-blue-100 text-sm font-medium">Data Santri</span></div>
                    <h2 className="text-2xl font-bold">Santri Aktif</h2>
                    <p className="text-blue-200 text-sm mt-1">{santriCount} santri terdaftar aktif</p>
                  </div>
                  <button onClick={() => setShowSantri(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition flex-shrink-0"><X size={18} /></button>
                </div>
              </div>
              <div className="overflow-y-auto p-5">
                {santriList.length === 0 ? (
                  <div className="py-16 text-center text-gray-400"><Users size={48} className="mx-auto mb-3 text-gray-200" /><p className="font-medium">Belum ada data santri</p></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {santriList.map((s, i) => (
                      <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-2 shadow-sm ${s.jenisKelamin === 'P' ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'}`}>
                          {s.nama.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-800 text-sm truncate">{s.nama}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${s.jenisKelamin === 'P' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                          {s.jenisKelamin === 'P' ? 'Perempuan' : 'Laki-laki'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL DETAIL GURU ── */}
      <AnimatePresence>
        {selectedGuru && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedGuru(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.88, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className={`relative p-8 text-center overflow-hidden ${selectedGuru.jenisKelamin === 'P' ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-6 -mb-6" />
                <button onClick={() => setSelectedGuru(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-xl transition">
                  <X size={16} className="text-white" />
                </button>
                <div className="relative">
                  <div className="w-20 h-20 bg-white/25 rounded-3xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3 shadow-lg">
                    {selectedGuru.nama.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedGuru.nama}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{selectedGuru.jabatan || 'Pengajar'}</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${selectedGuru.jenisKelamin === 'P' ? 'bg-pink-100 text-pink-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {selectedGuru.jenisKelamin === 'P' ? '👩 Ustadzah' : '👨 Ustadz'}
                  </span>
                  <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-semibold">🎓 Bersyahadah Ummi</span>
                </div>
                <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500">Jabatan</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedGuru.jabatan || 'Pengajar'}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500">Jenis Kelamin</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedGuru.jenisKelamin === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
                  </div>
                  {selectedGuru.tanggalMasuk && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500">Bergabung</span>
                      <span className="text-sm font-semibold text-gray-800">{new Date(selectedGuru.tanggalMasuk).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  {selectedGuru.tempatLahir && (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500">Asal</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedGuru.tempatLahir}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelectedGuru(null)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold text-sm transition mt-2">
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
