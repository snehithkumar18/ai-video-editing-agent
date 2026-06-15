import { createClient } from '@/lib/supabase/server';
import AvatarGrid from '@/components/avatar/AvatarGrid';

export default async function AvatarsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profiles } = await supabase
    .from('avatar_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  const { data: userData } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single();

  const userPlan = userData?.plan || 'free';
  const planLimits: Record<string, number> = {
    free: 1,
    starter: 2,
    pro: 5,
    agency: 20
  };
  const maxAvatars = planLimits[userPlan];
  const currentCount = profiles?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Avatar Profiles</h2>
          <p className="text-muted-foreground mt-1">Upload your face once, animate it in every video</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#78767B] bg-[#F8F7FC] px-3.5 py-2 rounded-xl border border-[#E5E3EB] font-medium">
            <span className="text-[#1E1B4B] font-semibold">{currentCount}</span> of {maxAvatars} avatars used
          </div>
        </div>
      </div>
      
      <AvatarGrid initialProfiles={profiles || []} />
    </div>
  );
}
