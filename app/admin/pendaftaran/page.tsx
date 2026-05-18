'use client'

import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, updateDoc, doc, orderBy, query, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CheckCircle, XCircle, Clock, Phone, Mail, User, Search, UserPlus } from 'lucide-react'
import { addSantri } from '@/lib/firestore'

interface Pendaftaran {
  id: string
  nama: string
  usia?: string
  tempatLahir?: string
  tanggalLahir?: string
  jenisKelamin?: 'L' | 'P'
  alamat?: string
  namaAyah?: string
  namaIbu?: string
  noHpOrtu?: string
  // legacy fields
  email?: string
  telepon?: string
  program: string
  pesan?: string
  status: 'baru' | 'diproses' | 'diterima' | 'ditolak'
  createdAt: string
}

const statusConfig = {
  baru: { label: 'Baru', color: 'bg-blue-100 text-blue-700', icon: Clock },
  diproses: { label: 'Diproses', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  diterima: { label: 'Diterima', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function PendaftaranPage() {
  const [data, setData] = useState<Pendaftaran[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [accepting, setAccepting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const q = query(collection(db, 'pendaftaran'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Pendaftaran)))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => data.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) || d.telepon.includes(search)
    const matchStatus = filterStatus ? d.status === filterStatus : true
    return matchSearch && matchStatus
  }), [data, search, filterStatus])

  const updateStatus = async (id: string, status: Pendaftaran['status']) => {
    await updateDoc(doc(db, 'pendaftaran', id), { status })
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  // Terima = update status + otomatis tambah ke data santri dengan data lengkap
  const handleTerima = async (p: Pendaftaran) => {
    if (!confirm(`Terima "${p.nama}" dan tambahkan ke Data Santri?`)) return
    setAccepting(p.id)
    try {
      await addSantri({
        nama: p.nama,
        tempatLahir: p.tempatLahir || '',
        tanggalLahir: p.tanggalLahir || '',
        jenisKelamin: p.jenisKelamin || 'L',
        alamat: p.alamat || '',
        namaAyah: p.namaAyah || '',
        namaIbu: p.namaIbu || '',
        noHpOrtu: p.noHpOrtu || p.telepon || '',
        kelasId: '',
        tanggalMasuk: new Date().toISOString().split('T')[0],
        status: 'aktif',
      })
      await updateDoc(doc(db, 'pendaftaran', p.id), { status: 'diterima' })
      setData(prev => prev.map(d => d.id === p.id ? { ...d, status: 'diterima' } : d))
      alert(`${p.nama} berhasil ditambahkan ke Data Santri! Lengkapi kelas di menu Data Santri.`)
    } finally {
      setAccepting(null)
    }
  }

  const stats = {
    baru: data.filter(d => d.status === 'baru').length,
    diterima: data.filter(d => d.status === 'diterima').length,
    total: data.length,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Pendaftaran Masuk</h1>
        <p className="text-gray-500 text-sm mt-0.5">Data calon santri dari form pendaftaran landing page</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-600' },
          { label: 'Baru', value: stats.baru, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Diterima', value: stats.diterima, color: 'bg-green-50 text-green-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau telepon..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="diterima">Diterima</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <User size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada pendaftaran</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            const cfg = statusConfig[p.status]
            const StatusIcon = cfg.icon
            return (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600 flex-shrink-0">
                    {p.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{p.nama}</h3>
                      <span className="text-xs text-gray-400">· {p.usia} tahun</span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600 font-medium mt-1">{p.program}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone size={11} />{p.noHpOrtu || p.telepon}</span>
                      {p.alamat && <span className="flex items-center gap-1"><Mail size={11} />{p.alamat}</span>}
                    </div>
                    {(p.namaAyah || p.namaIbu) && (
                      <p className="text-xs text-gray-500 mt-1">
                        Ayah: {p.namaAyah || '-'} · Ibu: {p.namaIbu || '-'}
                      </p>
                    )}
                    {p.tanggalLahir && (
                      <p className="text-xs text-gray-400 mt-0.5">TTL: {p.tempatLahir}, {p.tanggalLahir}</p>
                    )}
                    {p.pesan && <p className="text-xs text-gray-400 mt-2 italic">"{p.pesan}"</p>}
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                {p.status !== 'diterima' && p.status !== 'ditolak' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => updateStatus(p.id, 'diproses')}
                      className="flex-1 py-2 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition">
                      Proses
                    </button>
                    <button onClick={() => handleTerima(p)} disabled={accepting === p.id}
                      className="flex-1 py-2 text-xs font-medium bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-1 disabled:opacity-50">
                      {accepting === p.id ? (
                        <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><UserPlus size={11} /> Terima</>
                      )}
                    </button>
                    <button onClick={() => updateStatus(p.id, 'ditolak')}
                      className="flex-1 py-2 text-xs font-medium bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition">
                      Tolak
                    </button>
                    <a href={`https://wa.me/${p.telepon.replace(/\D/g, '').replace(/^0/, '62')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition text-center">
                      WA
                    </a>
                  </div>
                )}

                {/* Sudah diterima — link ke data santri */}
                {p.status === 'diterima' && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <a href="/admin/santri"
                      className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition">
                      <CheckCircle size={13} />
                      Sudah masuk Data Santri — Lengkapi datanya
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
