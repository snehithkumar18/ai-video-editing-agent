import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import GenerationProgress from '@/components/project/GenerationProgress';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Play, Download, Edit2, Film, Mic, FileText } from 'lucide-react';
import StartGenerationButton from '@/components/project/StartGenerationButton';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_assets (*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  if (project.status === 'generating') {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-[#1E1B4B]">Generating "{project.title}"</h2>
        <GenerationProgress projectId={project.id} initialProgress={project.render_progress || 0} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E1B4B]">{project.title}</h2>
          <p className="text-[#78767B] mt-1 capitalize text-sm font-medium">
            {project.platform.replace('_', ' ')} • {project.style_template.replace('_', ' ')}
          </p>
        </div>
        
        <div className="flex gap-3">
          {project.status === 'draft' && (
            <Button className="btn-gradient text-white gap-2 rounded-xl h-10 px-5 font-semibold text-sm" asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Edit2 size={16} /> Open Editor
              </Link>
            </Button>
          )}
          
          {(project.status === 'editing' || project.status === 'complete') && (
            <>
              <Button variant="outline" className="border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC] gap-2 rounded-xl h-10 px-5 font-semibold text-sm" asChild>
                <Link href={`/projects/${project.id}/edit`}>
                  <Edit2 size={16} /> Edit Timeline
                </Link>
              </Button>
              <Button className="btn-gradient text-white gap-2 rounded-xl h-10 px-5 font-semibold text-sm">
                <Download size={16} /> Export Video
              </Button>
            </>
          )}
        </div>
      </div>

      {(project.status === 'editing' || project.status === 'complete') && project.final_video_url && (
        <Card className="bg-white border-[#E5E3EB] rounded-3xl overflow-hidden shadow-sm">
          <div className="aspect-video bg-black relative flex items-center justify-center">
            <video 
              src={project.final_video_url} 
              controls 
              className="w-full h-full max-h-[60vh] object-contain"
              poster={project.thumbnail_url || undefined}
            />
          </div>
        </Card>
      )}

      {project.status === 'draft' && (
        <StartGenerationButton projectId={project.id} />
      )}

      {(project.status === 'editing' || project.status === 'complete') && (
        <div>
          <h3 className="text-lg font-bold text-[#1E1B4B] mb-4">Generated Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.project_assets?.map((asset: any) => (
              <Card key={asset.id} className="bg-white border-[#E5E3EB] rounded-2xl shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                  <div className="p-2 bg-[#F8F7FC] border border-[#E5E3EB] rounded-lg">
                    {asset.type === 'avatar_video' && <User className="text-blue-500" size={20} />}
                    {asset.type === 'voice_audio' && <Mic className="text-violet-500" size={20} />}
                    {asset.type === 'broll_clip' && <Film className="text-emerald-500" size={20} />}
                    {asset.type === 'caption_json' && <FileText className="text-amber-500" size={20} />}
                    {asset.type === 'final_video' && <Play className="text-fuchsia-500" size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-bold text-[#1E1B4B] capitalize truncate">
                      {asset.type.replace('_', ' ')}
                    </CardTitle>
                    <p className="text-xs text-[#78767B] font-medium truncate">
                      {asset.url.split('/').pop()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#EDE9FE]/50 text-[#7C3AED]" asChild>
                    <a href={asset.url} target="_blank" rel="noopener noreferrer">
                      <Download size={14} />
                    </a>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function User(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
