import axios from 'axios'
import type { Material, MaterialSearchParams } from '@/types/material'
import type { Category } from '@/types/category'
import type { EducationNews, CreateEducationNewsRequest, UpdateEducationNewsRequest } from '@/types/education-news'
import { dummyMaterials, dummyCategories } from './dummyData'

// 백엔드 연결 상태 확인
const isBackendAvailable = async () => {
  try {
    await axios.get('http://localhost:8000/api/health', { timeout: 2000 })
    return true
  } catch {
    return false
  }
}

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
  getAll: async (params?: MaterialSearchParams) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<Material[]>('/api/materials', { params })
      } else {
        // 백엔드가 없을 때 더미 데이터 반환
        console.log('백엔드 서버가 연결되지 않아 더미 데이터를 사용합니다.')
        let filteredMaterials = [...dummyMaterials]
        
        if (params?.is_featured) {
          filteredMaterials = filteredMaterials.filter(m => m.is_featured)
        }
        
        if (params?.limit) {
          filteredMaterials = filteredMaterials.slice(0, params.limit)
        }
        
        return { data: filteredMaterials }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 데이터를 사용합니다.')
      return { data: dummyMaterials }
    }
  },
  
  // 교육자료 상세 조회
  getById: async (id: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<Material>(`/api/materials/${id}`)
      } else {
        const material = dummyMaterials.find(m => m.id === id)
        if (material) {
          return { data: material }
        } else {
          throw new Error('Material not found')
        }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 데이터를 사용합니다.')
      const material = dummyMaterials.find(m => m.id === id)
      if (material) {
        return { data: material }
      } else {
        throw new Error('Material not found')
      }
    }
  },
  
  // 교육자료 다운로드
  download: async (id: number, filename: string) => {
    try {
      if (await isBackendAvailable()) {
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
      } else {
        // 백엔드가 없을 때 더미 파일 다운로드
        console.log('백엔드 서버가 연결되지 않아 더미 파일을 다운로드합니다.')
        const dummyContent = '이것은 더미 파일입니다. 실제 백엔드 서버가 필요합니다.'
        const blob = new Blob([dummyContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return { data: blob }
      }
    } catch (error) {
      console.log('다운로드 실패')
      throw error
    }
  },
  
  // 조회수 증가
  incrementViewCount: async (id: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.post(`/api/materials/${id}/view`)
      } else {
        console.log('백엔드 서버가 연결되지 않아 조회수 증가를 건너뜁니다.')
        return { data: { success: true } }
      }
    } catch (error) {
      console.log('조회수 증가 실패')
      return { data: { success: true } }
    }
  },
  
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
  getAll: async () => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<Category[]>('/api/categories')
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 카테고리를 사용합니다.')
        return { data: dummyCategories }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 카테고리를 사용합니다.')
      return { data: dummyCategories }
    }
  },
  
  getById: async (id: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<Category>(`/api/categories/${id}`)
      } else {
        const category = dummyCategories.find(c => c.id === id)
        if (category) {
          return { data: category }
        } else {
          throw new Error('Category not found')
        }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 카테고리를 사용합니다.')
      const category = dummyCategories.find(c => c.id === id)
      if (category) {
        return { data: category }
      } else {
        throw new Error('Category not found')
      }
    }
  },
}

export const educationNewsAPI = {
  // 교육 뉴스 목록 조회
  getAll: async (params?: { priority?: string; is_active?: boolean; limit?: number; offset?: number }) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<EducationNews[]>('/api/education-news', { params })
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 교육 뉴스를 사용합니다.')
        const dummyNews: EducationNews[] = [
          {
            id: 1,
            title: 'KT DS HRD 플랫폼 오픈 안내',
            content: 'KT DS HRD 교육 플랫폼이 정식 오픈되었습니다. 다양한 교육 자료와 과정을 이용하실 수 있습니다.',
            priority: 'high',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            title: '새로운 교육 과정 추가',
            content: '클라우드 네이티브 개발 과정이 새롭게 추가되었습니다. 많은 관심과 참여 부탁드립니다.',
            priority: 'medium',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            title: '교육 자료 업데이트',
            content: '최신 기술 트렌드를 반영한 교육 자료들이 업데이트되었습니다.',
            priority: 'low',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        
        let filteredNews = [...dummyNews]
        
        if (params?.priority) {
          filteredNews = filteredNews.filter(n => n.priority === params.priority)
        }
        
        if (params?.is_active !== undefined) {
          filteredNews = filteredNews.filter(n => n.is_active === params.is_active)
        }
        
        if (params?.limit) {
          filteredNews = filteredNews.slice(0, params.limit)
        }
        
        return { data: filteredNews }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 교육 뉴스를 사용합니다.')
      return { data: [] }
    }
  },
  
  // 교육 뉴스 상세 조회
  getById: async (id: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<EducationNews>(`/api/education-news/${id}`)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 교육 뉴스를 사용합니다.')
        const dummyNews: EducationNews = {
          id,
          title: '더미 교육 뉴스',
          content: '이것은 더미 교육 뉴스입니다. 실제 백엔드 서버가 필요합니다.',
          priority: 'medium',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        return { data: dummyNews }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 교육 뉴스를 사용합니다.')
      throw error
    }
  },
  
  // 교육 뉴스 생성
  create: async (news: CreateEducationNewsRequest) => {
    try {
      if (await isBackendAvailable()) {
        return await api.post<EducationNews>('/api/education-news', news)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        const dummyNews: EducationNews = {
          id: Math.floor(Math.random() * 1000),
          ...news,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        return { data: dummyNews }
      }
    } catch (error) {
      console.log('교육 뉴스 생성 실패')
      throw error
    }
  },
  
  // 교육 뉴스 수정
  update: async (id: number, news: UpdateEducationNewsRequest) => {
    try {
      if (await isBackendAvailable()) {
        return await api.put<EducationNews>(`/api/education-news/${id}`, news)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        const dummyNews: EducationNews = {
          id,
          title: news.title || '수정된 제목',
          content: news.content || '수정된 내용',
          priority: news.priority || 'medium',
          is_active: news.is_active !== undefined ? news.is_active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        return { data: dummyNews }
      }
    } catch (error) {
      console.log('교육 뉴스 수정 실패')
      throw error
    }
  },
  
  // 교육 뉴스 삭제
  delete: async (id: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.delete(`/api/education-news/${id}`)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return { data: { message: 'Education news deleted successfully' } }
      }
    } catch (error) {
      console.log('교육 뉴스 삭제 실패')
      throw error
    }
  },
  
  // 우선순위별 교육 뉴스 조회
  getByPriority: async (priority: string, limit?: number) => {
    try {
      if (await isBackendAvailable()) {
        return await api.get<EducationNews[]>(`/api/education-news/priority/${priority}`, {
          params: { limit }
        })
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 교육 뉴스를 사용합니다.')
        const dummyNews: EducationNews[] = [
          {
            id: 1,
            title: `${priority} 우선순위 교육 뉴스`,
            content: `이것은 ${priority} 우선순위의 더미 교육 뉴스입니다.`,
            priority: priority as 'high' | 'medium' | 'low',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        return { data: dummyNews }
      }
    } catch (error) {
      console.log('API 호출 실패, 더미 교육 뉴스를 사용합니다.')
      return { data: [] }
    }
  }
}

export default api