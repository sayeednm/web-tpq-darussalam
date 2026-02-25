'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, BookMarked, Music, Smile } from 'lucide-react'

const metodePrinsip = [
  {
    icon: BookMarked,
    title: 'Tartil & Tajwid',
    description: 'Membaca Al-Qur&apos;an dengan benar sesuai kaidah tajwid dan tartil yang sempurna.',
  },
  {
    icon: Music,
    title: 'Mudah & Terstruktur',
    description: 'Pembelajaran bertahap dari dasar hingga mahir dengan sistem yang jelas dan teruji.',
  },
  {
    icon: Smile,
    title: 'Menyenangkan',
    description: 'Metode yang fun dan engaging membuat anak-anak semangat belajar Al-Qur&apos;an.',
  },
]

export default function MetodeUmmi() {
  return (
    <section id="metode-ummi" className="relative py-20 overflow-hidden">
      {/* Background dengan Islamic pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 font-medium">
              Metode Pembelajaran
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Mengapa Metode Ummi?
            </h2>
            <p className="text-lg text-emerald-50 mb-8 leading-relaxed drop-shadow">
              Metode Ummi adalah sistem pembelajaran Al-Qur&apos;an yang telah terbukti efektif 
              dan digunakan oleh ribuan lembaga di Indonesia. Dengan pendekatan yang sistematis 
              dan menyenangkan, santri dapat membaca Al-Qur&apos;an dengan tartil dalam waktu relatif singkat.
            </p>

            <div className="space-y-4">
              {['Sistem pembelajaran terstruktur dan berjenjang', 
                'Guru bersertifikat resmi Ummi Foundation',
                'Evaluasi berkala untuk memastikan kualitas',
                'Materi pembelajaran yang mudah dipahami'].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl"
                >
                  <CheckCircle2 className="w-6 h-6 text-amber-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {metodePrinsip.map((prinsip, index) => (
              <motion.div
                key={prinsip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    <prinsip.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{prinsip.title}</h3>
                    <p 
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: prinsip.description }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
