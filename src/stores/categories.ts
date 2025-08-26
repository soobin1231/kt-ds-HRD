import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoryAPI } from '@/services/api'
import type { Category } from '@/types/category'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await categoryAPI.getAll()
      categories.value = response.data.filter(cat => cat.is_active)
    } catch (err: any) {
      error.value = err.response?.data?.message || '카테고리를 불러오는데 실패했습니다.'
      console.error('Failed to fetch categories:', err)
    } finally {
      loading.value = false
    }
  }

  const getCategoryById = (id: number): Category | undefined => {
    return categories.value.find(cat => cat.id === id)
  }

  const getCategoryName = (id: number): string => {
    const category = getCategoryById(id)
    return category?.name || '기타'
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryById,
    getCategoryName,
  }
})