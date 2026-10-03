import { createClient } from '@/lib/supabase/server';
import VoiceGrid from '@/components/voice/VoiceGrid';
import VoiceStudioStatusBanner from '@/components/voice/VoiceStudioStatusBanner';

export default async function VoicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profiles } = await supabase
    .from('voice_profiles')
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
    starter: 3,
    pro: 10,
    agency: 50
  };
  const maxVoices = planLimits[userPlan];
  const currentCount = profiles?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E1B4B]">Voice Profiles</h2>
          <p className="text-[#78767B] mt-1 text-sm font-medium">Upload your voice once, reuse in every video forever</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#78767B] bg-white px-3 py-1.5 rounded-xl border border-[#E5E3EB] shadow-sm">
            <span className="text-[#1E1B4B] font-bold">{currentCount}</span> of {maxVoices} voices used
          </div>
        </div>
      </div>
      
      {/* VoiceStudio Live Engine Status & Quick Clone Tester */}
      <VoiceStudioStatusBanner profiles={profiles || []} />

      <VoiceGrid initialProfiles={profiles || []} />
    </div>
  );
}
