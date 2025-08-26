import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EducationNews, CreateEducationNewsRequest, UpdateEducationNewsRequest } from '@/types/education-news'

export const useEducationNewsStore = defineStore('educationNews', () => {
  const news = ref<EducationNews[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeNews = computed(() => 
    news.value.filter(n => n.is_active).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  )

  const highPriorityNews = computed(() => 
    activeNews.value.filter(n => n.priority === 'high')
  )

  const fetchNews = async () => {
    try {
      loading.value = true
      error.value = null
      
      // 임시 데이터 (실제로는 API 호출)
      const mockData: EducationNews[] = [
        {
          id: 1,
          title: '데이터 사이언스 기초 교육',
          content: 'Python, R, SQL을 활용한 데이터 분석 기초 과정을 시작합니다. 모든 직원 대상으로 진행됩니다.',
          priority: 'high',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'AI 윤리 및 가이드라인',
          content: 'AI 기술 활용 시 고려해야 할 윤리적 문제와 회사 내 가이드라인을 안내합니다.',
          priority: 'high',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: '클라우드 인프라 교육',
          content: 'AWS, Azure, GCP 등 주요 클라우드 플랫폼 활용법을 학습합니다.',
          priority: 'medium',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]
      
      news.value = mockData
    } catch (err: any) {
      error.value = err.message || '교육 뉴스를 불러오는데 실패했습니다.'
      console.error('Failed to fetch education news:', err)
    } finally {
      loading.value = false
    }
  }

  const createNews = async (data: CreateEducationNewsRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const newNews: EducationNews = {
        id: Date.now(),
        ...data,
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString()
      }
      
      news.value.unshift(newNews)
      return newNews
    } catch (err: any) {
      error.value = err.message || '교육 뉴스 생성에 실패했습니다.'
      console.error('Failed to create education news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNews = async (id: number, data: UpdateEducationNewsRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const index = news.value.findIndex(n => n.id === id)
      if (index === -1) {
        throw new Error('교육 뉴스를 찾을 수 없습니다.')
      }
      
      news.value[index] = {
        ...news.value[index],
        ...data,
        updated_at: new Date().toISOString()
      }
      
      return news.value[index]
    } catch (err: any) {
      error.value = err.message || '교육 뉴스 수정에 실패했습니다.'
      console.error('Failed to update education news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNews = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      const index = news.value.findIndex(n => n.id === id)
      if (index === -1) {
        throw new Error('교육 뉴스를 찾을 수 없습니다.')
      }
      
      news.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message || '교육 뉴스 삭제에 실패했습니다.'
      console.error('Failed to delete education news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleNewsStatus = async (id: number) => {
    try {
      const newsItem = news.value.find(n => n.id === id)
      if (newsItem) {
        await updateNews(id, { is_active: !newsItem.is_active })
      }
    } catch (err: any) {
      console.error('Failed to toggle news status:', err)
    }
  }

  return {
    news,
    loading,
    error,
    activeNews,
    highPriorityNews,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    toggleNewsStatus
  }
})
