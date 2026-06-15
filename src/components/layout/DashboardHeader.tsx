'use client'

import { Video, Bell } from 'lucide-react'
import Link from 'next/link'

export default function DashboardHeader() {
  return (
    <header className="h-14 bg-white border-b border-[#E5E3EB] flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#1E1B4B] rounded-lg flex items-center justify-center">
          <Video size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-[#1E1B4B] tracking-tight">VidAgent AI</span>
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-[#78767B] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] transition-colors relative">
          <Bell size={20} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7C3AED] rounded-full" />
        </button>
      </div>
    </header>
  )
}
