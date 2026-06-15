'use client'

import BottomNav from '@/components/layout/BottomNav'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-full bg-[#F8F7FC] overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5 pb-24 custom-scrollbar">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}
