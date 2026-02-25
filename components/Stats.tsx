'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Award, Heart } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: '500+',
    label: 'Santri Aktif',
    color: 'emerald',
  },
  {
    icon: BookOpen,
    number: '10+',
    label: 'Tahun Pengalaman',
    color: 'amber',
  },
  {
    icon: Award,
    number: '15+',
    label: 'Guru Bersertifikat',
    color: 'emerald',
  },
  {
    icon: Heart,
    number: '98%',
    label: 'Kepuasan Orang Tua',
    color: 'amber',
  },
]

export default function Stats() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all hover:scale-105 transform shadow-xl">
                <div className={`w-16 h-16 mx-auto mb-4 bg-${stat.color === 'amber' ? 'amber-400' : 'white'}/20 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color === 'amber' ? 'text-amber-300' : 'text-white'}`} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-emerald-100 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
