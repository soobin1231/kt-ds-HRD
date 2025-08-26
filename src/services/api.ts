import axios from 'axios'
import type { Material, MaterialSearchParams } from '@/types/material'
import type { Category } from '@/types/category'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const materialAPI = {
  // 교육자료 목록 조회 (로그인 불필요)
  getAll: (params?: MaterialSearchParams) => 
    api.get<Material[]>('/api/materials', { params }),
  
  // 교육자료 상세 조회
  getById: (id: number) => 
    api.get<Material>(`/api/materials/${id}`),
  
  // 교육자료 다운로드
  download: async (id: number, filename: string) => {
    const response = await api.get(`/api/materials/${id}/download`, {
      responseType: 'blob'
    })
    
    // 파일 다운로드 처리
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return response
  },
  
  // 조회수 증가
  incrementViewCount: (id: number) => 
    api.post(`/api/materials/${id}/view`),
  
  // 관리자 기능 (향후 SSO 연동)
  create: (formData: FormData) => 
    api.post<Material>('/api/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: number, formData: FormData) => 
    api.put<Material>(`/api/materials/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: number) => 
    api.delete(`/api/materials/${id}`),
}

export const categoryAPI = {
  getAll: () => 
    api.get<Category[]>('/api/categories'),
  
  getById: (id: number) => 
    api.get<Category>(`/api/categories/${id}`),
}

export default api