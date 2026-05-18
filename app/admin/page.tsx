'use client'

import { useEffect, useState } from 'react'
import { getSantri, getGuru, getKelas, getPembayaran } from '@/lib/firestore'
import { Users, GraduationCap, BookOpen, Wallet, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ santri: 0, guru: 0, kelas: 0, lunas: 0, totalSPP: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [santri, guru, kelas, pembayaran] = await Promise.all([
          getSantri(), getGuru(), getKelas(), getPembayaran(),
        ])
        const bulanIni = new Date().toLocaleString('id-ID', { month: 'long' })
        const pembayaranBulanIni = pembayaran.filter(p => p.bulan === bulanIni)
        const lunas = pembayaranBulanIni.filter(p => p.status === 'lunas').length
        const totalSPP = pembayaranBulanIni.filter(p => p.status === 'lunas').reduce((a, b) => a + b.jumlah, 0)
        setStats({
          santri: santri.filter(s => s.status === 'aktif').length,
          guru: guru.filter(g => g.status === 'aktif').length,
          kelas: kelas.length,
          lunas,
          totalSPP,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const bulanIni = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })

  const cards = [
    {
      label: 'Santri Aktif',
      value: stats.santri,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      desc: 'Total santri terdaftar'
    },
    {
      label: 'Guru Aktif',
      value: stats.guru,
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      desc: 'Pengajar aktif'
    },
    {
      label: 'Kelas',
      value: stats.kelas,
      icon: BookOpen,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      desc: 'Kelas tersedia'
    },
    {
      label: 'SPP Lunas',
      value: stats.lunas,
      icon: Wallet,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      desc: bulanIni
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <Calendar size={14} />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-32 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {cards.map(({ label, value, icon: Icon, gradient, bg, text, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`${bg} p-2.5 rounded-xl`}>
                  <Icon size={20} className={text} />
                </div>
                <TrendingUp size={14} className="text-gray-300" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* SPP Summary */}
      <div className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Total SPP Terkumpul Bulan Ini</p>
            <p className="text-2xl lg:text-3xl font-bold mt-1">
              Rp {stats.totalSPP.toLocaleString('id-ID')}
            </p>
            <p className="text-emerald-200 text-xs mt-1">{bulanIni}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Wallet size={28} className="text-white" />
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: 'Santri', href: '/admin/santri', icon: Users, color: 'text-blue-500 bg-blue-50' },
            { label: 'Guru', href: '/admin/guru', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Kelas', href: '/admin/kelas', icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
            { label: 'Absensi', href: '/admin/absensi', icon: Calendar, color: 'text-orange-500 bg-orange-50' },
            { label: 'Penilaian', href: '/admin/penilaian', icon: TrendingUp, color: 'text-pink-500 bg-pink-50' },
            { label: 'SPP', href: '/admin/pembayaran', icon: Wallet, color: 'text-amber-500 bg-amber-50' },
          ].map(({ label, href, icon: Icon, color }) => (
            <a key={href} href={href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-center">
              <div className={`p-2.5 rounded-xl ${color.split(' ')[1]}`}>
                <Icon size={18} className={color.split(' ')[0]} />
              </div>
              <span className="text-xs font-medium text-gray-600">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
