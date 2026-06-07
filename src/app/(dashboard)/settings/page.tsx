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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and integrations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-4 bg-[#0D0D0D] border border-border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="danger" className="text-red-400 data-[state=active]:text-red-500">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-[#0D0D0D] border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name and email preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-w-[400px]">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={userData?.full_name || ''} className="bg-black" />
              </div>
              <div className="space-y-2 max-w-[400px]">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email || ''} readOnly className="bg-black opacity-50 cursor-not-allowed" />
                <p className="text-xs text-gray-500 mt-1">To change your email, please contact support.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-[#0D0D0D] border-border">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what alerts we send to your inbox.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Video Generation Complete</Label>
                  <p className="text-sm text-gray-500">Receive an email when your video finishes rendering.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Credits Warning</Label>
                  <p className="text-sm text-gray-500">Get notified when you have 2 or fewer render credits left.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Updates</Label>
                  <p className="text-sm text-gray-500">News about new AI models, features, and fixes.</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <Card className="bg-[#0D0D0D] border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><KeyRound size={20}/> API Access</CardTitle>
              <CardDescription>Generate videos programmatically via the VidAgent REST API.</CardDescription>
            </CardHeader>
            <CardContent>
              {isProOrAgency ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Secret API Key</Label>
                    <div className="flex gap-3">
                      <Input value="va_live_***********************************" readOnly className="bg-black font-mono text-gray-400" />
                      <Button variant="outline">Copy</Button>
                    </div>
                    <p className="text-xs text-yellow-500 mt-2">Never share this key. It grants full access to your account and credits.</p>
                  </div>
                  <Button variant="secondary" className="mt-4">Regenerate Key</Button>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg bg-black/50">
                  <KeyRound size={32} className="text-gray-600 mb-4" />
                  <h3 className="font-medium text-white mb-2">API Access requires Pro Plan</h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-[300px]">Upgrade to Pro or Agency to unlock programmatic generation and webhooks.</p>
                  <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                    <a href="/billing">View Plans</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <Card className="bg-red-950/10 border-red-900/30">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2"><ShieldAlert size={20}/> Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">
                Deleting your account will immediately remove all your data, voice profiles, avatar models, and rendered videos. 
                This action cannot be undone. Any active subscriptions will be cancelled.
              </p>
              <Button variant="destructive">Delete Account Permanently</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
