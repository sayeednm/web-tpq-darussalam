'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Award, Heart, X, GraduationCap, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface GuruPublic {
  id: string
  nama: string
  jabatan: string
  jenisKelamin: 'L' | 'P'
  tanggalMasuk: string
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
  const [loadingModal, setLoadingModal] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
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
    fetchCounts()
  }, [])

  const stats = [
    {
      icon: Users,
      number: santriCount !== null ? `${santriCount}` : '–',
      label: 'Santri Aktif',
      color: 'emerald',
      onClick: () => setShowSantri(true),
    },
    {
      icon: BookOpen,
      number: '10+',
      label: 'Tahun Pengalaman',
      color: 'amber',
      onClick: undefined,
    },
    {
      icon: Award,
      number: guruCount !== null ? `${guruCount}` : '–',
      label: 'Guru Bersertifikat',
      color: 'emerald',
      onClick: () => setShowGuru(true),
    },
    {
      icon: Heart,
      number: '98%',
      label: 'Kepuasan Orang Tua',
      color: 'amber',
      onClick: undefined,
    },
  ]

  return (
    <>
      <section className="relative py-16 bg-white overflow-hidden">
        {/* Wave divider dari Hero */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 block" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#10b981" className="fill-emerald-500" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  onClick={stat.onClick}
                  className={`rounded-2xl p-6 text-center shadow-lg border transition-all duration-300 ${
                    stat.color === 'amber'
                      ? 'bg-amber-50 border-amber-100 hover:shadow-xl'
                      : 'bg-emerald-50 border-emerald-100 hover:shadow-xl'
                  } ${stat.onClick ? 'cursor-pointer hover:-translate-y-1 active:scale-95' : ''}`}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                    stat.color === 'amber' ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`text-4xl font-bold mb-1 ${
                    stat.color === 'amber' ? 'text-amber-500' : 'text-emerald-600'
                  }`}>{stat.number}</div>
                  <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                  {stat.onClick && (
                    <p className="text-xs text-emerald-500 mt-1.5 font-medium">Lihat detail →</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Profil Guru */}
      {showGuru && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
          onClick={() => setShowGuru(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Guru TPQ Darussalam</h2>
                <p className="text-xs text-gray-500">{guruCount} guru aktif bersertifikat Metode Ummi</p>
              </div>
              <button onClick={() => setShowGuru(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {guruList.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <GraduationCap size={36} className="mx-auto mb-2 text-gray-300" />
                  <p>Belum ada data guru</p>
                </div>
              ) : guruList.map((g, i) => (
                <div key={g.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                    g.jenisKelamin === 'P' ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {g.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{g.nama}</p>
                    <p className="text-sm text-emerald-600">{g.jabatan || 'Pengajar'}</p>
                    {g.tanggalMasuk && (
                      <p className="text-xs text-gray-400 mt-0.5">Bergabung: {new Date(g.tanggalMasuk).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        {g.jenisKelamin === 'P' ? 'Ustadzah' : 'Ustadz'}
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        🎓 Bersyahadah Ummi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Daftar Santri */}
      {showSantri && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm"
          onClick={() => setShowSantri(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Santri Aktif</h2>
                <p className="text-xs text-gray-500">{santriCount} santri terdaftar aktif</p>
              </div>
              <button onClick={() => setShowSantri(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {santriList.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  <Users size={36} className="mx-auto mb-2 text-gray-300" />
                  <p>Belum ada data santri</p>
                </div>
              ) : santriList.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-400 w-6 text-center flex-shrink-0">{i + 1}</span>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    s.jenisKelamin === 'P' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {s.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{s.nama}</p>
                    {s.tanggalMasuk && (
                      <p className="text-xs text-gray-400">Masuk: {new Date(s.tanggalMasuk).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    s.jenisKelamin === 'P' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {s.jenisKelamin === 'P' ? 'Perempuan' : 'Laki-laki'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
