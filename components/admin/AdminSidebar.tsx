'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Star,
  Wallet,
  LogOut,
  Menu,
  X,
  ClipboardCheck,
  Images,
  Printer,
} from 'lucide-react'

const menus = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pendaftaran', label: 'Pendaftaran', icon: ClipboardCheck },
  { href: '/admin/santri', label: 'Data Santri', icon: Users },
  { href: '/admin/guru', label: 'Data Guru', icon: GraduationCap },
  { href: '/admin/kelas', label: 'Kelas', icon: BookOpen },
  { href: '/admin/absensi', label: 'Absensi', icon: ClipboardList },
  { href: '/admin/penilaian', label: 'Penilaian', icon: Star },
  { href: '/admin/pembayaran', label: 'SPP / Keuangan', icon: Wallet },
  { href: '/admin/media', label: 'Media & Logo', icon: Images },
  { href: '/admin/cetak', label: 'Cetak / Print', icon: Printer },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/20 p-0.5">
            <img src="/logo-tpq.png" alt="Logo TPQ" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-tight">TPQ Darussalam</h1>
            <p className="text-emerald-300 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menus.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white text-emerald-700 shadow-lg shadow-emerald-900/20'
                  : 'text-emerald-100 hover:bg-emerald-700/60 hover:text-white'
              }`}
            >
              <Icon size={18} className={active ? 'text-emerald-600' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-100 hover:bg-red-500/20 hover:text-red-300 w-full transition-all duration-200"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 flex-col shadow-2xl z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/20 p-0.5">
            <img src="/logo-tpq.png" alt="Logo TPQ" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-white text-sm">TPQ Darussalam</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-emerald-800 to-emerald-900 z-50 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-emerald-700/50">
          <span className="font-bold text-white">Menu</span>
          <button onClick={() => setOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </div>
    </>
  )
}
