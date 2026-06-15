'use client'

import Link from 'next/link'
import { MoreVertical, Play } from 'lucide-react'
import type { Project } from '@/lib/types'

function formatDistanceToNowCustom(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
}

interface ProjectListItemProps {
  project: Project
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'draft': return 'status-draft'
      case 'generating':
      case 'rendering': return 'status-processing'
      case 'editing': return 'bg-blue-50 text-blue-600 border border-blue-200'
      case 'complete': return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      case 'failed': return 'bg-red-50 text-red-500 border border-red-200'
      default: return 'status-draft'
    }
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E5E3EB] hover:border-[#C4B5FD] transition-all card-hover group"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-[#F1F0F5] flex-shrink-0 overflow-hidden">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE]">
            <Play className="text-[#7C3AED]/40" size={18} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#1E1B4B] truncate group-hover:text-[#7C3AED] transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-[#78767B] mt-0.5">
          Updated {formatDistanceToNowCustom(new Date(project.created_at))}
        </p>
      </div>

      {/* Status Badge */}
      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusStyle(project.status)}`}>
        {project.status}
      </span>

      {/* Menu */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#B8B6BC] hover:text-[#1E1B4B] hover:bg-[#F1F0F5] transition-colors"
      >
        <MoreVertical size={16} />
      </button>
    </Link>
  )
}
