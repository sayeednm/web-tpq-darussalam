'use client'

import { motion } from 'framer-motion'
import { Baby, BookOpen, GraduationCap, Clock } from 'lucide-react'

const programs = [
  {
    icon: Baby,
    title: 'Kelas Pra-TK',
    age: 'Usia 4-5 Tahun',
    description: 'Pengenalan huruf hijaiyah dengan metode bermain yang menyenangkan dan sesuai perkembangan anak.',
    features: ['Pengenalan huruf hijaiyah', 'Metode bermain sambil belajar', 'Durasi 60 menit'],
  },
  {
    icon: BookOpen,
    title: 'Kelas Dasar',
    age: 'Usia 6-12 Tahun',
    description: 'Pembelajaran Al-Qur&apos;an dari dasar hingga lancar dengan Metode Ummi yang terstruktur.',
    features: ['Belajar tajwid & tartil', 'Jilid 1-6 Metode Ummi', 'Durasi 90 menit'],
  },
  {
    icon: GraduationCap,
    title: 'Kelas Dewasa/Tahsin',
    age: 'Remaja & Dewasa',
    description: 'Program tahsin untuk memperbaiki bacaan Al-Qur&apos;an bagi remaja dan dewasa.',
    features: ['Perbaikan tajwid', 'Tartil & makhorijul huruf', 'Jadwal fleksibel'],
  },
]

export default function Program() {
  return (
    <section id="program" className="relative py-20 overflow-hidden">
      {/* Background dengan geometric pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/50 to-emerald-50/50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

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
