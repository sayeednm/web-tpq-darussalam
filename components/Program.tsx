'use client'

import { motion } from 'framer-motion'
import { Baby, BookOpen, GraduationCap, Clock } from 'lucide-react'

const programs = [
  {
    icon: Baby,
    title: 'Pra Jilid',
    age: 'Usia 4-5 Tahun',
    description: 'Pengenalan huruf hijaiyah dan pembiasaan duduk belajar dengan metode bermain yang menyenangkan sesuai perkembangan anak.',
    features: ['Pengenalan huruf hijaiyah', 'Metode bermain sambil belajar', 'Durasi 60 menit'],
  },
  {
    icon: BookOpen,
    title: 'Jilid 1 – 6',
    age: 'Usia 5-12 Tahun',
    description: 'Pembelajaran membaca Al-Qur\'an secara bertahap dari Jilid 1 hingga Jilid 6 menggunakan Metode Ummi yang terstruktur dan teruji.',
    features: ['Jilid 1 s/d Jilid 6 Metode Ummi', 'Belajar makhraj & pelafalan', 'Durasi 90 menit'],
  },
  {
    icon: GraduationCap,
    title: 'Gharib, Tajwid & Al-Quran',
    age: 'Semua Usia',
    description: 'Program lanjutan setelah Jilid 6: memahami bacaan gharib, memperdalam ilmu tajwid, dan membaca Al-Qur\'an dengan tartil sempurna.',
    features: ['Ghoroibul Qur\'an & Musykilat', 'Tajwid dasar & lanjutan', 'Tartil Al-Qur\'an 30 Juz'],
  },
]

export default function Program() {
  return (
    <section id="program" className="relative py-20 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-50 rounded-full opacity-80 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full opacity-80 blur-3xl -translate-x-1/3 translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Program Pembelajaran
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai program yang disesuaikan dengan usia dan kebutuhan santri
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all hover:-translate-y-2"
            >
              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/20 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <program.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                  <p className="text-emerald-100">{program.age}</p>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-white to-emerald-50/30">
                <p 
                  className="text-gray-600 mb-6 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />
                
                <div className="space-y-3">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                      <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-8 flex items-start space-x-4 shadow-xl"
        >
          <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2 text-lg">Jadwal Pembelajaran</h4>
            <p className="text-gray-700 font-medium">
              Senin - Jumat: 15.30 - 17.30 WIB | Sabtu: 08.00 - 10.00 WIB
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
