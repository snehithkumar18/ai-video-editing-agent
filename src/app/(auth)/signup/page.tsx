'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, Video } from 'lucide-react'
import { z } from 'zod'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const validatedData = signupSchema.parse({
        fullName,
        email,
        password,
        confirmPassword
      })

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess("Check your email to confirm your account")
      setLoading(false)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message)
      } else {
        setError("An unexpected error occurred")
      }
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  const handleGitHubSignup = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark Hero Top Section */}
      <div className="auth-hero-gradient relative overflow-hidden" style={{ minHeight: '220px' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-40">
            <div className="absolute top-6 left-1/4 w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
            <div className="absolute top-12 left-1/2 w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-4 right-1/4 w-2.5 h-2.5 rounded-full bg-violet-300 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-14 px-4">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <Video size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VidAgent AI</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 text-center">
            Get Started
          </h1>
          <p className="text-sm text-purple-200/70 text-center max-w-xs">
            Create your account and start generating
          </p>
        </div>
      </div>

      {/* White Card Section */}
      <div className="flex-1 flex flex-col items-center bg-white -mt-8 rounded-t-3xl relative z-20 px-4 pt-10 pb-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#1E1B4B] text-center mb-1">Create an account</h2>
          <p className="text-sm text-[#78767B] text-center mb-7">Enter your details to get started</p>

          {success ? (
            <div className="p-4 rounded-xl bg-green-50 text-green-600 border border-green-200 text-sm text-center mb-6">
              {success}
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 text-sm rounded-xl mb-6 bg-red-50 text-red-500 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signup-fullName" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Full Name</label>
                  <input
                    id="signup-fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Email Address</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 px-4 pr-11 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8B6BC] hover:text-[#78767B] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-[#1E1B4B] mb-1.5">Confirm Password</label>
                  <input
                    id="signup-confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-xl border border-[#E5E3EB] bg-white text-[#1E1B4B] text-sm placeholder:text-[#B8B6BC] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl btn-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create Account →
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#E5E3EB]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-[#B8B6BC]">or continue with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E3EB] bg-white text-sm font-medium text-[#1E1B4B] hover:bg-[#F8F7FC] transition-colors disabled:opacity-50"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={handleGitHubSignup}
                  disabled={loading}
                  className="h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E3EB] bg-white text-sm font-medium text-[#1E1B4B] hover:bg-[#F8F7FC] transition-colors disabled:opacity-50"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="#1E1B4B">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-[#78767B] mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#7C3AED] font-semibold hover:text-[#6D28D9] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
