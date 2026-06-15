'use client'

import { Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePathname } from 'next/navigation'

const formatTitle = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return 'Dashboard'
  const lastPart = parts[parts.length - 1]
  if (lastPart === 'dashboard') return 'Dashboard'
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
}

export default function Header() {
  const pathname = usePathname()
  const title = formatTitle(pathname)

  return (
    <header className="h-14 border-b border-[#E5E3EB] bg-white flex items-center justify-between px-6 z-10">
      <h1 className="text-lg font-semibold text-[#1E1B4B]">{title}</h1>
      
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-xl text-[#78767B] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] transition-colors">
          <Bell size={20} />
        </button>
        
        <button className="h-8 px-4 rounded-xl btn-gradient text-white text-sm font-semibold flex items-center gap-1.5">
          <Plus size={16} />
          Create Project
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative h-8 w-8 rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE9FE] border border-[#E5E3EB]">
                <span className="text-sm font-semibold text-[#7C3AED]">U</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border-[#E5E3EB] rounded-xl" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-[#1E1B4B]">User</p>
                <p className="text-xs leading-none text-[#78767B]">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5E3EB]" />
            <DropdownMenuItem className="text-[#1E1B4B]">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-[#1E1B4B]">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E5E3EB]" />
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
