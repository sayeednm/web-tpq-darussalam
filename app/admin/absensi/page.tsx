'use client'

import { useEffect, useState } from 'react'
import { getSantri, getKelas, getAbsensi, addAbsensi, updateAbsensi } from '@/lib/firestore'
import { Santri, Kelas, Absensi } from '@/lib/types'
import { Save, ClipboardList } from 'lucide-react'

const statusOptions = ['hadir', 'izin', 'sakit', 'alpha'] as const
const statusColor: Record<string, string> = {
  hadir: 'bg-green-100 text-green-700 border-green-200',
  izin: 'bg-blue-100 text-blue-700 border-blue-200',
  sakit: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  alpha: 'bg-red-100 text-red-700 border-red-200',
}

export default function AbsensiPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [selectedKelas, setSelectedKelas] = useState('')
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [absensiMap, setAbsensiMap] = useState<Record<string, { status: Absensi['status'], id?: string }>>({})

  useEffect(() => {
    getKelas().then(setKelasList)
  }, [])

  useEffect(() => {
    if (!selectedKelas) return
    async function loadData() {
      setLoading(true)
      const [santri, absensi] = await Promise.all([getSantri(), getAbsensi(tanggal, selectedKelas)])
      const filtered = santri.filter(s => s.kelasId === selectedKelas && s.status === 'aktif')
      setSantriList(filtered)
      const map: Record<string, { status: Absensi['status'], id?: string }> = {}
      filtered.forEach(s => { map[s.id!] = { status: 'hadir' } })
      absensi.forEach(a => { if (a.santriId) map[a.santriId] = { status: a.status, id: a.id } })
      setAbsensiMap(map)
      setLoading(false)
    }
    loadData()
  }, [selectedKelas, tanggal])

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const santri of santriList) {
        const entry = absensiMap[santri.id!]
        if (!entry) continue
        if (entry.id) await updateAbsensi(entry.id, { status: entry.status })
        else await addAbsensi({ tanggal, santriId: santri.id!, namaSantri: santri.nama, kelasId: selectedKelas, status: entry.status })
      }
      alert('Absensi berhasil disimpan!')
    } finally {
      setSaving(false)
    }
  }

  const setStatus = (santriId: string, status: Absensi['status']) => {
    setAbsensiMap(m => ({ ...m, [santriId]: { ...m[santriId], status } }))
  }

  const summary = santriList.reduce((acc, s) => {
    const st = absensiMap[s.id!]?.status || 'hadir'
    acc[st] = (acc[st] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Absensi Santri</h1>
        <p className="text-gray-500 text-sm mt-0.5">Catat kehadiran santri per kelas</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal</label>
            <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Kelas</label>
            <select value={selectedKelas} onChange={e => setSelectedKelas(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
              <option value="">-- Pilih Kelas --</option>
              {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
        </div>
      </div>

      {selectedKelas && (
        <>
          {/* Summary */}
          {santriList.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {(['hadir', 'izin', 'sakit', 'alpha'] as const).map(st => (
                <div key={st} className={`rounded-xl p-3 text-center ${statusColor[st].split(' ').slice(0, 2).join(' ')}`}>
                  <p className="text-xl font-bold">{summary[st] || 0}</p>
                  <p className="text-xs font-medium capitalize">{st}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Memuat data...</div>
            ) : santriList.length === 0 ? (
              <div className="p-8 text-center">
                <ClipboardList size={36} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400">Tidak ada santri aktif di kelas ini</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        <th className="text-left px-5 py-3.5 w-8">No</th>
                        <th className="text-left px-5 py-3.5">Nama Santri</th>
                        <th className="text-left px-5 py-3.5">Status Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {santriList.map((s, i) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-4 text-gray-400 text-xs">{i + 1}</td>
                          <td className="px-5 py-4 font-medium text-gray-800">{s.nama}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              {statusOptions.map(st => (
                                <button key={st} onClick={() => setStatus(s.id!, st)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${absensiMap[s.id!]?.status === st ? statusColor[st] : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                                  {st.charAt(0).toUpperCase() + st.slice(1)}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-50">
                  {santriList.map((s, i) => (
                    <div key={s.id} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                          {s.nama.charAt(0)}
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{s.nama}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 ml-8">
                        {statusOptions.map(st => (
                          <button key={st} onClick={() => setStatus(s.id!, st)}
                            className={`py-2 rounded-xl text-xs font-medium border transition ${absensiMap[s.id!]?.status === st ? statusColor[st] : 'border-gray-200 text-gray-400'}`}>
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t flex justify-end">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 shadow-lg shadow-emerald-200">
                    <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Absensi'}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
