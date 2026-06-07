import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';

export default async function EditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select(`*, project_assets (*)`)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  // If no timeline exists or project is still drafting, they shouldn't be here yet
  if (!project.timeline_json && project.status !== 'generating') {
    redirect(`/projects/${project.id}`);
  }

  return <EditorLayout project={project} />;
}
