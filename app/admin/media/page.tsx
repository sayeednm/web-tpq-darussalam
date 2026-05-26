'use client'

import { useEffect, useState, useRef } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Upload, Trash2, Image as ImageIcon, CheckCircle, ImagePlus, AlertCircle } from 'lucide-react'

interface FotoGaleri {
  id: string
  url: string
  publicId: string
  nama: string
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
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

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

  useEffect(() => { loadFotos(); loadLogo() }, [])

  // Upload foto galeri (bisa multiple)
  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''

    if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === 'isi_cloud_name_kamu') {
      showError('Cloudinary belum dikonfigurasi. Isi CLOUD_NAME dan UPLOAD_PRESET di .env.local')
      return
    }

    setUploading(true)
    setUploadingCount(files.length)
    setDoneCount(0)

    for (const file of files) {
      try {
        const { url, publicId } = await uploadToCloudinary(file, 'tpq-galeri')
        await addDoc(collection(db, 'galeri'), {
          url, publicId, nama: file.name,
          createdAt: new Date().toISOString(),
        })
        setDoneCount(prev => prev + 1)
      } catch {
        showError(`Gagal upload: ${file.name}`)
      }
    }

    setUploading(false)
    showSuccess(`${files.length} foto berhasil diupload!`)
    loadFotos()
  }

  const handleDeleteFoto = async (foto: FotoGaleri) => {
    if (!confirm(`Hapus foto "${foto.nama}"?`)) return
    await deleteDoc(doc(db, 'galeri', foto.id))
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    showSuccess('Foto dihapus.')
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
            <input ref={fotoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotoUpload} />
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <button onClick={() => handleDeleteFoto(foto)}
                    className="opacity-0 group-hover:opacity-100 transition-all bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-white text-xs truncate">{foto.nama}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
