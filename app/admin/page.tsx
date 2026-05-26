'use client'

import { useEffect, useState } from 'react'
import { getSantri, getGuru, getKelas, getPembayaran } from '@/lib/firestore'
import { Users, GraduationCap, BookOpen, Wallet, TrendingUp, Calendar, Link, Check } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ santri: 0, guru: 0, kelas: 0, lunas: 0, totalSPP: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const link = `${window.location.origin}/daftar`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleShareWA = () => {
    const link = `${window.location.origin}/daftar`
    const msg = `Assalamu'alaikum 🙏\n\nSilakan isi formulir pendaftaran santri TPQ Darussalam melalui link berikut:\n\n${link}\n\nJazakumullahu khairan 🤲`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

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
    { label: 'Santri Aktif', value: stats.santri, icon: Users, bg: 'bg-blue-50', text: 'text-blue-600', desc: 'Total santri terdaftar' },
    { label: 'Guru Aktif', value: stats.guru, icon: GraduationCap, bg: 'bg-emerald-50', text: 'text-emerald-600', desc: 'Pengajar aktif' },
    { label: 'Kelas', value: stats.kelas, icon: BookOpen, bg: 'bg-purple-50', text: 'text-purple-600', desc: 'Kelas tersedia' },
    { label: 'SPP Lunas', value: stats.lunas, icon: Wallet, bg: 'bg-amber-50', text: 'text-amber-600', desc: bulanIni },
  ]

  return (
    <div className="overflow-hidden">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <Calendar size={14} />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-32 shadow-sm" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {cards.map(({ label, value, icon: Icon, bg, text, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className={`${bg} p-2.5 rounded-xl flex-shrink-0`}>
                  <Icon size={20} className={text} />
                </div>
                <TrendingUp size={14} className="text-gray-300 flex-shrink-0" />
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 truncate">{value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5 truncate">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-emerald-100 text-sm">Total SPP Terkumpul Bulan Ini</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 truncate">Rp {stats.totalSPP.toLocaleString('id-ID')}</p>
            <p className="text-emerald-200 text-xs mt-1">{bulanIni}</p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Wallet size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Link Pendaftaran */}
      <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Link size={16} className="text-emerald-600" />
          <h2 className="text-sm font-semibold text-gray-700">Link Formulir Pendaftaran</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">Kirim link ini ke wali santri agar bisa mengisi formulir pendaftaran langsung dari HP mereka.</p>
        {/* URL + Salin */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 font-mono truncate min-w-0">
            {typeof window !== 'undefined' ? `${window.location.origin}/daftar` : '.../daftar'}
          </div>
          <button onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition flex-shrink-0 ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
            {copied ? <><Check size={13} /> Tersalin</> : <><Link size={13} /> Salin</>}
          </button>
        </div>
        {/* Kirim WA full width */}
        <button onClick={handleShareWA}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Kirim via WhatsApp
        </button>
      </div>

      <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Akses Cepat</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: 'Santri', href: '/admin/santri', icon: Users, color: 'text-blue-500 bg-blue-50' },
            { label: 'Guru', href: '/admin/guru', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Kelas', href: '/admin/kelas', icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
            { label: 'Absensi', href: '/admin/absensi', icon: Calendar, color: 'text-orange-500 bg-orange-50' },
            { label: 'Penilaian', href: '/admin/penilaian', icon: TrendingUp, color: 'text-pink-500 bg-pink-50' },
            { label: 'SPP', href: '/admin/pembayaran', icon: Wallet, color: 'text-amber-500 bg-amber-50' },
          ].map(({ label, href, icon: Icon, color }) => (
            <a key={href} href={href} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition text-center">
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
