'use client'

import { useState, useEffect } from 'react'
import { getSantri, getGuru, getKelas } from '@/lib/firestore'
import { Santri, Guru, Kelas } from '@/lib/types'
import PrintDaftarHadir from './PrintDaftarHadir'
import PrintJurnalGuru from './PrintJurnalGuru'
import PrintAbsensiGuru from './PrintAbsensiGuru'
import { Printer, Users, BookOpen, ClipboardList } from 'lucide-react'

const BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

const now = new Date()

export default function CetakPage() {
  const [tab, setTab] = useState<'hadir' | 'jurnal' | 'absensi'>('hadir')
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)

  // Filter state
  const [bulan, setBulan] = useState(now.getMonth()) // 0-indexed
  const [tahun, setTahun] = useState(now.getFullYear())
  const [kelasId, setKelasId] = useState('')
  const [guruId, setGuruId] = useState('')

  useEffect(() => {
    Promise.all([getSantri(), getGuru(), getKelas()]).then(([s, g, k]) => {
      setSantriList(s)
      setGuruList(g.filter(x => x.status === 'aktif'))
      setKelasList(k)
      if (k.length) setKelasId(k[0].id!)
      if (g.length) setGuruId(g[0].id!)
      setLoading(false)
    })
  }, [])

  const tahunOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

  const tabs = [
    { key: 'hadir', label: 'Daftar Hadir Santri', icon: Users },
    { key: 'jurnal', label: 'Jurnal Mengajar Ustadzah', icon: BookOpen },
    { key: 'absensi', label: 'Absensi Ustadzah', icon: ClipboardList },
  ] as const

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cetak / Print</h1>
        <p className="text-gray-500 text-sm mt-0.5">Preview dan cetak format dokumen TPQ Darussalam</p>
      </div>

      {/* Tab */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
          <select
            value={bulan}
            onChange={e => setBulan(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
          >
            {BULAN.map((b, i) => <option key={i} value={i}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
          <select
            value={tahun}
            onChange={e => setTahun(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
          >
            {tahunOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {tab === 'hadir' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
            <select
              value={kelasId}
              onChange={e => setKelasId(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
            >
              {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
        )}
        {tab === 'jurnal' && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ustadzah</label>
            <select
              value={guruId}
              onChange={e => setGuruId(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
            >
              {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
            </select>
          </div>
        )}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-200 ml-auto"
        >
          <Printer size={15} />
          Cetak
        </button>
      </div>

      {/* Preview */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          Memuat data...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
          {tab === 'hadir' && (
            <PrintDaftarHadir
              santriList={santriList.filter(s => s.kelasId === kelasId && s.status === 'aktif')}
              kelas={kelasList.find(k => k.id === kelasId)}
              guru={guruList.find(g => kelasList.find(k => k.id === kelasId)?.guruId === g.id)}
              bulan={bulan}
              tahun={tahun}
            />
          )}
          {tab === 'jurnal' && (
            <PrintJurnalGuru
              guru={guruList.find(g => g.id === guruId)}
              bulan={bulan}
              tahun={tahun}
            />
          )}
          {tab === 'absensi' && (
            <PrintAbsensiGuru
              guruList={guruList}
              bulan={bulan}
              tahun={tahun}
            />
          )}
        </div>
      )}

      {/* Print style global */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: fixed; left: 0; top: 0; width: 100%; }
          nav, aside, header, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}
