import { CaptionStyle } from './timeline'

export type OperationType =
  | 'UPDATE_CAPTION_STYLE'
  | 'UPDATE_CAPTION_TEXT'
  | 'UPDATE_ALL_CAPTIONS_STYLE'
  | 'MOVE_CLIP'
  | 'TRIM_CLIP'
  | 'DELETE_CLIP'
  | 'REPLACE_BROLL'
  | 'ADD_BROLL'
  | 'UPDATE_CLIP_OPACITY'
  | 'UPDATE_AUDIO_VOLUME'
  | 'UPDATE_ALL_AUDIO_VOLUME'
  | 'SPLIT_AT_PLAYHEAD'
  | 'ADD_MUSIC_TRACK'
  | 'REORDER_BROLL'
  | 'TRIM_TOTAL_DURATION'

export interface BaseOperation {
  type: OperationType
  reasoning: string
}

export interface UpdateCaptionStyleOp extends BaseOperation {
  type: 'UPDATE_CAPTION_STYLE'
  clipId: string
  changes: Partial<CaptionStyle>
}

export interface UpdateAllCaptionsStyleOp extends BaseOperation {
  type: 'UPDATE_ALL_CAPTIONS_STYLE'
  changes: Partial<CaptionStyle>
}

export interface UpdateCaptionTextOp extends BaseOperation {
  type: 'UPDATE_CAPTION_TEXT'
  clipId: string
  newText: string
}

export interface MoveClipOp extends BaseOperation {
  type: 'MOVE_CLIP'
  trackId: string
  clipId: string
  newStart: number
}

export interface TrimClipOp extends BaseOperation {
  type: 'TRIM_CLIP'
  trackId: string
  clipId: string
  newStart: number
  newEnd: number
}

export interface DeleteClipOp extends BaseOperation {
  type: 'DELETE_CLIP'
  trackId: string
  clipId: string
}

export interface ReplaceBRollOp extends BaseOperation {
  type: 'REPLACE_BROLL'
  clipId: string
  searchQuery: string
  newAssetUrl?: string
}

export interface AddBRollOp extends BaseOperation {
  type: 'ADD_BROLL'
  searchQuery: string
  insertAtSecond: number
  durationSeconds: number
  newAssetUrl?: string
}

export interface UpdateClipOpacityOp extends BaseOperation {
  type: 'UPDATE_CLIP_OPACITY'
  trackId: string
  clipId: string
  opacity: number
}

export interface UpdateAudioVolumeOp extends BaseOperation {
  type: 'UPDATE_AUDIO_VOLUME'
  trackId: string
  clipId: string
  volume: number
}

export interface UpdateAllAudioVolumeOp extends BaseOperation {
  type: 'UPDATE_ALL_AUDIO_VOLUME'
  trackId: string
  volumeMultiplier: number
}

export interface TrimTotalDurationOp extends BaseOperation {
  type: 'TRIM_TOTAL_DURATION'
  newDurationSeconds: number
}

export type TimelineOperation =
  | UpdateCaptionStyleOp
  | UpdateAllCaptionsStyleOp
  | UpdateCaptionTextOp
  | MoveClipOp
  | TrimClipOp
  | DeleteClipOp
  | ReplaceBRollOp
  | AddBRollOp
  | UpdateClipOpacityOp
  | UpdateAudioVolumeOp
  | UpdateAllAudioVolumeOp
  | TrimTotalDurationOp

export interface AIEditRequest {
  prompt: string
  timelineSummary: string
  projectId: string
}

export interface AIEditResponse {
  operations: TimelineOperation[]
  explanation: string
  humanReadableSummary: string
  confidence: 'high' | 'medium' | 'low'
}

export interface AIEditHistoryItem {
  id: string
  prompt: string
  explanation: string
  operations: TimelineOperation[]
  appliedAt: Date
  undone: boolean
}
