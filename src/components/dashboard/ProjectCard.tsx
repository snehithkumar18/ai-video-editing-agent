'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Copy, Trash2, Edit2, Play } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import type { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/20'
      case 'generating': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
      case 'editing': return 'bg-blue-500/20 text-blue-400 border-blue-500/20'
      case 'rendering': return 'bg-purple-500/20 text-purple-400 border-purple-500/20'
      case 'complete': return 'bg-green-500/20 text-green-400 border-green-500/20'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/20'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20'
    }
  }

  const formatPlatform = (platform: string) => {
    return platform.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <Card className="bg-[#0D0D0D] border-border overflow-hidden hover:border-violet-500/50 transition-colors group flex flex-col">
      <Link href={`/projects/${project.id}`} className="block relative aspect-video bg-muted overflow-hidden">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-black">
            <Play className="text-violet-500/50 w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={getStatusColor(project.status)}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        {project.duration_seconds && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
            {Math.floor(project.duration_seconds / 60)}:{(Math.floor(project.duration_seconds % 60)).toString().padStart(2, '0')}
          </div>
        )}
      </Link>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-white group-hover:text-violet-400 transition-colors">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-border">
            {formatPlatform(project.platform)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/50 mt-auto">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.id}/edit`} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
