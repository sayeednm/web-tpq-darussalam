'use client'

import { useEffect, useState, useMemo } from 'react'
import { getSantri, getKelas, getPembayaran, addPembayaran, updatePembayaran, deletePembayaran } from '@/lib/firestore'
import { Santri, Kelas, Pembayaran } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Wallet } from 'lucide-react'

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const tahunList = [2023, 2024, 2025, 2026]
const statusColor = { lunas: 'bg-green-100 text-green-700', belum: 'bg-red-100 text-red-700', cicil: 'bg-yellow-100 text-yellow-700' }

const emptyForm = {
  santriId: '', namaSantri: '', kelasId: '',
  bulan: bulanList[new Date().getMonth()],
  tahun: new Date().getFullYear(),
  jumlah: 50000, status: 'belum' as 'lunas'|'belum'|'cicil',
  tanggalBayar: '', keterangan: '',
}

export default function PembayaranPage() {
  const [data, setData] = useState<Pembayaran[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterBulan, setFilterBulan] = useState(bulanList[new Date().getMonth()])
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear())

  const load = async () => {
    setLoading(true)
    const [p, s, k] = await Promise.all([getPembayaran(), getSantri(), getKelas()])
    setData(p); setSantriList(s.filter(x => x.status === 'aktif')); setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => data.filter(d => d.bulan === filterBulan && d.tahun === filterTahun), [data, filterBulan, filterTahun])
  const totalLunas = useMemo(() => filtered.filter(d => d.status === 'lunas').reduce((a, b) => a + b.jumlah, 0), [filtered])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (p: Pembayaran) => { setForm({ ...p, tanggalBayar: p.tanggalBayar || '', keterangan: p.keterangan || '' }); setEditId(p.id!); setShowModal(true) }

  const handleSantriChange = (id: string) => {
    const s = santriList.find(x => x.id === id)
    setForm(f => ({ ...f, santriId: id, namaSantri: s?.nama || '', kelasId: s?.kelasId || '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updatePembayaran(editId, form)
      else await addPembayaran(form)
      setShowModal(false); await load()
    } finally { setSaving(false) }
  }

  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SPP / Keuangan</h1>
          <p className="text-gray-500 text-sm mt-0.5">Kelola pembayaran SPP santri</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-200">
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Pembayaran</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Filter + Total */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Bulan</label>
            <select value={filterBulan} onChange={e => setFilterBulan(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
              {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Tahun</label>
            <select value={filterTahun} onChange={e => setFilterTahun(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
              {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 rounded-xl text-white flex items-center justify-between">
          <p className="text-sm text-emerald-100">Total Terkumpul</p>
          <p className="text-lg font-bold">Rp {totalLunas.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Wallet size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data pembayaran</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Santri</th>
                  <th className="text-left px-5 py-3.5">Kelas</th>
                  <th className="text-left px-5 py-3.5">Jumlah</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Tgl Bayar</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-medium text-gray-800">{p.namaSantri}</td>
                    <td className="px-5 py-4 text-gray-600">{namaKelas(p.kelasId)}</td>
                    <td className="px-5 py-4 text-gray-600">Rp {p.jumlah.toLocaleString('id-ID')}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span></td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{p.tanggalBayar || '-'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={async () => { if (confirm('Hapus?')) { await deletePembayaran(p.id!); load() } }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.namaSantri}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{namaKelas(p.kelasId)} · Rp {p.jumlah.toLocaleString('id-ID')}</p>
                    {p.tanggalBayar && <p className="text-xs text-gray-400 mt-0.5">Bayar: {p.tanggalBayar}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 rounded-xl text-xs font-medium">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={async () => { if (confirm('Hapus?')) { await deletePembayaran(p.id!); load() } }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 bg-red-50 rounded-xl text-xs font-medium">
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Santri</label>
                <select value={form.santriId} onChange={e => handleSantriChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="">-- Pilih Santri --</option>
                  {santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Bulan</label>
                  <select value={form.bulan} onChange={e => setForm(f => ({ ...f, bulan: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Tahun</label>
                  <select value={form.tahun} onChange={e => setForm(f => ({ ...f, tahun: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Jumlah (Rp)</label>
                  <input type="number" value={form.jumlah} onChange={e => setForm(f => ({ ...f, jumlah: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    <option value="belum">Belum Bayar</option>
                    <option value="lunas">Lunas</option>
                    <option value="cicil">Cicil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal Bayar</label>
                <input type="date" value={form.tanggalBayar} onChange={e => setForm(f => ({ ...f, tanggalBayar: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Keterangan</label>
                <textarea value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
