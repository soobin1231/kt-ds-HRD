import axios from 'axios'
import type { Material, MaterialSearchParams } from '@/types/material'
import type { Category } from '@/types/category'
import type { EducationNews, CreateEducationNewsRequest, UpdateEducationNewsRequest } from '@/types/education-news'
import type { ChunkingSettings, PreprocessingOptions, XlsxConfig, ProcessingResponse } from '@/types/embedding'
import { dummyMaterials, dummyCategories } from './dummyData'

// 백엔드 연결 상태 확인 (8001 포트 - 챗봇 서비스)
const isBackendAvailable = async () => {
  try {
    await axios.get('http://localhost:8001/health', { timeout: 2000 })
    return true
  } catch {
    return false
  }
}

// HR Backend API (8000) - 교육자료, 카테고리, 뉴스 등
const hrBackendApi = axios.create({
  baseURL: import.meta.env.VITE_HR_BACKEND_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chatbot Service API (8001) - 임베딩, 벡터 관리 등
const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 기본 API (backward compatibility)
const api = hrBackendApi

// 응답 인터셉터 - HR Backend
hrBackendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HR Backend API Error:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - Chatbot Service
chatbotApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Chatbot API Error:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 기본 API
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

export const educationSystemAPI = {
  // Excel 파일 업로드 및 파싱
  uploadExcel: async (file: File) => {
    try {
      if (await isBackendAvailable()) {
        const formData = new FormData()
        formData.append('file', file)
        
        return await api.post('/api/education-systems/upload-excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return {
          data: {
            message: '더미 데이터: 엑셀 파일에서 3개의 교육제도를 발견했습니다.',
            processed_systems: 3,
            systems: [
              {
                name: '더미 교육제도 1',
                description: '더미 교육제도 설명 1',
                category: 'certification',
                icon: '🏆',
                color: 'bg-yellow-100 text-yellow-800',
                duration: '상세 문의',
                isActive: true,
                targetAudience: ['전체 직원'],
                requirements: ['기본 요구사항 없음'],
                benefits: ['전문성 향상'],
                process: ['상세 과정은 문의 바랍니다']
              }
            ]
          }
        }
      }
    } catch (error) {
      console.log('Excel 파일 업로드 실패')
      throw error
    }
  },
  
  // 교육제도 일괄 생성
  bulkCreate: async (systems: any[]) => {
    try {
      if (await isBackendAvailable()) {
        return await api.post('/api/education-systems/bulk-create', systems)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return {
          data: {
            message: '더미 데이터: 1개의 교육제도가 성공적으로 생성되었습니다.',
            created_count: 1,
            systems: [
              {
                id: 1,
                name: '더미 교육제도',
                description: '더미 교육제도 설명',
                category: 'certification'
              }
            ]
          }
        }
      }
    } catch (error) {
      console.log('교육제도 일괄 생성 실패')
      throw error
    }
  }
}

export const embeddingAPI = {
  // XLSX 파일 업로드 및 임베딩 생성
  uploadXlsx: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions,
    xlsxConfig: XlsxConfig
  ): Promise<{ data: ProcessingResponse }> => {
    try {
      if (await isBackendAvailable()) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify(chunkingSettings))
        formData.append('preprocessing_options', JSON.stringify(preprocessing))
        formData.append('create_embeddings', 'true')
        formData.append('xlsx_config', JSON.stringify(xlsxConfig))
        
        return await chatbotApi.post<ProcessingResponse>('/api/embedding/upload-xlsx', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return {
          data: {
            chunks: Math.floor(Math.random() * 50) + 10,
            success: true,
            message: '더미 데이터: XLSX 파일이 성공적으로 처리되었습니다.',
            fileId: Math.random().toString(36).substr(2, 9)
          }
        }
      }
    } catch (error) {
      console.log('XLSX 파일 업로드 실패')
      throw error
    }
  },

  // 텍스트 파일 (MD, TXT) 업로드 및 임베딩 생성
  uploadText: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions
  ): Promise<{ data: ProcessingResponse }> => {
    try {
      if (await isBackendAvailable()) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify(chunkingSettings))
        formData.append('preprocessing_options', JSON.stringify(preprocessing))
        formData.append('create_embeddings', 'true')
        
        return await chatbotApi.post<ProcessingResponse>('/api/embedding/upload-text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return {
          data: {
            chunks: Math.floor(Math.random() * 100) + 20,
            success: true,
            message: `더미 데이터: ${file.name} 텍스트 파일이 성공적으로 처리되었습니다.`,
            fileId: Math.random().toString(36).substr(2, 9)
          }
        }
      }
    } catch (error) {
      console.log('텍스트 파일 업로드 실패')
      throw error
    }
  },

  // 처리된 파일 상태 조회
  getStatus: async (fileId: string) => {
    try {
      if (await isBackendAvailable()) {
        return await chatbotApi.get(`/api/embedding/status/${fileId}`)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 상태를 반환합니다.')
        return {
          data: {
            status: 'completed',
            progress: 100,
            totalChunks: Math.floor(Math.random() * 50) + 10,
            processedChunks: Math.floor(Math.random() * 50) + 10
          }
        }
      }
    } catch (error) {
      console.log('파일 상태 조회 실패')
      throw error
    }
  },


  // 임베딩 벡터 삭제
  deleteEmbedding: async (fileId: string) => {
    try {
      if (await isBackendAvailable()) {
        return await api.delete(`/api/embedding/${fileId}`)
      } else {
        console.log('백엔드 서버가 연결되지 않아 더미 응답을 반환합니다.')
        return {
          data: {
            success: true,
            message: `더미 데이터: 파일 ${fileId}의 임베딩이 삭제되었습니다.`
          }
        }
      }
    } catch (error) {
      console.log('임베딩 삭제 실패')
      throw error
    }
  },

  // 벡터 관리 페이지용 API들
  // 업로드된 문서 목록 조회
  getVectorDocuments: async () => {
    try {
      return await chatbotApi.get('/api/embedding/documents')
    } catch (error) {
      console.error('문서 목록 조회 실패:', error)
      throw error
    }
  },

  // 벡터 DB 상태 조회 (상세)
  getVectorDbStatus: async () => {
    try {
      return await chatbotApi.get('/api/embedding/vdb-status')
    } catch (error) {
      console.error('벡터 DB 상태 조회 실패:', error)
      throw error
    }
  },

  // 벡터 문서 삭제 (토큰과 벡터 모두 삭제)
  deleteVectorDocument: async (documentId: string) => {
    try {
      return await chatbotApi.delete(`/api/embedding/documents/${documentId}`)
    } catch (error) {
      console.error('벡터 문서 삭제 실패:', error)
      throw error
    }
  },

  // 문서의 청크 목록 조회
  getDocumentChunks: async (documentId: string) => {
    try {
      return await chatbotApi.get(`/api/embedding/documents/${documentId}/chunks`)
    } catch (error) {
      console.error('문서 청크 조회 실패:', error)
      throw error
    }
  },

  // EmbeddingView에서 사용하는 미리보기 및 생성 함수들
  
  // XLSX 청킹 미리보기 (청킹만 수행, 임베딩 생성 안함)
  previewXlsxChunks: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions,
    xlsxConfig: XlsxConfig
  ): Promise<{ data: { chunks: string[] } }> => {
    try {
      if (await isBackendAvailable()) {
        console.log('실제 백엔드 서버를 사용하여 XLSX 청킹을 처리합니다.')
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify({
          chunk_size: chunkingSettings.chunkSize,
          overlap: chunkingSettings.overlap,
          strategy: chunkingSettings.strategy,
          preserve_structure: chunkingSettings.preserveStructure
        }))
        formData.append('preprocessing_options', JSON.stringify({
          remove_empty_lines: preprocessing.removeEmptyLines,
          normalize_spacing: preprocessing.normalizeSpacing,
          remove_markdown: preprocessing.removeMarkdown
        }))
        
        // 백엔드 PreviewResponse 형식으로 응답 받기
        const response = await chatbotApi.post('/api/embedding/preview-xlsx', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        // 백엔드 응답에서 chunk content 추출
        const chunks = response.data.chunks.map((chunk: any) => chunk.content)
        
        return {
            data: { chunks }
        }
      } else {
        throw new Error('백엔드 서버가 연결되지 않습니다. 서버 상태를 확인해주세요.')
      }
    } catch (error) {
      console.error('XLSX 청킹 미리보기 실패:', error)
      throw error
    }
  },

  // 텍스트 청킹 미리보기 (청킹만 수행, 임베딩 생성 안함)
  previewTextChunks: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions
  ): Promise<{ data: { chunks: string[] } }> => {
    try {
      if (await isBackendAvailable()) {
        console.log('실제 백엔드 서버를 사용하여 텍스트 청킹을 처리합니다.')
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify({
          chunk_size: chunkingSettings.chunkSize,
          overlap: chunkingSettings.overlap,
          strategy: chunkingSettings.strategy,
          preserve_structure: chunkingSettings.preserveStructure
        }))
        formData.append('preprocessing_options', JSON.stringify({
          remove_empty_lines: preprocessing.removeEmptyLines,
          normalize_spacing: preprocessing.normalizeSpacing,
          remove_markdown: preprocessing.removeMarkdown
        }))
        
        // 백엔드 PreviewResponse 형식으로 응답 받기
        const response = await chatbotApi.post('/api/embedding/preview-text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        // 백엔드 응답에서 chunk content 추출
        const chunks = response.data.chunks.map((chunk: any) => chunk.content)
        
        return {
            data: { chunks }
        }
      } else {
        throw new Error('백엔드 서버가 연결되지 않습니다. 서버 상태를 확인해주세요.')
      }
    } catch (error) {
      console.error('텍스트 청킹 미리보기 실패:', error)
      throw error
    }
  },

  // XLSX 임베딩 생성 (청킹 후 벡터 생성)
  createXlsxEmbeddings: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions,
    xlsxConfig: XlsxConfig
  ): Promise<{ data: ProcessingResponse & { embeddings: number } }> => {
    try {
      if (await isBackendAvailable()) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify(chunkingSettings))
        formData.append('preprocessing_options', JSON.stringify(preprocessing))
        formData.append('create_embeddings', 'true')
        formData.append('xlsx_config', JSON.stringify(xlsxConfig))
        
        return await chatbotApi.post<ProcessingResponse & { embeddings: number }>('/api/embedding/upload-xlsx', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        throw new Error('백엔드 서버가 연결되지 않습니다. 서버 상태를 확인해주세요.')
      }
    } catch (error) {
      console.log('XLSX 임베딩 생성 실패')
      throw error
    }
  },

  // 텍스트 임베딩 생성 (청킹 후 벡터 생성)
  createTextEmbeddings: async (
    file: File,
    chunkingSettings: ChunkingSettings,
    preprocessing: PreprocessingOptions
  ): Promise<{ data: ProcessingResponse & { embeddings: number } }> => {
    try {
      if (await isBackendAvailable()) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('chunking_settings', JSON.stringify(chunkingSettings))
        formData.append('preprocessing_options', JSON.stringify(preprocessing))
        formData.append('create_embeddings', 'true')
        
        return await chatbotApi.post<ProcessingResponse & { embeddings: number }>('/api/embedding/upload-text', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        throw new Error('백엔드 서버가 연결되지 않습니다. 서버 상태를 확인해주세요.')
      }
    } catch (error) {
      console.log('텍스트 임베딩 생성 실패')
      throw error
    }
  }
}

export { api, hrBackendApi, chatbotApi }
export default api