import { createClient } from '@/lib/supabase/server'
import ProjectCard from '@/components/dashboard/ProjectCard'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal'
import { Film } from 'lucide-react'

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
        <h2 className="text-2xl font-bold tracking-tight text-[#1E1B4B]">All Projects</h2>
        <CreateProjectModal 
          trigger={
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm">
              New Project
            </button>
          }
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects?.length ? (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#E5E3EB] rounded-3xl text-center bg-white py-20">
            <div className="w-14 h-14 bg-[#EDE9FE] rounded-2xl flex items-center justify-center mb-4">
              <Film className="text-[#7C3AED]" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1B4B] mb-1">No projects found</h3>
            <p className="text-sm text-[#78767B] max-w-sm mb-6">Start creating your first AI video to see it list here.</p>
            <CreateProjectModal 
              trigger={
                <button className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                  Create First Project
                </button>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
