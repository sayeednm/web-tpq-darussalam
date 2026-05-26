'use client'

import { motion } from 'framer-motion'
import { Heart, Copy, Check, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const rekeningList = [
  {
    bank: 'Bank Jatim',
    noRek: '0732021540',
    atasNama: 'TPQ DARUSSALAM KEMANTREN',
    logo: '🏦',
  },
]

export default function Donasi() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKonfirmasi = () => {
    const msg = `Assalamu'alaikum Admin TPQ Darussalam 🙏\n\nSaya ingin mengkonfirmasi donasi yang telah saya transfer ke:\n\n🏦 *Bank Jatim*\n📋 No. Rek: *0732021540*\n👤 A/N: *TPQ DARUSSALAM KEMANTREN*\n\nMohon dikonfirmasi penerimaannya. Jazakumullahu khairan 🤲`
    window.open(`https://wa.me/62895379017798?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="donasi" className="relative py-20 overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-50 rounded-full opacity-80 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-50 rounded-full opacity-80 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full mb-4 text-sm font-medium">
            <Heart size={16} className="fill-current" />
            Sedekah & Donasi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dukung TPQ Darussalam
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Donasi Anda membantu keberlangsungan pendidikan Al-Qur'an bagi generasi penerus. 
            Semoga menjadi amal jariyah yang terus mengalir pahalanya.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {rekeningList.map((rek, i) => (
            <div key={i} className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-emerald-200 mb-4">
              {/* Header kartu */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                    {rek.logo}
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs">Rekening Donasi</p>
                    <p className="font-bold text-lg">{rek.bank}</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="text-red-300 fill-current" />
                </div>
              </div>

              {/* Nomor rekening */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                <p className="text-emerald-200 text-xs mb-1">Nomor Rekening</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-2xl font-bold tracking-widest">{rek.noRek}</p>
                  <button
                    onClick={() => handleCopy(rek.noRek)}
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-xs font-medium transition flex-shrink-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              </div>

              {/* Atas nama */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-emerald-200 text-xs mb-1">Atas Nama</p>
                <p className="font-semibold">{rek.atasNama}</p>
              </div>
            </div>
          ))}

          {/* Tombol konfirmasi WA */}
          <button
            onClick={handleKonfirmasi}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-200 transition hover:scale-[1.02] active:scale-95"
          >
            <MessageCircle size={22} />
            Konfirmasi Donasi via WhatsApp
          </button>

          <p className="text-center text-gray-400 text-xs mt-4">
            Setelah transfer, klik tombol di atas untuk konfirmasi ke admin agar donasi tercatat. Jazakumullahu khairan 🤲
          </p>
        </motion.div>
      </div>
    </section>
  )
}
