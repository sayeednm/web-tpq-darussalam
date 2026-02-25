import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TPQ Darussalam - Metode Ummi',
  description: 'Taman Pendidikan Al-Qur&apos;an Darussalam dengan Metode Ummi yang efektif dan menyenangkan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
