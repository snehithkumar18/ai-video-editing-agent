import { createClient } from '@/lib/supabase/server'
import ProjectCard from '@/components/dashboard/ProjectCard'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md font-medium text-sm">
          New Project
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects?.length ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg text-center bg-[#0D0D0D]">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">Start creating your first AI video.</p>
          </div>
        )}
      </div>
    </div>
  )
}
