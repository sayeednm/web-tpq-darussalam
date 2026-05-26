'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Copy, Check, MessageCircle, ChevronDown } from 'lucide-react'
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
  const [open, setOpen] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKonfirmasi = () => {
    const msg = `Assalamu'alaikum Admin TPQ Darussalam 🙏\n\nSaya ingin mengkonfirmasi infaq/sedekah yang telah saya transfer ke:\n\n🏦 *Bank Jatim*\n📋 No. Rek: *0732021540*\n👤 A/N: *TPQ DARUSSALAM KEMANTREN*\n\nMohon dikonfirmasi penerimaannya. Jazakumullahu khairan 🤲`
    window.open(`https://wa.me/62895379017798?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section id="donasi" className="relative py-10 overflow-hidden bg-white">
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 text-sm font-medium transition-colors group"
          >
            <Heart size={14} className={`transition-colors ${open ? 'text-emerald-500 fill-emerald-500' : 'group-hover:text-emerald-500'}`} />
            Infaq & Sedekah
            <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Titip Amal Jariyah</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                    Bagi yang ingin berpartisipasi dalam pengembangan pendidikan Al-Qur'an,
                    kami membuka saluran infaq dan sedekah.
                  </p>
                </div>

                {rekeningList.map((rek, i) => (
                  <div key={i} className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-100 mb-4">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                          {rek.logo}
                        </div>
                        <div>
                          <p className="text-emerald-200 text-xs">Rekening Infaq & Sedekah</p>
                          <p className="font-bold text-lg">{rek.bank}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Heart size={20} className="text-red-300 fill-current" />
                      </div>
                    </div>

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

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <p className="text-emerald-200 text-xs mb-1">Atas Nama</p>
                      <p className="font-semibold">{rek.atasNama}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleKonfirmasi}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-100 transition hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle size={22} />
                  Konfirmasi Transfer via WhatsApp
                </button>

                <p className="text-center text-gray-400 text-xs mt-4 pb-2">
                  Setelah transfer, klik tombol di atas agar admin dapat mencatat dan mendoakan. Jazakumullahu khairan 🤲
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
