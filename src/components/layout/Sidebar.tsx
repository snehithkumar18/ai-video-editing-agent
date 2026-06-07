'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Film, Mic, User, Settings, CreditCard, LogOut, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Film },
  { href: '/voice', label: 'Voice Profiles', icon: Mic },
  { href: '/avatars', label: 'Avatars', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
        setUser({ ...user, ...profile })
      }
    }
    fetchUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="w-64 bg-[#0D0D0D] border-r border-border flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-violet-600 p-2 rounded-lg">
          <Video size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">VIDAGENT</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-violet-600/20 text-violet-400 border-l-2 border-violet-600" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-l-2 border-transparent"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-background border border-border rounded-lg p-4 mb-4">
          <div className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Render Credits</div>
          <div className="text-2xl font-bold text-white">{user?.render_credits || 0}</div>
          <div className="text-xs text-muted-foreground mt-1">Available this month</div>
        </div>
        
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.email?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-violet-400 capitalize">
              {user?.plan || 'Free'} Plan
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )
}
