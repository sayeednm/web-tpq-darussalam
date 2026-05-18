'use client'

import { useEffect, useState, useMemo } from 'react'
import { getSantri, getGuru, getKelas, getPenilaian, addPenilaian, updatePenilaian, deletePenilaian } from '@/lib/firestore'
import { Santri, Guru, Kelas, Penilaian } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react'

const jilidOptions = ['Jilid 1','Jilid 2','Jilid 3','Jilid 4','Jilid 5','Jilid 6','Al-Quran','Ghorib','Tajwid']
const nilaiColor = { A: 'bg-green-100 text-green-700', B: 'bg-yellow-100 text-yellow-700', C: 'bg-red-100 text-red-700' }

const emptyForm = {
  santriId: '', namaSantri: '', kelasId: '',
  tanggal: new Date().toISOString().split('T')[0],
  jilid: 'Jilid 1', halaman: 1, nilai: 'A' as 'A'|'B'|'C',
  catatan: '', guruId: '', namaGuru: '',
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
    setData(p); setSantriList(s.filter(x => x.status === 'aktif'))
    setGuruList(g.filter(x => x.status === 'aktif')); setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => filterSantri ? data.filter(d => d.santriId === filterSantri) : data, [data, filterSantri])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (p: Penilaian) => { setForm({ ...p, catatan: p.catatan || '' }); setEditId(p.id!); setShowModal(true) }

  const handleSantriChange = (id: string) => {
    const s = santriList.find(x => x.id === id)
    setForm(f => ({ ...f, santriId: id, namaSantri: s?.nama || '', kelasId: s?.kelasId || '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updatePenilaian(editId, form)
      else await addPenilaian(form)
      setShowModal(false); await load()
    } finally { setSaving(false) }
  }

  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Penilaian Baca Quran</h1>
          <p className="text-gray-500 text-sm mt-0.5">Progress baca santri (Metode Ummi)</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-200">
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Penilaian</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <select value={filterSantri} onChange={e => setFilterSantri(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
          <option value="">Semua Santri</option>
          {santriList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Star size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data penilaian</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Tanggal</th>
                  <th className="text-left px-5 py-3.5">Santri</th>
                  <th className="text-left px-5 py-3.5">Jilid</th>
                  <th className="text-left px-5 py-3.5">Hal</th>
                  <th className="text-left px-5 py-3.5">Nilai</th>
                  <th className="text-left px-5 py-3.5">Guru</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 text-gray-500 text-xs">{p.tanggal}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{p.namaSantri}</td>
                    <td className="px-5 py-4 text-gray-600">{p.jilid}</td>
                    <td className="px-5 py-4 text-gray-600">{p.halaman}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${nilaiColor[p.nilai]}`}>{p.nilai}</span></td>
                    <td className="px-5 py-4 text-gray-600">{p.namaGuru}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={async () => { if (confirm('Hapus?')) { await deletePenilaian(p.id!); load() } }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{p.namaSantri}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.jilid} · Hal {p.halaman} · {p.tanggal}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Guru: {p.namaGuru}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-sm font-bold ${nilaiColor[p.nilai]}`}>{p.nilai}</span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 rounded-xl text-xs font-medium">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={async () => { if (confirm('Hapus?')) { await deletePenilaian(p.id!); load() } }}
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
              <h2 className="text-lg font-semibold">{editId ? 'Edit Penilaian' : 'Tambah Penilaian'}</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Guru Penilai</label>
                <select value={form.guruId} onChange={e => { const g = guruList.find(x => x.id === e.target.value); setForm(f => ({ ...f, guruId: e.target.value, namaGuru: g?.nama || '' })) }}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Jilid</label>
                  <select value={form.jilid} onChange={e => setForm(f => ({ ...f, jilid: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    {jilidOptions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Halaman</label>
                  <input type="number" min={1} value={form.halaman} onChange={e => setForm(f => ({ ...f, halaman: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nilai</label>
                  <select value={form.nilai} onChange={e => setForm(f => ({ ...f, nilai: e.target.value as 'A'|'B'|'C' }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                    <option value="A">A - Lancar</option>
                    <option value="B">B - Cukup</option>
                    <option value="C">C - Perlu Latihan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Catatan</label>
                <textarea value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} rows={2}
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
