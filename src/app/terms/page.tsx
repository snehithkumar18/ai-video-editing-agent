import Link from 'next/link';
import { ArrowLeft, Video } from 'lucide-react';

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-gray-400 text-sm mb-12">Last updated: June 16, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using VidAgent AI (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              2. Description of Service
            </h2>
            <p className="mb-4">
              VidAgent AI provides AI-powered video editing and generation tools, including text-to-speech, voice cloning, avatar generation, and automated editing pipelines.
            </p>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. We will not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              3. User Accounts & Responsibilities
            </h2>
            <p className="mb-4">
              To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account.
            </p>
            <p>
              You agree to notify us immediately of any unauthorized use of your account. You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              4. AI Models & Content Ownership
            </h2>
            <p className="mb-4">
              <strong>Your Content:</strong> You retain all ownership rights to the source media, voice recordings, scripts, and finished videos created using the Service.
            </p>
            <p>
              <strong>AI Training:</strong> We do not use your personal voice clones or private avatars to train public models without your explicit consent. You grant VidAgent AI a limited, worldwide, non-exclusive license to process your assets solely to provide and improve the services you request.
            </p>
          </section>

          <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#7C3AED] rounded-full" />
              5. Acceptable Use Policy
            </h2>
            <p className="mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Create deepfakes, misleading content, or voice clones of individuals without their explicit written consent.</li>
              <li>Generate hate speech, sexually explicit content, or material depicting graphic violence.</li>
              <li>Impersonate public officials, government entities, or other organizations.</li>
              <li>Violate any local, state, national, or international laws.</li>
            </ul>
            <p>
              Violating this policy will result in immediate termination of your account without refund.
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
