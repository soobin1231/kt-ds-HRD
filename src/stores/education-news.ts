import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EducationNews, CreateEducationNewsRequest, UpdateEducationNewsRequest } from '@/types/education-news'
import { educationNewsAPI } from '@/services/api'
import { FileParser, type ParsedContent } from '@/utils/fileParser'

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
      
      const response = await educationNewsAPI.getAll({ is_active: true })
      news.value = response.data
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
      
      const response = await educationNewsAPI.create(data)
      const newNews = response.data
      
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
      
      const response = await educationNewsAPI.update(id, data)
      const updatedNews = response.data
      
      const index = news.value.findIndex(n => n.id === id)
      if (index !== -1) {
        news.value[index] = updatedNews
      }
      
      return updatedNews
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
      
      await educationNewsAPI.delete(id)
      
      const index = news.value.findIndex(n => n.id === id)
      if (index !== -1) {
        news.value.splice(index, 1)
      }
    } catch (err: any) {
      error.value = err.message || '교육 뉴스 삭제에 실패했습니다.'
      console.error('Failed to delete education news:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createNewsFromFile = async (file: File, priority: 'high' | 'medium' | 'low' = 'medium') => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Starting file parsing for:', file.name)
      
      // 파일 파싱
      const parsedContent = await FileParser.parseFile(file)
      console.log('File parsed successfully:', parsedContent)
      
      // 뉴스 생성
      const newNews: EducationNews = {
        id: Date.now(),
        title: parsedContent.title,
        content: parsedContent.content,
        priority,
        is_active: true,
        created_at: new Date().toISOString()
      }
      
      console.log('Creating news:', newNews)
      news.value.unshift(newNews)
      return newNews
    } catch (err: any) {
      console.error('createNewsFromFile error:', err)
      error.value = err.message || '파일에서 교육 뉴스 생성에 실패했습니다.'
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
    createNewsFromFile,
    updateNews,
    deleteNews,
    toggleNewsStatus
  }
})
