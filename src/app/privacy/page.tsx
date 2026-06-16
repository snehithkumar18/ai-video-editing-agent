import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen landing-dark text-white flex flex-col selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between z-50 relative border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <Video size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VidAgent AI</span>
        </Link>
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-16 max-w-4xl relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C3AED]/15 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: June 16, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information to provide better services to our users. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Info:</strong> Email address, name, billing details (via Stripe), and authentication identifiers.</li>
              <li><strong>Media Assets:</strong> Audio recordings, voice training samples, image avatars, scripts, and generated videos.</li>
              <li><strong>Usage Details:</strong> Log data, IP address, device type, browser settings, and page activity.</li>
            </ul>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              2. How We Use Information
            </h2>
            <p className="mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To construct and run personal voice clones and face-synchronization pipelines.</li>
              <li>To process payments and manage subscriptions.</li>
              <li>To monitor service performance, debug software issues, and prevent fraud.</li>
              <li>To communicate update notes, marketing features, and system alerts.</li>
            </ul>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              3. Data Protection & Processing
            </h2>
            <p className="mb-4">
              We take data security very seriously. All media and voice cloning assets are stored securely in encrypted storage buckets. Access to these resources is tightly controlled through Supabase row-level security and restricted API keys.
            </p>
            <p>
              Your voice model data is processed ephemerally on dedicated backend workers and is deleted or archived securely based on your workspace settings.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              4. Cookies and Tracking
            </h2>
            <p>
              We use standard cookies and storage tokens to maintain your session state, remember preferences, and analyze website analytics. You can manage cookie behavior through your local browser configurations.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              5. Your Rights and Deletion
            </h2>
            <p>
              You may request full deletion of your user account, cloned voices, custom avatars, and video files at any time via your Account Settings or by reaching out to support. Once deleted, this information is purged from active databases and cannot be retrieved.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-black/30 py-12 mt-16">
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
  );
}
