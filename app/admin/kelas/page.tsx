'use client'

import { useEffect, useState } from 'react'
import { getKelas, addKelas, updateKelas, deleteKelas, getGuru } from '@/lib/firestore'
import { Kelas, Guru } from '@/lib/types'
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react'

const emptyForm: Omit<Kelas, 'id'> = { nama: '', level: '', guruId: '', kapasitas: 20 }

const levelUmmi = [
  'Pra Jilid',
  'Jilid 1',
  'Jilid 2',
  'Jilid 3',
  'Jilid 4',
  'Jilid 5',
  'Jilid 6',
  'Gharib',
  'Tajwid',
  'Al-Quran',
  'Tahfidz',
]

export default function KelasPage() {
  const [data, setData] = useState<Kelas[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const [k, g] = await Promise.all([getKelas(), getGuru()])
    setData(k)
    setGuruList(g.filter(g => g.status === 'aktif'))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (k: Kelas) => { setForm({ ...k }); setEditId(k.id!); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updateKelas(editId, form)
      else await addKelas(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus kelas "${nama}"?`)) return
    await deleteKelas(id)
    await load()
  }

  const namaGuru = (id: string) => guruList.find(g => g.id === id)?.nama || '-'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Kelas</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data.length} kelas tersedia</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-200">
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Kelas</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada kelas</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Nama Kelas</th>
                  <th className="text-left px-5 py-3.5">Level</th>
                  <th className="text-left px-5 py-3.5">Guru</th>
                  <th className="text-left px-5 py-3.5">Kapasitas</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map(k => (
                  <tr key={k.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 font-medium text-gray-800">{k.nama}</td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{k.level}</span></td>
                    <td className="px-5 py-4 text-gray-600">{namaGuru(k.guruId)}</td>
                    <td className="px-5 py-4 text-gray-600">{k.kapasitas} santri</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(k)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(k.id!, k.nama)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {data.map(k => (
              <div key={k.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <BookOpen size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{k.nama}</p>
                      <p className="text-xs text-gray-500">{k.level} · {namaGuru(k.guruId)}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{k.kapasitas} santri</span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(k)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 rounded-xl text-xs font-medium">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(k.id!, k.nama)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 bg-red-50 rounded-xl text-xs font-medium">
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
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Nama Kelas', key: 'nama', placeholder: 'Contoh: Jilid 1 - Kelas A' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Level / Jilid (Metode Ummi)</label>
                <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="">-- Pilih Level --</option>
                  {levelUmmi.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Guru Pengampu</label>
                <select value={form.guruId} onChange={e => setForm(f => ({ ...f, guruId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Kapasitas</label>
                <input type="number" value={form.kapasitas} onChange={e => setForm(f => ({ ...f, kapasitas: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
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
