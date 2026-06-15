'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Copy, Trash2, Edit2, Play } from 'lucide-react'
function formatDistanceToNowCustom(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${diffInDays}d`;
}
import Link from 'next/link'
import type { Project } from '@/lib/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-[#EDE9FE] text-[#7C3AED] border-[#7C3AED]/20'
      case 'generating': return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'editing': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'rendering': return 'bg-purple-50 text-purple-600 border-purple-200'
      case 'complete': return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'failed': return 'bg-red-50 text-red-500 border-red-200'
      default: return 'bg-gray-100 text-gray-500 border-gray-200'
    }
  }

  const formatPlatform = (platform: string) => {
    return platform.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E3EB] overflow-hidden hover:border-[#C4B5FD] transition-all card-hover group flex flex-col">
      <Link href={`/projects/${project.id}`} className="block relative aspect-video bg-[#F1F0F5] overflow-hidden">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE]">
            <Play className="text-[#7C3AED]/30 w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        {project.duration_seconds && (
          <div className="absolute bottom-2 right-2 bg-[#1E1B4B]/80 px-2 py-1 rounded-lg text-xs text-white font-medium backdrop-blur-sm">
            {Math.floor(project.duration_seconds / 60)}:{(Math.floor(project.duration_seconds % 60)).toString().padStart(2, '0')}
          </div>
        )}
      </Link>
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 text-[#1E1B4B] group-hover:text-[#7C3AED] transition-colors">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F1F0F5] text-[#78767B] border border-[#E5E3EB]">
            {formatPlatform(project.platform)}
          </span>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between border-t border-[#E5E3EB]/50">
        <span className="text-xs text-[#78767B]">
          {formatDistanceToNowCustom(new Date(project.created_at))} ago
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-[#B8B6BC] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] transition-colors">
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white border-[#E5E3EB] rounded-xl">
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.id}/edit`} className="cursor-pointer text-[#1E1B4B]">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-[#1E1B4B]">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
