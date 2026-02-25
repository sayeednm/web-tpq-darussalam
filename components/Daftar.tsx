'use client'

import { motion } from 'framer-motion'
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { useState, FormEvent } from 'react'

export default function Daftar() {
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    email: '',
    telepon: '',
    program: '',
    pesan: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Format pesan WhatsApp
    const message = `*PENDAFTARAN SANTRI BARU*
*TPQ Darussalam*

*Nama Lengkap:* ${formData.nama}
*Usia:* ${formData.usia} tahun
*Email Orang Tua:* ${formData.email}
*No. Telepon:* ${formData.telepon}
*Program:* ${formData.program}
${formData.pesan ? `*Pesan:* ${formData.pesan}` : ''}

_Terima kasih telah mendaftar di TPQ Darussalam!_`

    // Nomor WhatsApp TPQ (ganti dengan nomor WhatsApp TPQ Anda)
    const phoneNumber = '6289528036024' // Format: 62 + nomor tanpa 0 di depan
    
    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message)
    
    // Buka WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappURL, '_blank')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="daftar" className="relative py-20 overflow-hidden">
      {/* Background dengan gradient dan pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Daftar Sekarang
          </h2>
          <p className="text-lg text-gray-600">
            Bergabunglah bersama kami dan mulai perjalanan menghafal Al-Qur&apos;an dengan Metode Ummi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Nama santri"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="usia" className="block text-sm font-medium text-gray-700 mb-2">
                  Usia
                </label>
                <input
                  type="number"
                  id="usia"
                  name="usia"
                  value={formData.usia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Usia santri"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Orang Tua
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="telepon"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="+62 812-3456-7890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                Program yang Diminati
              </label>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="">Pilih Program</option>
                <option value="Kelas Pra-TK (4-5 Tahun)">Kelas Pra-TK (4-5 Tahun)</option>
                <option value="Kelas Dasar (6-12 Tahun)">Kelas Dasar (6-12 Tahun)</option>
                <option value="Kelas Dewasa/Tahsin">Kelas Dewasa/Tahsin</option>
              </select>
            </div>

            <div>
              <label htmlFor="pesan" className="block text-sm font-medium text-gray-700 mb-2">
                Pesan (Opsional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="pesan"
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                  placeholder="Pesan atau pertanyaan..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all font-bold flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <span>Kirim via WhatsApp</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
