import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Film, Mic, Upload, Video } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white overflow-hidden selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-2">
          <div className="bg-[var(--color-accent)] p-2 rounded-lg">
            <Video size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">VIDAGENT</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-violet-400 transition-colors">
            Log in
          </Link>
          <Button asChild className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
            <Link href="/signup">Start for free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Background gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-violet-500 mr-2 animate-pulse"></span>
          Now in beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Generate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Edit.</span> Publish.
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl">
          AI creates a fully editable video from your script — your face, your voice, your brand.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-full">
            <Link href="/signup">Start for free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-white/5 rounded-full">
            <a href="#demo">See how it works</a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="demo" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to create at scale</h2>
          <p className="text-gray-400">Stop recording. Start generating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardHeader>
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-4">
                <Mic className="text-violet-400" size={24} />
              </div>
              <CardTitle>Your Face & Voice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Upload your voice sample and avatar once. Our AI clones them perfectly, allowing you to generate endless videos without ever stepping in front of a camera again.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardHeader>
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <Film className="text-fuchsia-400" size={24} />
              </div>
              <CardTitle>Editable Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Unlike other AI generators, you get a full timeline. Drag, trim, replace b-roll, adjust captions, and fine-tune your video before final rendering.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--color-surface)] border-[var(--color-border)]">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Upload className="text-blue-400" size={24} />
              </div>
              <CardTitle>Publish Everywhere</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Generate videos optimized for YouTube Shorts, Instagram Reels, TikTok, or LinkedIn with one click. Automatic formatting and caption styling included.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400">Choose the plan that fits your content needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription className="text-gray-400">Perfect to test the waters</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 5 render credits</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 1 voice profile</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 1 avatar profile</li>
                <li className="flex items-center gap-2 text-gray-500"><CheckCircle2 size={16} /> 720p export</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-white/5 text-white">
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-[#1A1025] border-violet-500/50 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-violet-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription className="text-gray-400">For serious creators</CardDescription>
              <div className="mt-4 text-4xl font-bold">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> 100 render credits</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> 10 voice profiles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> 5 avatar profiles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> 4K export</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-400" /> Priority rendering</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
                <Link href="/signup">Upgrade to Pro</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Agency Plan */}
          <Card className="bg-[var(--color-surface)] border-[var(--color-border)] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Agency</CardTitle>
              <CardDescription className="text-gray-400">Scale your production</CardDescription>
              <div className="mt-4 text-4xl font-bold">$249<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 500 render credits</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 50 voice profiles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> 20 avatar profiles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> API access</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-violet-500" /> Dedicated support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:bg-white/5 text-white">
                <Link href="/signup">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video size={20} className="text-violet-500" />
            <span className="font-bold tracking-tight">VIDAGENT</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} VidAgent. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
