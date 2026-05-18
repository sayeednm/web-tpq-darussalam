'use client'

import { useEffect, useState } from 'react'
import { getSantri, getKelas, getPembayaran, addPembayaran, updatePembayaran, deletePembayaran } from '@/lib/firestore'
import { Santri, Kelas, Pembayaran } from '@/lib/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const tahunList = [2023, 2024, 2025, 2026]

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
    setData(p)
    setSantriList(s.filter(x => x.status === 'aktif'))
    setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = data.filter(d => d.bulan === filterBulan && d.tahun === filterTahun)

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (p: Pembayaran) => { setForm({ ...p, tanggalBayar: p.tanggalBayar || '' }); setEditId(p.id!); setShowModal(true) }

  const handleSantriChange = (id: string) => {
    const s = santriList.find(x => x.id === id)
    setForm(f => ({ ...f, santriId: id, namaSantri: s?.nama || '', kelasId: s?.kelasId || '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updatePembayaran(editId, form)
      else await addPembayaran(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data pembayaran ini?')) return
    await deletePembayaran(id)
    await load()
  }

  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'
  const statusColor = { lunas: 'bg-green-100 text-green-700', belum: 'bg-red-100 text-red-700', cicil: 'bg-yellow-100 text-yellow-700' }

  const totalLunas = filtered.filter(d => d.status === 'lunas').reduce((a, b) => a + b.jumlah, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SPP / Keuangan</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Tambah Pembayaran
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
          <select value={filterBulan} onChange={e => setFilterBulan(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <select value={filterTahun} onChange={e => setFilterTahun(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="ml-auto bg-emerald-50 px-4 py-2 rounded-lg">
          <p className="text-xs text-emerald-600">Total Terkumpul</p>
          <p className="text-lg font-bold text-emerald-700">Rp {totalLunas.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Belum ada data pembayaran untuk periode ini</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Santri</th>
                <th className="text-left px-4 py-3">Kelas</th>
                <th className="text-left px-4 py-3">Jumlah</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Tgl Bayar</th>
                <th className="text-left px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.namaSantri}</td>
                  <td className="px-4 py-3 text-gray-600">{namaKelas(p.kelasId)}</td>
                  <td className="px-4 py-3 text-gray-600">Rp {p.jumlah.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.tanggalBayar || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p.id!)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
                <select value={form.santriId} onChange={e => handleSantriChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- Pilih Santri --</option>
                  {santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                  <select value={form.bulan} onChange={e => setForm(f => ({ ...f, bulan: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {bulanList.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                  <select value={form.tahun} onChange={e => setForm(f => ({ ...f, tahun: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
                  <input type="number" value={form.jumlah} onChange={e => setForm(f => ({ ...f, jumlah: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="belum">Belum Bayar</option>
                    <option value="lunas">Lunas</option>
                    <option value="cicil">Cicil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Bayar</label>
                <input type="date" value={form.tanggalBayar} onChange={e => setForm(f => ({ ...f, tanggalBayar: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
