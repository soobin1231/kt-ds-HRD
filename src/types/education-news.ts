export interface EducationNews {
  id: number
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface CreateEducationNewsRequest {
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  is_active?: boolean
}

export interface UpdateEducationNewsRequest {
  title?: string
  content?: string
  priority?: 'high' | 'medium' | 'low'
  is_active?: boolean
}
