'use client'

import { useEffect, useState, useRef } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Upload, Trash2, Image as ImageIcon, CheckCircle, ImagePlus, AlertCircle, Clock, Save, Pencil } from 'lucide-react'

interface FotoGaleri {
  id: string
  url: string
  publicId: string
  nama: string
  deskripsi: string
  createdAt: string
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

async function uploadToCloudinary(file: File, folder: string): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET!)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload gagal')
  const data = await res.json()
  return { url: data.secure_url, publicId: data.public_id }
}

export default function MediaPage() {
  const [fotos, setFotos] = useState<FotoGaleri[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [doneCount, setDoneCount] = useState(0)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [jadwal, setJadwal] = useState('Senin - Jumat: 15.30 - 17.30 WIB | Sabtu: 08.00 - 10.00 WIB')
  const [savingJadwal, setSavingJadwal] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // State form upload foto
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; nama: string; deskripsi: string; previewUrl: string }[]>([])

  // State modal edit foto
  const [editFoto, setEditFoto] = useState<FotoGaleri | null>(null)
  const [editNama, setEditNama] = useState('')
  const [editDeskripsi, setEditDeskripsi] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const fotoInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }
  const showError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(''), 4000)
  }

  const loadFotos = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'galeri'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setFotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as FotoGaleri)))
    } catch {}
    setLoading(false)
  }

  const loadLogo = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'logo'))
      if (snap.exists()) setLogoUrl(snap.data().url)
    } catch {}
  }

  const loadJadwal = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'jadwal'))
      if (snap.exists() && snap.data().teks) setJadwal(snap.data().teks)
    } catch {}
  }

  useEffect(() => { loadFotos(); loadLogo(); loadJadwal() }, [])

  // Pilih file → tampilkan form isi nama & deskripsi
  const handleFotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''
    setSelectedFiles(files.map(f => ({
      file: f,
      nama: f.name.replace(/\.[^/.]+$/, ''), // hapus ekstensi
      deskripsi: '',
      previewUrl: URL.createObjectURL(f),
    })))
    setShowUploadForm(true)
  }

  // Upload semua file dengan nama & deskripsi yang sudah diisi
  const handleFotoUpload = async () => {
    if (!selectedFiles.length) return

    if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'isi_cloud_name_kamu') {
      showError('Cloudinary belum dikonfigurasi. Isi CLOUD_NAME dan UPLOAD_PRESET di .env.local')
      return
    }

    setUploading(true)
    setUploadingCount(selectedFiles.length)
    setDoneCount(0)
    setShowUploadForm(false)

    for (const item of selectedFiles) {
      try {
        const { url, publicId } = await uploadToCloudinary(item.file, 'tpq-galeri')
        await addDoc(collection(db, 'galeri'), {
          url, publicId,
          nama: item.nama || item.file.name,
          deskripsi: item.deskripsi || '',
          createdAt: new Date().toISOString(),
        })
        setDoneCount(prev => prev + 1)
      } catch {
        showError(`Gagal upload: ${item.file.name}`)
      }
    }

    setUploading(false)
    setSelectedFiles(prev => {
      prev.forEach(f => URL.revokeObjectURL(f.previewUrl))
      return []
    })
    showSuccess(`${selectedFiles.length} foto berhasil diupload!`)
    loadFotos()
  }

  const handleDeleteFoto = async (foto: FotoGaleri) => {
    if (!confirm(`Hapus foto "${foto.nama}"?`)) return
    await deleteDoc(doc(db, 'galeri', foto.id))
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    showSuccess('Foto dihapus.')
  }

  const handleOpenEdit = (foto: FotoGaleri) => {
    setEditFoto(foto)
    setEditNama(foto.nama || '')
    setEditDeskripsi(foto.deskripsi || '')
  }

  const handleSaveEdit = async () => {
    if (!editFoto) return
    setSavingEdit(true)
    try {
      await updateDoc(doc(db, 'galeri', editFoto.id), {
        nama: editNama,
        deskripsi: editDeskripsi,
      })
      setFotos(prev => prev.map(f => f.id === editFoto.id ? { ...f, nama: editNama, deskripsi: editDeskripsi } : f))
      showSuccess('Foto berhasil diperbarui!')
      setEditFoto(null)
    } catch {
      showError('Gagal menyimpan perubahan.')
    }
    setSavingEdit(false)
  }

  const handleSaveJadwal = async () => {
    setSavingJadwal(true)
    try {
      await setDoc(doc(db, 'settings', 'jadwal'), { teks: jadwal, updatedAt: new Date().toISOString() })
      showSuccess('Jadwal berhasil disimpan!')
    } catch {
      showError('Gagal menyimpan jadwal.')
    }
    setSavingJadwal(false)
  }

  // Upload logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'isi_cloud_name_kamu') {
      showError('Cloudinary belum dikonfigurasi. Isi CLOUD_NAME dan UPLOAD_PRESET di .env.local')
      return
    }

    setUploadingLogo(true)
    try {
      const { url } = await uploadToCloudinary(file, 'tpq-settings')
      await setDoc(doc(db, 'settings', 'logo'), { url, updatedAt: new Date().toISOString() })
      setLogoUrl(url)
      showSuccess('Logo berhasil diperbarui!')
    } catch {
      showError('Gagal upload logo. Coba lagi.')
    }
    setUploadingLogo(false)
  }

  const configured = CLOUD_NAME && CLOUD_NAME !== 'isi_cloud_name_kamu'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Media & Logo</h1>
        <p className="text-gray-500 text-sm mt-0.5">Kelola foto galeri dan logo TPQ yang tampil di landing page</p>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 bg-red-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Setup banner kalau belum dikonfigurasi */}
      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Cloudinary belum dikonfigurasi</p>
              <p className="text-amber-700 text-sm mt-1">Ikuti langkah berikut:</p>
              <ol className="text-amber-700 text-sm mt-2 space-y-1 list-decimal list-inside">
                <li>Daftar gratis di <a href="https://cloudinary.com" target="_blank" className="underline font-medium">cloudinary.com</a></li>
                <li>Di Dashboard, catat <strong>Cloud Name</strong></li>
                <li>Buka <strong>Settings → Upload → Upload presets</strong> → Add preset → Mode: <strong>Unsigned</strong> → Save</li>
                <li>Isi di <code className="bg-amber-100 px-1 rounded">.env.local</code>:<br />
                  <code className="bg-amber-100 px-2 py-0.5 rounded text-xs block mt-1">
                    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloud_name_kamu<br />
                    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=nama_preset_kamu
                  </code>
                </li>
                <li>Tambahkan juga di <strong>Vercel → Settings → Environment Variables</strong></li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGO SECTION ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Logo TPQ</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 flex-shrink-0 overflow-hidden">
            {logoUrl
              ? <img src={logoUrl} alt="Logo TPQ" className="w-full h-full object-contain p-2" />
              : <ImageIcon size={32} className="text-gray-300" />
            }
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              Upload logo TPQ (PNG transparan lebih bagus). Logo langsung tampil di navbar landing page.
            </p>
            {uploadingLogo && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                Mengupload logo...
              </div>
            )}
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <button onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo || !configured}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
              <Upload size={15} />
              {uploadingLogo ? 'Mengupload...' : logoUrl ? 'Ganti Logo' : 'Upload Logo'}
            </button>
          </div>
        </div>
      </div>

      {/* ── JADWAL SECTION ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Jadwal Pembelajaran</h2>
        <p className="text-xs text-gray-500 mb-4">Tampil di section Program landing page</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={jadwal}
              onChange={e => setJadwal(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
              placeholder="Contoh: Senin - Jumat: 15.30 - 17.30 WIB | Sabtu: 08.00 - 10.00 WIB"
            />
          </div>
          <button onClick={handleSaveJadwal} disabled={savingJadwal}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 flex-shrink-0">
            <Save size={15} />
            {savingJadwal ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* ── GALERI SECTION ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Foto Galeri</h2>
            <p className="text-xs text-gray-500 mt-0.5">{fotos.length} foto · tampil di section Galeri landing page</p>
          </div>
          <div className="flex items-center gap-3">
            {uploading && (
              <span className="text-sm text-emerald-600 flex items-center gap-1.5">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                {doneCount}/{uploadingCount}
              </span>
            )}
            <input ref={fotoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotoSelect} />
            <button onClick={() => fotoInputRef.current?.click()} disabled={uploading || !configured}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 disabled:opacity-50 transition">
              <ImagePlus size={15} />
              Upload Foto
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : fotos.length === 0 ? (
          <div className="py-16 text-center">
            <ImageIcon size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Belum ada foto</p>
            <p className="text-gray-300 text-sm mt-1">Klik Upload Foto untuk menambahkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {fotos.map(foto => (
              <div key={foto.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img src={foto.url} alt={foto.nama} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                  <button onClick={() => handleOpenEdit(foto)}
                    className="opacity-0 group-hover:opacity-100 transition-all bg-white/90 hover:bg-white text-gray-800 p-2 rounded-xl shadow-lg">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteFoto(foto)}
                    className="opacity-0 group-hover:opacity-100 transition-all bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-white text-xs truncate">{foto.nama}</p>
                  {foto.deskripsi && <p className="text-white/70 text-xs truncate">{foto.deskripsi}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL FORM UPLOAD ── */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Detail Foto</h3>
              <p className="text-sm text-gray-500 mt-0.5">Isi nama dan deskripsi untuk setiap foto</p>
            </div>
            <div className="p-6 space-y-6">
              {selectedFiles.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl p-4 space-y-3">
                  {/* Preview */}
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.previewUrl}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Nama */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Foto</label>
                    <input
                      type="text"
                      value={item.nama}
                      onChange={e => setSelectedFiles(prev => prev.map((f, i) => i === idx ? { ...f, nama: e.target.value } : f))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                      placeholder="Nama foto..."                    />
                  </div>
                  {/* Deskripsi */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi / Caption</label>
                    <textarea
                      value={item.deskripsi}
                      onChange={e => setSelectedFiles(prev => prev.map((f, i) => i === idx ? { ...f, deskripsi: e.target.value } : f))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none"
                      placeholder="Deskripsi kegiatan pada foto ini... (opsional)"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowUploadForm(false)
                  setSelectedFiles(prev => {
                    prev.forEach(f => URL.revokeObjectURL(f.previewUrl))
                    return []
                  })
                }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleFotoUpload}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 hover:from-emerald-700 hover:to-teal-700 transition flex items-center justify-center gap-2"
              >
                <Upload size={15} />
                Upload {selectedFiles.length} Foto
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL EDIT FOTO ── */}
      {editFoto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Edit Foto</h3>
              <p className="text-sm text-gray-500 mt-0.5">Ubah nama dan deskripsi foto</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Preview */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                <img src={editFoto.url} alt={editFoto.nama} className="w-full h-full object-cover" />
              </div>
              {/* Nama */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Foto</label>
                <input
                  type="text"
                  value={editNama}
                  onChange={e => setEditNama(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  placeholder="Nama foto..."
                />
              </div>
              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi / Caption</label>
                <textarea
                  value={editDeskripsi}
                  onChange={e => setEditDeskripsi(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none"
                  placeholder="Deskripsi kegiatan pada foto ini... (opsional)"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setEditFoto(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 hover:from-emerald-700 hover:to-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={15} />
                {savingEdit ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
