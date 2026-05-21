'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Award, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Stats() {
  const [santriCount, setSantriCount] = useState<number | null>(null)
  const [guruCount, setGuruCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [santriSnap, guruSnap] = await Promise.all([
          getCountFromServer(collection(db, 'santri')),
          getCountFromServer(collection(db, 'guru')),
        ])
        setSantriCount(santriSnap.data().count)
        setGuruCount(guruSnap.data().count)
      } catch {
        // fallback ke null, tampilkan tanda '-'
      }
    }
    fetchCounts()
  }, [])

  const stats = [
    {
      icon: Users,
      number: santriCount !== null ? `${santriCount}` : '–',
      label: 'Santri Aktif',
      color: 'emerald',
    },
    {
      icon: BookOpen,
      number: '10+',
      label: 'Tahun Pengalaman',
      color: 'amber',
    },
    {
      icon: Award,
      number: guruCount !== null ? `${guruCount}` : '–',
      label: 'Guru Bersertifikat',
      color: 'emerald',
    },
    {
      icon: Heart,
      number: '98%',
      label: 'Kepuasan Orang Tua',
      color: 'amber',
    },
  ]

  return (
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
              <div className={`rounded-2xl p-6 text-center shadow-lg border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                stat.color === 'amber'
                  ? 'bg-amber-50 border-amber-100'
                  : 'bg-emerald-50 border-emerald-100'
              }`}>
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  stat.color === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`text-4xl font-bold mb-1 ${
                  stat.color === 'amber' ? 'text-amber-500' : 'text-emerald-600'
                }`}>{stat.number}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
