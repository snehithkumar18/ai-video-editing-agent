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
  { 
    id: 'software_walkthrough', 
    label: 'Software Walkthrough', 
    icon: '🖥️',
    family: 'Screen & UI',
    badge: 'Trending 🔥',
    description: 'Polished app window, interactive cursor clicks & toggles, code fields & ambient neon glow (Instagram style).' 
  },
  { 
    id: 'warm_canvas', 
    label: 'Warm Canvas', 
    icon: '🎨',
    family: 'Editorial Split',
    badge: 'Claude Style',
    description: 'Cream textured paper canvas, Fraunces serif typography, floating thought cards & topic badges.' 
  },
  { 
    id: 'creator_motion_graphics', 
    label: 'Creator Motion Graphics', 
    icon: '⚡',
    family: 'Kinetic Type',
    badge: 'High Energy',
    description: 'Punchy Anton headers, high-velocity text hits, sticker badges & energetic transitions.' 
  },
  { 
    id: 'clean_tech', 
    label: 'Clean Tech', 
    icon: '🌐',
    family: 'Modern SaaS',
    badge: 'B2B & AI',
    description: 'Frosted-glass UI cards, Inter Tight & JetBrains Mono, neon data lines & KPI stats.' 
  },
  { 
    id: 'data_story', 
    label: 'Data Story', 
    icon: '📊',
    family: 'Data & Charts',
    badge: 'Metrics',
    description: 'Dark cinematic charts, animated retention curves, counters & financial trend callouts.' 
  },
  { 
    id: 'paper_doc', 
    label: 'Paper Doc Scrapbook', 
    icon: '📜',
    family: 'Documentary',
    badge: 'Stop-Motion',
    description: 'Ripped craft paper textures, masking tape, Polaroid cutouts, stamp badges & tactile shadows.' 
  },
  { 
    id: 'chalk_talk', 
    label: 'Chalk Talk', 
    icon: '✏️',
    family: 'Hand-Drawn',
    badge: 'Explainer',
    description: 'Slate chalkboard backdrop, Cabin Sketch & Kalam fonts, animated chalk doodles & arrows.' 
  },
  { 
    id: 'pop_info', 
    label: 'Pop Info', 
    icon: '🍭',
    family: 'Illustrated',
    badge: 'Fun & Casual',
    description: 'Vibrant candy pastel palette, bouncy Fredoka typography, playful vector icons & emojis.' 
  },
  { 
    id: 'zoom_circle', 
    label: 'Zoom Meeting Circle', 
    icon: '🎙️',
    family: 'Webcam Call',
    badge: 'Podcast',
    description: 'Floating webcam circle with active audio glow border & synchronized presentation graphics.' 
  }
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

  const [presenterMode, setPresenterMode] = useState<'sadtalker_avatar' | 'video_upload'>('sadtalker_avatar')
  const [talkingVideoFile, setTalkingVideoFile] = useState<File | null>(null)
  const [talkingVideoUrl, setTalkingVideoUrl] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const handleTalkingVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTalkingVideoFile(file)
      setTalkingVideoUrl(URL.createObjectURL(file))
    }
  }

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
          presenter_mode: presenterMode,
          talking_video_url: talkingVideoUrl || null,
          voice_profile_id: selectedVoice || null,
          avatar_profile_id: selectedAvatar || null
        })
      })

      const data = await res.json()
      if (data.success) {
        const newProjectId = data.data.id
        // Kick off video generation immediately
        try {
          await fetch('/api/video/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: newProjectId })
          })
        } catch (genErr) {
          logger.warn('Auto-generation kickoff failed:', genErr)
        }
        setIsOpen(false)
        router.push(`/projects/${newProjectId}`)
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
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-[#1E1B4B]">Select Visual Style Template</Label>
                <span className="text-[11px] text-[#7C3AED] font-medium">{TEMPLATES.length} Styles Available</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1 custom-scrollbar">
                {TEMPLATES.map((t) => (
                  <Card 
                    key={t.id}
                    className={cn(
                      "p-3 cursor-pointer border rounded-2xl transition-all flex flex-col justify-between text-left",
                      template === t.id 
                        ? "border-[#7C3AED] bg-[#EDE9FE]/60 shadow-sm shadow-[#7C3AED]/15 ring-2 ring-[#7C3AED]" 
                        : "border-[#E5E3EB] bg-white hover:border-[#C4B5FD] hover:bg-[#F8F7FC]"
                    )}
                    onClick={() => setTemplate(t.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{t.icon}</span>
                          <span className="font-bold text-xs text-[#1E1B4B]">{t.label}</span>
                        </div>
                        <span className={cn(
                          "text-[9px] font-semibold px-1.5 py-0.5 rounded-full border",
                          template === t.id 
                            ? "bg-[#7C3AED] text-white border-[#7C3AED]" 
                            : "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]"
                        )}>
                          {t.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B7280] leading-snug line-clamp-2">{t.description}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-[#9CA3AF] font-medium">{t.family}</span>
                      <span className="font-bold text-[#7C3AED]">
                        {template === t.id ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
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
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#1E1B4B]">Presenter Generation Mode</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={cn(
                    "p-3.5 cursor-pointer border rounded-2xl transition-all flex flex-col items-center gap-1.5 text-center",
                    presenterMode === 'sadtalker_avatar'
                      ? "border-[#7C3AED] bg-[#EDE9FE]/50 text-[#7C3AED] shadow-sm shadow-[#7C3AED]/5"
                      : "border-[#E5E3EB] bg-white text-[#78767B] hover:border-[#C4B5FD] hover:bg-[#F8F7FC]/50"
                  )}
                  onClick={() => setPresenterMode('sadtalker_avatar')}
                >
                  <span className="text-2xl">✨</span>
                  <span className="text-xs font-bold text-[#1E1B4B]">SadTalker AI Avatar</span>
                  <span className="text-[11px] text-[#78767B] leading-tight">Animate photo synced to speech</span>
                </Card>

                <Card
                  className={cn(
                    "p-3.5 cursor-pointer border rounded-2xl transition-all flex flex-col items-center gap-1.5 text-center",
                    presenterMode === 'video_upload'
                      ? "border-[#7C3AED] bg-[#EDE9FE]/50 text-[#7C3AED] shadow-sm shadow-[#7C3AED]/5"
                      : "border-[#E5E3EB] bg-white text-[#78767B] hover:border-[#C4B5FD] hover:bg-[#F8F7FC]/50"
                  )}
                  onClick={() => setPresenterMode('video_upload')}
                >
                  <span className="text-2xl">📹</span>
                  <span className="text-xs font-bold text-[#1E1B4B]">Upload Talking Video</span>
                  <span className="text-[11px] text-[#78767B] leading-tight">Upload video of you reading script</span>
                </Card>
              </div>
            </div>

            {presenterMode === 'video_upload' ? (
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#1E1B4B]">Upload Video of You Talking</Label>
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#F8F7FC] hover:bg-[#F1F5F9] transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleTalkingVideoSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="text-3xl mb-2">🎬</span>
                  <p className="text-sm font-semibold text-[#1E1B4B]">
                    {talkingVideoFile ? talkingVideoFile.name : 'Tap to upload talking video'}
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">
                    MP4 or MOV (We will automatically key out the background & sync timestamps)
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-[#1E1B4B]">Select Cloned Voice</Label>
                    <span className="text-[11px] font-bold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-full">SadTalker Speech Sync</span>
                  </div>
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
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-[#1E1B4B]">Select Photo Avatar (Animated by SadTalker)</Label>
                    <span className="text-[11px] font-bold text-[#10B981] bg-[#DCFCE7] px-2 py-0.5 rounded-full">SadTalker Engine</span>
                  </div>
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
              </>
            )}

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
