'use client'

import { useEffect, useState } from 'react'
import { getSantri, getKelas, getAbsensi, addAbsensi, updateAbsensi } from '@/lib/firestore'
import { Santri, Kelas, Absensi } from '@/lib/types'
import { Save } from 'lucide-react'

const statusOptions = ['hadir', 'izin', 'sakit', 'alpha'] as const
const statusColor: Record<string, string> = {
  hadir: 'bg-green-100 text-green-700',
  izin: 'bg-blue-100 text-blue-700',
  sakit: 'bg-yellow-100 text-yellow-700',
  alpha: 'bg-red-100 text-red-700',
}

export default function AbsensiPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [santriList, setSantriList] = useState<Santri[]>([])
  const [absensiData, setAbsensiData] = useState<Absensi[]>([])
  const [selectedKelas, setSelectedKelas] = useState('')
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [absensiMap, setAbsensiMap] = useState<Record<string, { status: Absensi['status'], id?: string }>>({})

  useEffect(() => {
    async function loadInit() {
      const [k] = await Promise.all([getKelas()])
      setKelasList(k)
    }
    loadInit()
  }, [])

  useEffect(() => {
    if (!selectedKelas) return
    async function loadData() {
      setLoading(true)
      const [santri, absensi] = await Promise.all([
        getSantri(),
        getAbsensi(tanggal, selectedKelas),
      ])
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
      const kelas = kelasList.find(k => k.id === selectedKelas)
      for (const santri of santriList) {
        const entry = absensiMap[santri.id!]
        if (!entry) continue
        const data: Omit<Absensi, 'id'> = {
          tanggal, santriId: santri.id!, namaSantri: santri.nama,
          kelasId: selectedKelas, status: entry.status,
        }
        if (entry.id) await updateAbsensi(entry.id, { status: entry.status })
        else await addAbsensi(data)
      }
      alert('Absensi berhasil disimpan!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Absensi Santri</h1>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
          <select value={selectedKelas} onChange={e => setSelectedKelas(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="">-- Pilih Kelas --</option>
            {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
      </div>

      {selectedKelas && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Memuat data...</div>
          ) : santriList.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Tidak ada santri aktif di kelas ini</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">No</th>
                    <th className="text-left px-4 py-3">Nama Santri</th>
                    <th className="text-left px-4 py-3">Status Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {santriList.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{s.nama}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {statusOptions.map(st => (
                            <button key={st} onClick={() => setAbsensiMap(m => ({ ...m, [s.id!]: { ...m[s.id!], status: st } }))}
                              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                                absensiMap[s.id!]?.status === st
                                  ? statusColor[st] + ' border-transparent'
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t flex justify-end">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Absensi'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
