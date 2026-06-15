import { createClient } from '@/lib/supabase/server'
import { Plus, Video, Mic, User, Film, LayoutGrid, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import ProjectListItem from '@/components/dashboard/ProjectListItem'
import Link from 'next/link'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: voicesCount } = await supabase
    .from('voice_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const displayName = userData?.full_name || user.email?.split('@')[0] || 'Creator'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1E1B4B]">Welcome, {displayName}</h1>
          <p className="text-sm text-[#78767B] mt-0.5">Ready to generate your next viral hit?</p>
        </div>
        <div className="credits-badge">
          {userData?.render_credits || 0} Credits
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-[#78767B] uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/projects" className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-[#E5E3EB] card-hover">
            <div className="w-11 h-11 bg-[#EDE9FE] rounded-xl flex items-center justify-center">
              <Video size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-sm font-medium text-[#1E1B4B]">Generate Video</span>
          </Link>

          <Link href="/voice" className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-[#E5E3EB] card-hover">
            <div className="w-11 h-11 bg-[#EDE9FE] rounded-xl flex items-center justify-center">
              <Mic size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-sm font-medium text-[#1E1B4B]">Clone Voice</span>
          </Link>

          <Link href="/avatars" className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-[#E5E3EB] card-hover">
            <div className="w-11 h-11 bg-[#EDE9FE] rounded-xl flex items-center justify-center">
              <User size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-sm font-medium text-[#1E1B4B]">Upload Avatar</span>
          </Link>

          <Link href="/projects/templates" className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-[#E5E3EB] card-hover">
            <div className="w-11 h-11 bg-[#EDE9FE] rounded-xl flex items-center justify-center">
              <LayoutGrid size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-sm font-medium text-[#1E1B4B]">Templates</span>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#E5E3EB]">
          <p className="text-xs font-medium text-[#78767B] mb-1">Total Projects</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[#1E1B4B]">{projectsCount || 0}</span>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-0.5 mb-1">
              <ArrowUpRight size={12} />+12%
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E3EB]">
          <p className="text-xs font-medium text-[#78767B] mb-1">Active Voices</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-[#7C3AED]">{String(voicesCount || 0).padStart(2, '0')}</span>
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-0.5 mb-1">
              <ArrowUpRight size={12} />+2
            </span>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#78767B] uppercase tracking-wider">Recent Projects</h2>
          <Link href="/projects" className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
            See all
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-[#E5E3EB] p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mb-4">
              <Film size={24} className="text-[#7C3AED]" />
            </div>
            <h3 className="text-base font-semibold text-[#1E1B4B] mb-1">No projects yet</h3>
            <p className="text-sm text-[#78767B] mb-5">Create your first AI video to get started.</p>
            <CreateProjectModal 
              trigger={
                <button className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold flex items-center gap-2">
                  <Plus size={16} />
                  Create Project
                </button>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
