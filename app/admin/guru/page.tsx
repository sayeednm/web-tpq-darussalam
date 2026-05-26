'use client'

import { useEffect, useState } from 'react'
import { getGuru, addGuru, updateGuru, deleteGuru } from '@/lib/firestore'
import { Guru } from '@/lib/types'
import { Plus, Pencil, Trash2, Search, X, GraduationCap } from 'lucide-react'

const emptyForm: Omit<Guru, 'id'> = {
  nama: '', nik: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'L',
  alamat: '', noHp: '', email: '', jabatan: '',
  kelasAjar: [], tanggalMasuk: '', status: 'aktif',
}

export default function GuruPage() {
  const [data, setData] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setData(await getGuru())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = data.filter(g =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.noHp.includes(search)
  )

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
  const openEdit = (g: Guru) => { setForm({ ...g }); setEditId(g.id!); setShowModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updateGuru(editId, form)
      else await addGuru(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus guru "${nama}"?`)) return
    await deleteGuru(id)
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Guru</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data.filter(g => g.status === 'aktif').length} guru aktif</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-200">
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Guru</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau no HP..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <GraduationCap size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data guru</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Nama</th>
                  <th className="text-left px-5 py-3.5">Jabatan</th>
                  <th className="text-left px-5 py-3.5">No HP</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(g => (
                  <tr key={g.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                          {g.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{g.nama}</p>
                          <p className="text-xs text-gray-400">{g.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{g.jabatan}</td>
                    <td className="px-5 py-4 text-gray-600">{g.noHp}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${g.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(g)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(g.id!, g.nama)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(g => (
              <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                    {g.nama.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{g.nama}</p>
                    <p className="text-xs text-gray-500">{g.jabatan} · {g.noHp}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {g.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(g)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 rounded-xl text-xs font-medium">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(g.id!, g.nama)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 bg-red-50 rounded-xl text-xs font-medium">
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
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Guru' : 'Tambah Guru'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nama Lengkap', key: 'nama', type: 'text' },
                { label: 'NIK', key: 'nik', type: 'text', placeholder: '16 digit NIK' },
                { label: 'Tempat Lahir', key: 'tempatLahir', type: 'text' },
                { label: 'Tanggal Lahir', key: 'tanggalLahir', type: 'date' },
                { label: 'No HP', key: 'noHp', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Jabatan', key: 'jabatan', type: 'text' },
                { label: 'Tanggal Masuk', key: 'tanggalMasuk', type: 'date' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key] ?? ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Jenis Kelamin</label>
                <select value={form.jenisKelamin} onChange={e => setForm(f => ({ ...f, jenisKelamin: e.target.value as 'L' | 'P' }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Alamat</label>
                <textarea value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} rows={2}
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
