'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
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
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('youtube_shorts')
  const [template, setTemplate] = useState('split_screen')
  const [script, setScript] = useState('')

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
          script_raw: script
        })
      })

      const data = await res.json()
      if (data.success) {
        onOpenChange(false)
        router.push(`/projects/${data.data.id}`)
      }
    } catch (error) {
      logger.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0D0D0D] border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Create New Video</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="E.g., 5 AI Tools You Need" 
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <Card 
                    key={p.id}
                    className={cn(
                      "p-3 cursor-pointer border hover:border-violet-500 transition-colors bg-background flex flex-col items-center gap-2",
                      platform === p.id ? "border-violet-500 bg-violet-500/10" : "border-border"
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
              <Label>Style Template</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <Card 
                    key={t.id}
                    className={cn(
                      "p-3 cursor-pointer border hover:border-violet-500 transition-colors bg-background text-center text-sm",
                      template === t.id ? "border-violet-500 text-violet-400 bg-violet-500/10" : "border-border text-muted-foreground"
                    )}
                    onClick={() => setTemplate(t.id)}
                  >
                    {t.label}
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!title} className="bg-violet-600 hover:bg-violet-700 text-white">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Script</Label>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-violet-600/10 text-violet-400 border-violet-600/20 hover:bg-violet-600/20">
                  Optimize with AI
                </Button>
              </div>
              <Textarea 
                value={script} 
                onChange={(e) => setScript(e.target.value)} 
                placeholder="Paste your script or rough idea here..." 
                className="h-64 bg-background border-border resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {script.length} characters
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700 text-white">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Select Voice</Label>
              <Card className="p-6 bg-background border-border text-center border-dashed">
                <p className="text-sm text-muted-foreground mb-2">No voices yet — Upload one first</p>
                <Button variant="link" className="text-violet-400">Go to Voice Profiles</Button>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Select Avatar</Label>
              <Card className="p-6 bg-background border-border text-center border-dashed">
                <p className="text-sm text-muted-foreground mb-2">No avatars yet — Upload one first</p>
                <Button variant="link" className="text-violet-400">Go to Avatars</Button>
              </Card>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} disabled={loading}>Back</Button>
              <Button onClick={handleCreate} disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Video
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
