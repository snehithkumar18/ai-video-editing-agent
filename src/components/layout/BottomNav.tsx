'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Film, Mic, User, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: Film },
  { href: '/voice', label: 'Voices', icon: Mic },
  { href: '/avatars', label: 'Avatars', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E3EB] px-2 py-1.5 flex items-center justify-around safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
