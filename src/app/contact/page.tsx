'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

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
      <main className="flex-1 container mx-auto px-6 py-16 max-w-5xl relative flex flex-col justify-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7C3AED]/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Get in touch
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Have questions about our enterprise voice cloning, API integration, or custom avatar training? Drop us a message.
            </p>

            <div className="space-y-6 pt-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C4B5FD] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Our support team replies within 12 hours.</p>
                  <a href="mailto:support@vidagent.ai" className="text-[#C4B5FD] text-sm hover:underline mt-1 block">
                    support@vidagent.ai
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C4B5FD] shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Live Chat</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Available for Scale and Enterprise plan members.</p>
                  <span className="text-gray-500 text-sm block mt-1">
                    Available in dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank you!</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Your message has been sent successfully. One of our specialists will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-sm text-[#C4B5FD] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us what you're building..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white text-sm placeholder:text-gray-500 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl btn-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
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
