'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import logger from '@/lib/logger'

const PLATFORMS = [
  { id: 'youtube_shorts', label: 'YouTube Shorts', icon: '📱' },
  { id: 'instagram_reels', label: 'Instagram Reels', icon: '🎬' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'youtube', label: 'YouTube Longform', icon: '📺' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' }
]

const TEMPLATES = [
  { id: 'split_screen', label: 'Split Screen' },
  { id: 'video_call', label: 'Video Call' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'news_anchor', label: 'News Anchor' },
  { id: 'reaction_cam', label: 'Reaction Cam' }
]

interface CreateProjectModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export default function CreateProjectModal({ open, onOpenChange, trigger }: CreateProjectModalProps) {
  const [localOpen, setLocalOpen] = useState(false)
  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : localOpen
  const setIsOpen = (val: boolean) => {
    if (isControlled) {
      onOpenChange?.(val)
    } else {
      setLocalOpen(val)
    }
  }
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('youtube_shorts')
  const [template, setTemplate] = useState('split_screen')
  const [script, setScript] = useState('')
  
  const [voices, setVoices] = useState<any[]>([])
  const [avatars, setAvatars] = useState<any[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      // Fetch voice profiles
      fetch('/api/voice/list')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setVoices(data.data)
            const defaultVoice = data.data.find((v: any) => v.is_default)
            if (defaultVoice) setSelectedVoice(defaultVoice.id)
            else if (data.data.length > 0) setSelectedVoice(data.data[0].id)
          }
        })
        .catch(err => logger.error('Error fetching voices:', err))

      // Fetch avatar profiles
      fetch('/api/avatar/list')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setAvatars(data.data)
            const defaultAvatar = data.data.find((a: any) => a.is_default || a.status === 'ready')
            if (defaultAvatar) setSelectedAvatar(defaultAvatar.id)
            else if (data.data.length > 0) setSelectedAvatar(data.data[0].id)
          }
        })
        .catch(err => logger.error('Error fetching avatars:', err))
    }
  }, [isOpen])

  const [optimizing, setOptimizing] = useState(false)

  const handleOptimize = async () => {
    if (!script.trim()) return
    setOptimizing(true)
    try {
      const res = await fetch('/api/project/optimize-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script })
      })
      const data = await res.json()
      if (data.success && data.optimizedScript) {
        setScript(data.optimizedScript)
      }
    } catch (err) {
      logger.error('Error optimizing script:', err)
    } finally {
      setOptimizing(false)
    }
  }

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          platform,
          style_template: template,
          script_raw: script,
          voice_profile_id: selectedVoice || null,
          avatar_profile_id: selectedAvatar || null
        })
      })

      const data = await res.json()
      if (data.success) {
        setIsOpen(false)
        router.push(`/projects/${data.data.id}`)
      }
    } catch (error) {
      logger.error(error)
    } finally {
      setLoading(false)
    }
  }

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1E1B4B] tracking-tight">Create New Video</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Project Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="E.g., 5 AI Tools You Need" 
                className="bg-[#F8F7FC] border-[#E5E3EB] rounded-xl text-[#1E1B4B] placeholder:text-[#B8B6BC] focus-visible:ring-1 focus-visible:ring-[#7C3AED]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Platform</Label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <Card 
                    key={p.id}
                    className={cn(
                      "p-3.5 cursor-pointer border rounded-2xl transition-all flex flex-col items-center gap-1.5",
                      platform === p.id 
                        ? "border-[#7C3AED] bg-[#EDE9FE]/50 text-[#7C3AED] shadow-sm shadow-[#7C3AED]/5" 
                        : "border-[#E5E3EB] bg-white text-[#78767B] hover:border-[#C4B5FD] hover:bg-[#F8F7FC]/50"
                    )}
                    onClick={() => setPlatform(p.id)}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-xs text-center font-medium">{p.label}</span>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Style Template</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <Card 
                    key={t.id}
                    className={cn(
                      "p-3 cursor-pointer border rounded-xl transition-all text-center text-xs font-medium",
                      template === t.id 
                        ? "border-[#7C3AED] text-[#7C3AED] bg-[#EDE9FE]/50 shadow-sm" 
                        : "border-[#E5E3EB] text-[#78767B] bg-white hover:border-[#C4B5FD]"
                    )}
                    onClick={() => setTemplate(t.id)}
                  >
                    {t.label}
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!title} className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-[#1E1B4B]">Script</Label>
                <button 
                  onClick={handleOptimize}
                  disabled={optimizing || !script.trim()}
                  className="h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#E2DBFD] transition-colors border-none text-xs font-semibold px-3 disabled:opacity-50"
                >
                  {optimizing ? 'Optimizing...' : 'Optimize with AI'}
                </button>
              </div>
              <Textarea 
                value={script} 
                onChange={(e) => setScript(e.target.value)} 
                placeholder="Paste your script or rough idea here..." 
                className="h-64 bg-[#F8F7FC] border-[#E5E3EB] rounded-2xl text-[#1E1B4B] placeholder:text-[#B8B6BC] resize-none focus-visible:ring-1 focus-visible:ring-[#7C3AED] p-3.5"
              />
              <div className="text-xs text-[#78767B] text-right font-medium">
                {script.length} characters
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="h-10 px-6 rounded-xl border border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC]">Back</Button>
              <Button onClick={handleNext} className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Select Voice</Label>
              {voices.length > 0 ? (
                <Select value={selectedVoice} onValueChange={(val) => setSelectedVoice(val || '')}>
                  <SelectTrigger className="w-full bg-[#F8F7FC] border-[#E5E3EB] rounded-xl text-[#1E1B4B] h-11">
                    <SelectValue placeholder="Select a voice profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-xl shadow-lg">
                    {voices.map((v) => (
                      <SelectItem key={v.id} value={v.id} className="focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer">
                        {v.name} {v.is_default ? '(Default)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Card className="p-6 bg-[#F8F7FC] border-[#E5E3EB] text-center border-dashed rounded-2xl">
                  <p className="text-sm text-[#78767B] mb-2">No voice clones available</p>
                  <Button variant="link" className="text-[#7C3AED] font-semibold hover:underline p-0 h-auto" onClick={() => { setIsOpen(false); router.push('/voice'); }}>
                    Upload your first voice
                  </Button>
                </Card>
              )}
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Select Avatar</Label>
              {avatars.length > 0 ? (
                <Select value={selectedAvatar} onValueChange={(val) => setSelectedAvatar(val || '')}>
                  <SelectTrigger className="w-full bg-[#F8F7FC] border-[#E5E3EB] rounded-xl text-[#1E1B4B] h-11">
                    <SelectValue placeholder="Select an avatar profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5E3EB] text-[#1E1B4B] rounded-xl shadow-lg">
                    {avatars.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer">
                        {a.name} {a.is_default ? '(Default)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Card className="p-6 bg-[#F8F7FC] border-[#E5E3EB] text-center border-dashed rounded-2xl">
                  <p className="text-sm text-[#78767B] mb-2">No avatars available</p>
                  <Button variant="link" className="text-[#7C3AED] font-semibold hover:underline p-0 h-auto" onClick={() => { setIsOpen(false); router.push('/avatars'); }}>
                    Upload your first avatar
                  </Button>
                </Card>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} disabled={loading} className="h-10 px-6 rounded-xl border border-[#E5E3EB] text-[#1E1B4B] hover:bg-[#F8F7FC]">Back</Button>
              <Button onClick={handleCreate} disabled={loading} className="h-10 px-6 rounded-xl btn-gradient text-white text-sm font-semibold">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Video
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  if (trigger) {
    return (
      <>
        <span onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </span>
        {modalContent}
      </>
    )
  }

  return modalContent
}
