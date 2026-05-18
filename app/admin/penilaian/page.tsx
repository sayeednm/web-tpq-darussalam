'use client'

import { useEffect, useState } from 'react'
import { getSantri, getGuru, getKelas, getPenilaian, addPenilaian, updatePenilaian, deletePenilaian } from '@/lib/firestore'
import { Santri, Guru, Kelas, Penilaian } from '@/lib/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const jilidOptions = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Quran', 'Ghorib', 'Tajwid']

const emptyForm = {
  santriId: '', namaSantri: '', kelasId: '', tanggal: new Date().toISOString().split('T')[0],
  jilid: 'Jilid 1', halaman: 1, nilai: 'A' as 'A'|'B'|'C', catatan: '', guruId: '', namaGuru: '',
}

export default function PenilaianPage() {
  const [data, setData] = useState<Penilaian[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterSantri, setFilterSantri] = useState('')

  const load = async () => {
    setLoading(true)
    const [p, s, g, k] = await Promise.all([getPenilaian(), getSantri(), getGuru(), getKelas()])
    setData(p)
    setSantriList(s.filter(x => x.status === 'aktif'))
    setGuruList(g.filter(x => x.status === 'aktif'))
    setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (p: Penilaian) => { setForm({ ...p }); setEditId(p.id!); setShowModal(true) }

  const handleSantriChange = (id: string) => {
    const s = santriList.find(x => x.id === id)
    setForm(f => ({ ...f, santriId: id, namaSantri: s?.nama || '', kelasId: s?.kelasId || '' }))
  }

  const handleGuruChange = (id: string) => {
    const g = guruList.find(x => x.id === id)
    setForm(f => ({ ...f, guruId: id, namaGuru: g?.nama || '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updatePenilaian(editId, form)
      else await addPenilaian(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data penilaian ini?')) return
    await deletePenilaian(id)
    await load()
  }

  const filtered = filterSantri ? data.filter(d => d.santriId === filterSantri) : data
  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'
  const nilaiColor = { A: 'bg-green-100 text-green-700', B: 'bg-yellow-100 text-yellow-700', C: 'bg-red-100 text-red-700' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Penilaian Baca Quran</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Tambah Penilaian
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <select value={filterSantri} onChange={e => setFilterSantri(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">Semua Santri</option>
          {santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Belum ada data penilaian</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Tanggal</th>
                <th className="text-left px-4 py-3">Santri</th>
                <th className="text-left px-4 py-3">Kelas</th>
                <th className="text-left px-4 py-3">Jilid</th>
                <th className="text-left px-4 py-3">Hal</th>
                <th className="text-left px-4 py-3">Nilai</th>
                <th className="text-left px-4 py-3">Guru</th>
                <th className="text-left px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{p.tanggal}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.namaSantri}</td>
                  <td className="px-4 py-3 text-gray-600">{namaKelas(p.kelasId)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.jilid}</td>
                  <td className="px-4 py-3 text-gray-600">{p.halaman}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${nilaiColor[p.nilai]}`}>{p.nilai}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.namaGuru}</td>
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
              <h2 className="text-lg font-semibold">{editId ? 'Edit Penilaian' : 'Tambah Penilaian'}</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guru Penilai</label>
                <select value={form.guruId} onChange={e => handleGuruChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jilid</label>
                  <select value={form.jilid} onChange={e => setForm(f => ({ ...f, jilid: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {jilidOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Halaman</label>
                  <input type="number" min={1} value={form.halaman} onChange={e => setForm(f => ({ ...f, halaman: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
                  <select value={form.nilai} onChange={e => setForm(f => ({ ...f, nilai: e.target.value as 'A'|'B'|'C' }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="A">A - Lancar</option>
                    <option value="B">B - Cukup</option>
                    <option value="C">C - Perlu Latihan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} rows={2}
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
