import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { materialAPI } from '@/services/api'
import type { Material, MaterialSearchParams } from '@/types/material'

export const useMaterialsStore = defineStore('materials', () => {
  const materials = ref<Material[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentMaterial = ref<Material | null>(null)

  // 검색 상태
  const searchParams = ref<MaterialSearchParams>({})
  const hasMore = ref(true)

  const totalCount = computed(() => materials.value.length)
  const featuredMaterials = computed(() => 
    materials.value.filter(m => m.is_featured).slice(0, 6)
  )

  const fetchMaterials = async (params?: MaterialSearchParams, append = false) => {
    try {
      loading.value = true
      error.value = null
      
      const searchQuery = { ...searchParams.value, ...params }
      const response = await materialAPI.getAll(searchQuery)
      
      if (append) {
        materials.value = [...materials.value, ...response.data]
      } else {
        materials.value = response.data
      }
      
      // 더 불러올 데이터가 있는지 확인
      hasMore.value = response.data.length === (searchQuery.limit || 20)
      
      searchParams.value = searchQuery
    } catch (err: any) {
      error.value = err.response?.data?.message || '자료를 불러오는데 실패했습니다.'
      console.error('Failed to fetch materials:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMaterialById = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialAPI.getById(id)
      currentMaterial.value = response.data
      
      // 조회수 증가
      await materialAPI.incrementViewCount(id)
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || '자료를 불러오는데 실패했습니다.'
      console.error('Failed to fetch material:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadMaterial = async (material: Material) => {
    try {
      await materialAPI.download(material.id, material.original_file_name)
      
      // 다운로드 카운트 업데이트 (로컬)
      const index = materials.value.findIndex(m => m.id === material.id)
      if (index !== -1) {
        materials.value[index].download_count += 1
      }
      
      if (currentMaterial.value?.id === material.id) {
        currentMaterial.value.download_count += 1
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '다운로드에 실패했습니다.'
      console.error('Failed to download material:', err)
      throw err
    }
  }

  const searchMaterials = async (query: string) => {
    await fetchMaterials({ search: query, offset: 0 })
  }

  const filterByCategory = async (categoryId: number | null) => {
    await fetchMaterials({ 
      category_id: categoryId || undefined, 
      offset: 0 
    })
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    
    await fetchMaterials({
      ...searchParams.value,
      offset: materials.value.length
    }, true)
  }

  const clearSearch = () => {
    searchParams.value = {}
    materials.value = []
    hasMore.value = true
  }

  return {
    materials,
    loading,
    error,
    currentMaterial,
    searchParams,
    hasMore,
    totalCount,
    featuredMaterials,
    fetchMaterials,
    fetchMaterialById,
    downloadMaterial,
    searchMaterials,
    filterByCategory,
    loadMore,
    clearSearch,
  }
})