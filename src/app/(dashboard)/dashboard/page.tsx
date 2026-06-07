import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Video, Mic, User, Film } from 'lucide-react'
import ProjectCard from '@/components/dashboard/ProjectCard'
import Link from 'next/link'
// import CreateProjectModal from '@/components/dashboard/CreateProjectModal' // We will implement this next

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
    .limit(6)

  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: voicesCount } = await supabase
    .from('voice_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: avatarsCount } = await supabase
    .from('avatar_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0D0D0D] border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#0D0D0D] border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Render Credits</CardTitle>
            <Video className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-500">{userData?.render_credits || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Voice Profiles</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{voicesCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0D0D0D] border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avatars</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avatarsCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="flex gap-4">
        <Button className="h-32 flex-1 text-lg gap-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
          <Plus size={24} />
          Create New Video
        </Button>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0D0D0D] border-border hover:border-violet-500/50 transition-colors cursor-pointer">
            <Link href="/voice" className="flex items-center gap-4 p-6">
              <div className="bg-violet-600/20 p-3 rounded-full text-violet-400">
                <Mic size={24} />
              </div>
              <div>
                <h3 className="font-medium">Upload Voice</h3>
                <p className="text-sm text-muted-foreground">Clone your voice for AI</p>
              </div>
            </Link>
          </Card>
          
          <Card className="bg-[#0D0D0D] border-border hover:border-violet-500/50 transition-colors cursor-pointer">
            <Link href="/avatars" className="flex items-center gap-4 p-6">
              <div className="bg-violet-600/20 p-3 rounded-full text-violet-400">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-medium">Upload Avatar</h3>
                <p className="text-sm text-muted-foreground">Create your AI presenter</p>
              </div>
            </Link>
          </Card>
          
          <Card className="bg-[#0D0D0D] border-border hover:border-violet-500/50 transition-colors cursor-pointer">
            <Link href="/projects/templates" className="flex items-center gap-4 p-6">
              <div className="bg-violet-600/20 p-3 rounded-full text-violet-400">
                <Film size={24} />
              </div>
              <div>
                <h3 className="font-medium">View Templates</h3>
                <p className="text-sm text-muted-foreground">Browse video styles</p>
              </div>
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          <Link href="/projects" className="text-sm text-violet-400 hover:text-violet-300">
            View all
          </Link>
        </div>
        
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="bg-[#0D0D0D] border-border border-dashed p-12 text-center flex flex-col items-center justify-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Film size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first AI video to get started.</p>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Plus size={18} />
              Create Project
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
