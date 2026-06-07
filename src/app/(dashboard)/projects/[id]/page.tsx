import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import GenerationProgress from '@/components/project/GenerationProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Play, Download, Edit2, Film, Mic, FileText } from 'lucide-react';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_assets (*)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  if (project.status === 'generating') {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Generating "{project.title}"</h2>
        <GenerationProgress projectId={project.id} initialProgress={project.render_progress || 0} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{project.title}</h2>
          <p className="text-muted-foreground mt-1 capitalize">{project.platform.replace('_', ' ')} • {project.style_template.replace('_', ' ')}</p>
        </div>
        
        <div className="flex gap-3">
          {project.status === 'draft' && (
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2" asChild>
              <Link href={`/projects/${project.id}/edit`}>
                <Edit2 size={16} /> Open Editor
              </Link>
            </Button>
          )}
          
          {(project.status === 'editing' || project.status === 'complete') && (
            <>
              <Button variant="outline" className="border-border gap-2" asChild>
                <Link href={`/projects/${project.id}/edit`}>
                  <Edit2 size={16} /> Edit Timeline
                </Link>
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
                <Download size={16} /> Export Video
              </Button>
            </>
          )}
        </div>
      </div>

      {(project.status === 'editing' || project.status === 'complete') && project.final_video_url && (
        <Card className="bg-[#0D0D0D] border-border overflow-hidden">
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
        <Card className="bg-[#0D0D0D] border-border py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-full flex items-center justify-center mb-4">
              <Play size={32} className="ml-1" />
            </div>
            <h3 className="text-xl font-medium mb-2">Ready to generate?</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Your script is ready. Once you generate the video, you can edit the timeline, adjust captions, and swap B-roll before final export.
            </p>
            {/* The actual generate call is typically done from the editor or a client button here */}
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" size="lg">
              Start Generation
            </Button>
          </div>
        </Card>
      )}

      {(project.status === 'editing' || project.status === 'complete') && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Generated Assets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.project_assets?.map((asset: any) => (
              <Card key={asset.id} className="bg-[#0D0D0D] border-border">
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                  <div className="p-2 bg-white/5 rounded-md">
                    {asset.type === 'avatar_video' && <User className="text-blue-400" size={20} />}
                    {asset.type === 'voice_audio' && <Mic className="text-violet-400" size={20} />}
                    {asset.type === 'broll_clip' && <Film className="text-green-400" size={20} />}
                    {asset.type === 'caption_json' && <FileText className="text-yellow-400" size={20} />}
                    {asset.type === 'final_video' && <Play className="text-fuchsia-400" size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm capitalize truncate">
                      {asset.type.replace('_', ' ')}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate">
                      {asset.url.split('/').pop()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
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

// Simple fallback icon if lucide-react User isn't imported correctly above
function User(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
