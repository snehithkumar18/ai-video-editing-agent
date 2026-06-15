import Link from 'next/link'
import { CheckCircle2, Film, Mic, Upload, Video } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen landing-dark text-white overflow-hidden selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <Video size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VidAgent AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-[#C4B5FD] transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="h-9 px-5 rounded-lg btn-gradient text-white text-sm font-semibold inline-flex items-center"
          >
            Start for free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Background gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/25 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3.5 py-1.5 text-sm font-medium text-[#C4B5FD] mb-8">
          <span className="flex h-2 w-2 rounded-full bg-[#7C3AED] mr-2 animate-pulse"></span>
          Now in beta
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Generate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#A855F7]">Edit.</span> Publish.
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl">
          AI creates a fully editable video from your script — your face, your voice, your brand.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto h-14 px-8 text-lg btn-gradient text-white rounded-full font-semibold inline-flex items-center justify-center"
          >
            Start for free
          </Link>
          <a 
            href="#demo" 
            className="w-full sm:w-auto h-14 px-8 text-lg bg-white/[0.06] border border-white/10 hover:bg-white/10 rounded-full font-semibold inline-flex items-center justify-center transition-colors"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="demo" className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to create at scale</h2>
          <p className="text-gray-400">Stop recording. Start generating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-[#7C3AED]/30 transition-colors">
            <div className="w-12 h-12 bg-[#7C3AED]/20 rounded-xl flex items-center justify-center mb-4">
              <Mic className="text-[#C4B5FD]" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Face & Voice</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Upload your voice sample and avatar once. Our AI clones them perfectly, allowing you to generate endless videos without ever stepping in front of a camera again.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-[#7C3AED]/30 transition-colors">
            <div className="w-12 h-12 bg-[#A855F7]/20 rounded-xl flex items-center justify-center mb-4">
              <Film className="text-[#C4B5FD]" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Editable Timeline</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unlike other AI generators, you get a full timeline. Drag, trim, replace b-roll, adjust captions, and fine-tune your video before final rendering.
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-[#7C3AED]/30 transition-colors">
            <div className="w-12 h-12 bg-[#EDE9FE]/20 rounded-xl flex items-center justify-center mb-4">
              <Upload className="text-[#C4B5FD]" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Publish Everywhere</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Generate videos optimized for YouTube Shorts, Instagram Reels, TikTok, or LinkedIn with one click. Automatic formatting and caption styling included.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400">Choose the plan that fits your content needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-1">Free</h3>
            <p className="text-gray-400 text-sm mb-4">Perfect to test the waters</p>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 5 render credits</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 1 voice profile</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 1 avatar profile</li>
              <li className="flex items-center gap-2 text-gray-500"><CheckCircle2 size={16} /> 720p export</li>
            </ul>
            <Link 
              href="/signup" 
              className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1E1B4B]/60 border border-[#7C3AED]/40 rounded-2xl p-6 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-[#7C3AED]/15">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold mb-1">Pro</h3>
            <p className="text-gray-400 text-sm mb-4">For serious creators</p>
            <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C4B5FD]" /> 100 render credits</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C4B5FD]" /> 10 voice profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C4B5FD]" /> 5 avatar profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C4B5FD]" /> 4K export</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#C4B5FD]" /> Priority rendering</li>
            </ul>
            <Link 
              href="/signup" 
              className="w-full h-11 rounded-xl btn-gradient text-white text-sm font-semibold inline-flex items-center justify-center"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Agency Plan */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-semibold mb-1">Agency</h3>
            <p className="text-gray-400 text-sm mb-4">Scale your production</p>
            <div className="text-4xl font-bold mb-6">$249<span className="text-lg text-gray-500 font-normal">/mo</span></div>
            <ul className="space-y-3 text-sm flex-1 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 500 render credits</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 50 voice profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> 20 avatar profiles</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> API access</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#7C3AED]" /> Dedicated support</li>
            </ul>
            <Link 
              href="/signup" 
              className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold inline-flex items-center justify-center transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-black/30 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Video size={18} className="text-[#7C3AED]" />
            <span className="font-bold tracking-tight">VidAgent AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} VidAgent AI. All rights reserved.
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
