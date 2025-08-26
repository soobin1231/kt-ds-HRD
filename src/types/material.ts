export interface Material {
  id: number
  title: string
  description?: string
  category_id?: number
  file_name: string
  original_file_name: string
  file_size: number
  mime_type: string
  tags?: string[]
  is_featured: boolean
  view_count: number
  download_count: number
  created_at: string
  updated_at?: string
}

export interface CreateMaterialRequest {
  title: string
  description?: string
  category_id?: number
  tags?: string[]
  is_featured?: boolean
}

export interface MaterialSearchParams {
  search?: string
  category_id?: number
  tags?: string[]
  is_featured?: boolean
  limit?: number
  offset?: number
}