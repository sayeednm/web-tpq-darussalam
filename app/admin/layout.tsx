'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') return null

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen min-w-0 overflow-x-hidden">
        <div className="h-16 lg:h-0" />
        <div className="p-4 lg:p-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  )
}
