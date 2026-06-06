'use client'

import { Send, User, Phone, MessageSquare, CheckCircle, MapPin, Calendar, Users, BookOpen } from 'lucide-react'
import { useState, FormEvent } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const programOptions = [
  'Pra Jilid (3-5 Tahun)',
  'Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6',
  'Gharib', 'Tajwid', 'Al-Quran', 'Tahfidz',
]

export default function DaftarPage() {
  const [formData, setFormData] = useState({
    nama: '', nik: '', tanggalLahir: '', tempatLahir: '',
    jenisKelamin: 'L', alamat: '',
    noKK: '', namaAyah: '', nikAyah: '', ttlAyah: '', namaIbu: '', nikIbu: '', ttlIbu: '', noHpOrtu: '',
    program: '', pesan: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [errorMsg, setErrorMsg] = useState('')
  const [waUrl, setWaUrl] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await addDoc(collection(db, 'pendaftaran'), {
        ...formData, status: 'baru', createdAt: new Date().toISOString(),
      })
      const message = `*PENDAFTARAN SANTRI BARU*\n*TPQ Darussalam*\n\n*Nama:* ${formData.nama}\n*NIK Santri:* ${formData.nik || '-'}\n*TTL:* ${formData.tempatLahir}, ${formData.tanggalLahir}\n*Jenis Kelamin:* ${formData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}\n*Alamat:* ${formData.alamat}\n\n*No. KK:* ${formData.noKK || '-'}\n*Nama Ayah:* ${formData.namaAyah} (NIK: ${formData.nikAyah || '-'})\n*TTL Ayah:* ${formData.ttlAyah || '-'}\n*Nama Ibu:* ${formData.namaIbu} (NIK: ${formData.nikIbu || '-'})\n*TTL Ibu:* ${formData.ttlIbu || '-'}\n*No HP:* ${formData.noHpOrtu}\n\n*Program:* ${formData.program}\n${formData.pesan ? `*Pesan:* ${formData.pesan}` : ''}\n\n_Terima kasih telah mendaftar di TPQ Darussalam!_`
      const url = `https://wa.me/62895379017798?text=${encodeURIComponent(message)}`
      const opened = window.open(url, '_blank')
      if (!opened) setWaUrl(url)
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setErrorMsg('Gagal mengirim pendaftaran. Periksa koneksi internet dan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-5 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-lg">TPQ Darussalam</h1>
        </div>
        <p className="text-emerald-200 text-sm">Formulir Pendaftaran Santri</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {success ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pendaftaran Terkirim!</h3>
              <p className="text-gray-500 text-sm mb-4">Data pendaftaran sudah kami terima.</p>
              {waUrl ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
                  <p className="text-amber-800 text-sm font-medium mb-1">WhatsApp tidak terbuka otomatis.</p>
                  <p className="text-amber-700 text-xs mb-3">Klik tombol di bawah untuk konfirmasi ke admin:</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl text-sm font-bold">
                    Buka WhatsApp Konfirmasi
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-6">WhatsApp terbuka untuk konfirmasi dengan admin.</p>
              )}
              <button onClick={() => { setSuccess(false); setStep(1); setWaUrl('') }}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition text-sm">
                Daftar Lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step indicator */}
              <div className="flex border-b border-gray-100">
                {['Data Santri', 'Data Orang Tua', 'Program'].map((label, i) => (
                  <button key={i} type="button" onClick={() => setStep(i + 1)}
                    className={`flex-1 py-4 text-xs font-semibold transition-all ${step === i + 1 ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-400'}`}>
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-1 ${step === i + 1 ? 'bg-emerald-600 text-white' : step > i + 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </span>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap Santri</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="nama" value={formData.nama} onChange={handleChange} required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Nama lengkap santri" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIK Santri <span className="text-gray-400 font-normal">(sesuai KK)</span></label>
                        <input type="text" name="nik" value={formData.nik} onChange={handleChange} inputMode="numeric" maxLength={16}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono tracking-wider"
                          placeholder="16 digit NIK santri" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tempat Lahir</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Kota lahir" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                        <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea name="alamat" value={formData.alamat} onChange={handleChange} required rows={2}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota" />
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStep(2)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition text-sm">
                      Lanjut →
                    </button>
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex gap-2.5">
                        <span className="text-emerald-500 text-lg leading-none">📋</span>
                        <p className="text-xs text-emerald-700">Siapkan Kartu Keluarga (KK) untuk mengisi data berikut dengan benar.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. Kartu Keluarga (KK)</label>
                        <input type="text" name="noKK" value={formData.noKK} onChange={handleChange} inputMode="numeric" maxLength={16}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono tracking-wider"
                          placeholder="16 digit No. KK" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ayah</label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" name="namaAyah" value={formData.namaAyah} onChange={handleChange} required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                              placeholder="Nama lengkap ayah" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NIK Ayah</label>
                          <input type="text" name="nikAyah" value={formData.nikAyah} onChange={handleChange} inputMode="numeric" maxLength={16}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono tracking-wider"
                            placeholder="16 digit NIK Ayah" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">TTL Ayah <span className="text-gray-400 font-normal">(Tempat, Tanggal Lahir)</span></label>
                          <input type="text" name="ttlAyah" value={formData.ttlAyah} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Contoh: Sidoarjo, 01-01-1980" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nama Ibu</label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" name="namaIbu" value={formData.namaIbu} onChange={handleChange} required
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                              placeholder="Nama lengkap ibu" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NIK Ibu</label>
                          <input type="text" name="nikIbu" value={formData.nikIbu} onChange={handleChange} inputMode="numeric" maxLength={16}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono tracking-wider"
                            placeholder="16 digit NIK Ibu" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">TTL Ibu <span className="text-gray-400 font-normal">(Tempat, Tanggal Lahir)</span></label>
                          <input type="text" name="ttlIbu" value={formData.ttlIbu} onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="Contoh: Surabaya, 05-06-1983" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">No. HP Orang Tua</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" name="noHpOrtu" value={formData.noHpOrtu} onChange={handleChange} required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            placeholder="08xx-xxxx-xxxx" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">← Kembali</button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition text-sm">Lanjut →</button>
                    </div>
                  </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Program yang Diminati</label>
                        <div className="space-y-2">
                          {programOptions.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setFormData(f => ({ ...f, program: opt }))}
                              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                                formData.program === opt
                                  ? 'border-emerald-500 bg-emerald-500 text-white font-semibold shadow-md'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                formData.program === opt ? 'border-white bg-white' : 'border-gray-400'
                              }`}>
                                {formData.program === opt && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                              </div>
                              <span className="text-sm">{opt}</span>
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="program" value={formData.program} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pesan <span className="text-gray-400 font-normal">(opsional)</span></label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <textarea name="pesan" value={formData.pesan} onChange={handleChange} rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
                            placeholder="Ada pertanyaan atau hal yang ingin disampaikan?" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button type="submit" disabled={loading || !formData.program}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-60 text-sm">
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <><Send className="w-4 h-4" /> Kirim Pendaftaran</>
                        )}
                      </button>
                      <button type="button" onClick={() => setStep(2)}
                        className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition text-sm">← Kembali</button>
                      {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                          {errorMsg}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          TPQ Darussalam · Jl. Kemantren RT 06 RW 01, Tulangan
        </p>
      </div>
    </div>
  )
}
