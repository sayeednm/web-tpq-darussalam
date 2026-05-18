'use client'

import { useEffect, useState } from 'react'
import { getKelas, addKelas, updateKelas, deleteKelas } from '@/lib/firestore'
import { getGuru } from '@/lib/firestore'
import { Kelas, Guru } from '@/lib/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const emptyForm: Omit<Kelas, 'id'> = { nama: '', level: '', guruId: '', kapasitas: 20 }

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Kelas</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> Tambah Kelas
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Belum ada kelas</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">Nama Kelas</th>
                <th className="text-left px-4 py-3">Level</th>
                <th className="text-left px-4 py-3">Guru</th>
                <th className="text-left px-4 py-3">Kapasitas</th>
                <th className="text-left px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(k => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{k.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{k.level}</td>
                  <td className="px-4 py-3 text-gray-600">{namaGuru(k.guruId)}</td>
                  <td className="px-4 py-3 text-gray-600">{k.kapasitas} santri</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(k)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(k.id!, k.nama)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
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
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level / Jilid</label>
                <input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}
                  placeholder="Contoh: Jilid 1, Jilid 2, Al-Quran"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guru Pengampu</label>
                <select value={form.guruId} onChange={e => setForm(f => ({ ...f, guruId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                <input type="number" value={form.kapasitas} onChange={e => setForm(f => ({ ...f, kapasitas: Number(e.target.value) }))}
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
