import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { KeyRound, ShieldAlert } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const isProOrAgency = userData?.plan === 'pro' || userData?.plan === 'agency';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1E1B4B]">Settings</h1>
        <p className="text-[#78767B]">Manage your account preferences and integrations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full flex flex-col">
        <TabsList className="grid w-full max-w-[400px] grid-cols-4 bg-[#F8F7FC] border border-[#E5E3EB] p-1 rounded-xl h-11">
          <TabsTrigger value="profile" className="rounded-lg text-xs font-semibold text-[#78767B] data-[state=active]:bg-white data-[state=active]:text-[#7C3AED] data-[state=active]:shadow-sm">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-xs font-semibold text-[#78767B] data-[state=active]:bg-white data-[state=active]:text-[#7C3AED] data-[state=active]:shadow-sm">Alerts</TabsTrigger>
          <TabsTrigger value="api" className="rounded-lg text-xs font-semibold text-[#78767B] data-[state=active]:bg-white data-[state=active]:text-[#7C3AED] data-[state=active]:shadow-sm">API Keys</TabsTrigger>
          <TabsTrigger value="danger" className="rounded-lg text-xs font-semibold text-red-500 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-white border-[#E5E3EB] rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-[#1E1B4B]">Personal Information</CardTitle>
              <CardDescription className="text-sm text-[#78767B]">Update your display name and email preferences.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-5">
              <div className="space-y-2 max-w-[400px]">
                <Label htmlFor="name" className="text-sm font-semibold text-[#1E1B4B]">Full Name</Label>
                <Input id="name" defaultValue={userData?.full_name || ''} className="bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-[#7C3AED]" />
              </div>
              <div className="space-y-2 max-w-[400px]">
                <Label htmlFor="email" className="text-sm font-semibold text-[#1E1B4B]">Email Address</Label>
                <Input id="email" value={user.email || ''} readOnly className="bg-[#F8F7FC] border-[#E5E3EB] text-[#1E1B4B] opacity-70 cursor-not-allowed rounded-xl h-11" />
                <p className="text-xs text-[#78767B] mt-1">To change your email, please contact support.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#E5E3EB] bg-[#F8F7FC]/50 p-6 flex justify-end">
              <Button className="btn-gradient text-white rounded-xl h-11 px-5 font-semibold text-sm">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-white border-[#E5E3EB] rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-[#1E1B4B]">Email Notifications</CardTitle>
              <CardDescription className="text-sm text-[#78767B]">Choose what alerts we send to your inbox.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold text-[#1E1B4B]">Video Generation Complete</Label>
                  <p className="text-xs text-[#78767B]">Receive an email when your video finishes rendering.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-[#E5E3EB]/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold text-[#1E1B4B]">Low Credits Warning</Label>
                  <p className="text-xs text-[#78767B]">Get notified when you have 2 or fewer render credits left.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-[#E5E3EB]/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold text-[#1E1B4B]">Product Updates</Label>
                  <p className="text-xs text-[#78767B]">News about new AI models, features, and fixes.</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="bg-white border-[#E5E3EB] rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-[#1E1B4B] flex items-center gap-2"><KeyRound size={20} className="text-[#7C3AED]"/> API Access</CardTitle>
              <CardDescription className="text-sm text-[#78767B]">Generate videos programmatically via the VidAgent REST API.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isProOrAgency ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#1E1B4B]">Secret API Key</Label>
                    <div className="flex gap-3">
                      <Input value="va_live_***********************************" readOnly className="bg-[#F8F7FC] border-[#E5E3EB] text-[#1E1B4B] font-mono rounded-xl h-11" />
                      <Button variant="outline" className="border-[#E5E3EB] text-[#1E1B4B] rounded-xl hover:bg-[#F8F7FC] h-11 px-4">Copy</Button>
                    </div>
                    <p className="text-xs text-amber-600 mt-2 font-medium">Never share this key. It grants full access to your account and credits.</p>
                  </div>
                  <Button variant="secondary" className="bg-[#F8F7FC] hover:bg-[#EDE9FE]/50 text-[#7C3AED] border border-[#E5E3EB] rounded-xl h-11 px-5 font-semibold mt-4">Regenerate Key</Button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center border border-dashed border-[#E5E3EB] rounded-2xl bg-[#F8F7FC]/50 p-6">
                  <div className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-4">
                    <KeyRound size={22} />
                  </div>
                  <h3 className="font-bold text-[#1E1B4B] mb-1">API Access Requires Pro Plan</h3>
                  <p className="text-sm text-[#78767B] mb-6 max-w-[320px]">Upgrade to Pro or Agency to unlock programmatic video generation and webhooks.</p>
                  <Button asChild className="btn-gradient text-white rounded-xl h-11 px-6 font-semibold flex items-center justify-center text-sm">
                    <a href="/billing">View Plans</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="bg-red-50/50 border border-red-200 rounded-3xl shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-red-600 flex items-center gap-2 font-bold"><ShieldAlert size={20}/> Danger Zone</CardTitle>
              <CardDescription className="text-red-500/80 font-medium">Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-sm text-red-700/80 mb-6 max-w-2xl leading-relaxed">
                Deleting your account will immediately remove all your data, voice profiles, avatar models, and rendered videos. 
                This action cannot be undone. Any active subscriptions will be cancelled.
              </p>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-5 font-semibold">Delete Account Permanently</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
