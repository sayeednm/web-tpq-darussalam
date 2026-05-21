'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { getSantri, addSantri, updateSantri, deleteSantri, getKelas } from '@/lib/firestore'
import { Santri, Kelas } from '@/lib/types'
import { Plus, Pencil, Trash2, Search, X, Users, Download, Copy, Check } from 'lucide-react'

const emptyForm: Omit<Santri, 'id'> = {
  nama: '', nik: '', noKK: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'L',
  alamat: '', namaAyah: '', nikAyah: '', namaIbu: '', nikIbu: '', noHpOrtu: '',
  kelasId: '', tanggalMasuk: '', status: 'aktif',
}

const statusColor: Record<string, string> = {
  aktif: 'bg-green-100 text-green-700',
  nonaktif: 'bg-gray-100 text-gray-600',
  lulus: 'bg-blue-100 text-blue-700',
}

export default function SantriPage() {
  const [data, setData] = useState<Santri[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const load = async () => {
    setLoading(true)
    const [s, k] = await Promise.all([getSantri(), getKelas()])
    setData(s)
    setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    data.filter(s =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.noHpOrtu.includes(search) ||
      (s.nik ?? '').includes(search)
    ), [data, search])

  const openAdd = useCallback(() => { setForm(emptyForm); setEditId(null); setShowModal(true) }, [])
  const openEdit = useCallback((s: Santri) => { setForm({ ...s }); setEditId(s.id!); setShowModal(true) }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updateSantri(editId, form)
      else await addSantri(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus santri "${nama}"?`)) return
    await deleteSantri(id)
    await load()
  }

  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'

  // Export ke CSV untuk Kemenag
  const exportCSV = () => {
    const header = ['No', 'Nama Santri', 'NIK', 'No KK', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Alamat', 'Nama Ayah', 'NIK Ayah', 'Nama Ibu', 'NIK Ibu', 'No HP Ortu', 'Kelas', 'Tanggal Masuk', 'Status']
    const rows = data.filter(s => s.status === 'aktif').map((s, i) => [
      i + 1,
      s.nama,
      s.nik || '',
      s.noKK || '',
      s.tempatLahir,
      s.tanggalLahir,
      s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      s.alamat,
      s.namaAyah,
      s.nikAyah || '',
      s.namaIbu,
      s.nikIbu || '',
      s.noHpOrtu,
      namaKelas(s.kelasId),
      s.tanggalMasuk,
      s.status,
    ])
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-santri-tpq-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Copy tabel teks untuk paste ke spreadsheet/Kemenag
  const copyTable = async () => {
    const header = ['No', 'Nama Santri', 'NIK', 'No KK', 'Tempat Lahir', 'Tanggal Lahir', 'L/P', 'Alamat', 'Nama Ayah', 'NIK Ayah', 'Nama Ibu', 'NIK Ibu', 'No HP Ortu', 'Kelas'].join('\t')
    const rows = data.filter(s => s.status === 'aktif').map((s, i) =>
      [i + 1, s.nama, s.nik || '-', s.noKK || '-', s.tempatLahir, s.tanggalLahir,
       s.jenisKelamin === 'L' ? 'L' : 'P', s.alamat, s.namaAyah, s.nikAyah || '-',
       s.namaIbu, s.nikIbu || '-', s.noHpOrtu, namaKelas(s.kelasId)].join('\t')
    )
    await navigator.clipboard.writeText([header, ...rows].join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Santri</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data.filter(s => s.status === 'aktif').length} santri aktif</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-200">
            <Plus size={16} />
            <span className="hidden sm:inline">Tambah Santri</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, atau no HP orang tua..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data santri</p>
          <p className="text-gray-400 text-sm mt-1">Klik tombol Tambah Santri untuk memulai</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Nama</th>
                  <th className="text-left px-5 py-3.5">NIK</th>
                  <th className="text-left px-5 py-3.5">Kelas</th>
                  <th className="text-left px-5 py-3.5">No HP Ortu</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          {s.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{s.nama}</p>
                          <p className="text-xs text-gray-400">{s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs font-mono">{s.nik || <span className="text-gray-300 italic">belum diisi</span>}</td>
                    <td className="px-5 py-4 text-gray-600">{namaKelas(s.kelasId)}</td>
                    <td className="px-5 py-4 text-gray-600">{s.noHpOrtu}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id!, s.nama)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                      {s.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.nama}</p>
                      <p className="text-xs text-gray-500">{namaKelas(s.kelasId)} · {s.noHpOrtu}</p>
                      {s.nik && <p className="text-xs text-gray-400 font-mono">NIK: {s.nik}</p>}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(s)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-medium transition">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(s.id!, s.nama)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-medium transition">
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold">Export Data Santri</h2>
              <button onClick={() => setShowExport(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-500">Data santri aktif ({data.filter(s => s.status === 'aktif').length} santri) siap diekspor.</p>

              <button onClick={exportCSV}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Download size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Download CSV</p>
                  <p className="text-xs text-gray-500">Buka di Excel / Google Sheets, lalu copy ke form Kemenag</p>
                </div>
              </button>

              <button onClick={copyTable}
                className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${copied ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{copied ? 'Tersalin!' : 'Copy ke Clipboard'}</p>
                  <p className="text-xs text-gray-500">Langsung paste ke spreadsheet atau form online Kemenag</p>
                </div>
              </button>
            </div>
            <div className="p-5 border-t">
              <button onClick={() => setShowExport(false)} className="w-full py-3 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-medium">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-800">{editId ? 'Edit Santri' : 'Tambah Santri'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-5">

              {/* Data KK */}
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Data KK & NIK</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'NIK Santri', key: 'nik', placeholder: '16 digit NIK' },
                    { label: 'No. Kartu Keluarga (KK)', key: 'noKK', placeholder: '16 digit No. KK' },
                    { label: 'NIK Ayah', key: 'nikAyah', placeholder: '16 digit NIK Ayah' },
                    { label: 'NIK Ibu', key: 'nikIbu', placeholder: '16 digit NIK Ibu' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                      <input type="text" inputMode="numeric" maxLength={16} value={(form as any)[key] ?? ''}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 font-mono" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Santri */}
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Data Santri</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Lengkap</label>
                    <input type="text" value={form.nama}
                      onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  </div>
                  {[
                    { label: 'Tempat Lahir', key: 'tempatLahir', type: 'text' },
                    { label: 'Tanggal Lahir', key: 'tanggalLahir', type: 'date' },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                      <input type={type} value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
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
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Alamat</label>
                    <textarea value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
                  </div>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Data Orang Tua</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Nama Ayah', key: 'namaAyah', type: 'text' },
                    { label: 'Nama Ibu', key: 'namaIbu', type: 'text' },
                    { label: 'No HP Orang Tua', key: 'noHpOrtu', type: 'text' },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                      <input type={type} value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data TPQ */}
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-3">Data TPQ</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Kelas</label>
                    <select value={form.kelasId} onChange={e => setForm(f => ({ ...f, kelasId: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal Masuk</label>
                    <input type="date" value={form.tanggalMasuk}
                      onChange={e => setForm(f => ({ ...f, tanggalMasuk: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-aktif</option>
                      <option value="lulus">Lulus</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium disabled:opacity-50 transition">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const statusColor: Record<string, string> = {
  aktif: 'bg-green-100 text-green-700',
  nonaktif: 'bg-gray-100 text-gray-600',
  lulus: 'bg-blue-100 text-blue-700',
}

export default function SantriPage() {
  const [data, setData] = useState<Santri[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const [s, k] = await Promise.all([getSantri(), getKelas()])
    setData(s)
    setKelasList(k)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    data.filter(s =>
      s.nama.toLowerCase().includes(search.toLowerCase()) ||
      s.noHpOrtu.includes(search)
    ), [data, search])

  const openAdd = useCallback(() => { setForm(emptyForm); setEditId(null); setShowModal(true) }, [])
  const openEdit = useCallback((s: Santri) => { setForm({ ...s }); setEditId(s.id!); setShowModal(true) }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editId) await updateSantri(editId, form)
      else await addSantri(form)
      setShowModal(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus santri "${nama}"?`)) return
    await deleteSantri(id)
    await load()
  }

  const namaKelas = (id: string) => kelasList.find(k => k.id === id)?.nama || '-'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Santri</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data.filter(s => s.status === 'aktif').length} santri aktif</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-200">
          <Plus size={16} />
          <span className="hidden sm:inline">Tambah Santri</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau no HP orang tua..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Belum ada data santri</p>
          <p className="text-gray-400 text-sm mt-1">Klik tombol Tambah Santri untuk memulai</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3.5">Nama</th>
                  <th className="text-left px-5 py-3.5">Kelas</th>
                  <th className="text-left px-5 py-3.5">No HP Ortu</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          {s.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{s.nama}</p>
                          <p className="text-xs text-gray-400">{s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{namaKelas(s.kelasId)}</td>
                    <td className="px-5 py-4 text-gray-600">{s.noHpOrtu}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(s.id!, s.nama)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                      {s.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.nama}</p>
                      <p className="text-xs text-gray-500">{namaKelas(s.kelasId)} · {s.noHpOrtu}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[s.status]}`}>{s.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button onClick={() => openEdit(s)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-medium transition">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(s.id!, s.nama)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-medium transition">
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-gray-800">{editId ? 'Edit Santri' : 'Tambah Santri'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Nama Lengkap', key: 'nama', type: 'text' },
                { label: 'Tempat Lahir', key: 'tempatLahir', type: 'text' },
                { label: 'Tanggal Lahir', key: 'tanggalLahir', type: 'date' },
                { label: 'Nama Ayah', key: 'namaAyah', type: 'text' },
                { label: 'Nama Ibu', key: 'namaIbu', type: 'text' },
                { label: 'No HP Orang Tua', key: 'noHpOrtu', type: 'text' },
                { label: 'Tanggal Masuk', key: 'tanggalMasuk', type: 'date' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Kelas</label>
                <select value={form.kelasId} onChange={e => setForm(f => ({ ...f, kelasId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="">-- Pilih Kelas --</option>
                  {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                  <option value="lulus">Lulus</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Alamat</label>
                <textarea value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium disabled:opacity-50 transition">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
