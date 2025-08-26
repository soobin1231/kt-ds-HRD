<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">교육자료</h1>
      <p class="text-gray-600">우리 회사의 모든 교육자료를 한눈에 확인하세요</p>
    </div>
    
    <!-- 검색 및 필터 -->
    <div class="mb-8">
      <SearchBar 
        ref="searchBarRef"
        :loading="loading"
        @search="handleSearch"
        @clear="handleClear"
      />
    </div>

    <!-- 카테고리 탭 -->
    <div class="mb-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 overflow-x-auto">
          <button
            @click="filterByCategory(null)"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              selectedCategory === null
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            전체
            <span class="ml-2 bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs">
              {{ totalCount }}
            </span>
          </button>
          
          <button
            v-for="category in categories"
            :key="category.id"
            @click="filterByCategory(category.id)"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              selectedCategory === category.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ category.name }}
            <span 
              v-if="category.material_count" 
              class="ml-2 bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs"
            >
              {{ category.material_count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- 정렬 및 뷰 옵션 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <select v-model="sortBy" @change="handleSort" class="input">
          <option value="created_at">최신순</option>
          <option value="download_count">다운로드순</option>
          <option value="view_count">조회순</option>
          <option value="title">제목순</option>
        </select>
        
        <div class="text-sm text-gray-600">
          총 {{ materials.length }}개의 자료
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          @click="viewMode = 'grid'"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'grid' 
              ? 'bg-primary-100 text-primary-600' 
              : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
        </button>
        <button
          @click="viewMode = 'list'"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'list' 
              ? 'bg-primary-100 text-primary-600' 
              : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">자료를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="retryFetch" class="btn-primary">
        다시 시도
      </button>
    </div>

    <!-- 교육자료 목록 -->
    <div v-else>
      <!-- 그리드 뷰 -->
      <div 
        v-if="viewMode === 'grid'" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <MaterialCard
          v-for="material in materials"
          :key="material.id"
          :material="material"
          @download="handleDownload"
        />
      </div>
      
      <!-- 리스트 뷰 -->
      <div v-else class="space-y-4">
        <div
          v-for="material in materials"
          :key="material.id"
          class="card flex items-center justify-between p-4 hover:shadow-md cursor-pointer"
          @click="viewDetail(material.id)"
        >
          <div class="flex items-center flex-1">
            <span class="text-2xl mr-4">{{ getFileIcon(material.mime_type) }}</span>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-gray-900 truncate">{{ material.title }}</h3>
              <p class="text-sm text-gray-600 truncate">{{ material.description || '설명이 없습니다.' }}</p>
              <div class="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>{{ formatFileSize(material.file_size) }}</span>
                <span>{{ formatDate(material.created_at) }}</span>
                <span>👁 {{ material.view_count }}</span>
                <span>⬇ {{ material.download_count }}</span>
              </div>
            </div>
          </div>
          <button
            @click.stop="handleDownload(material)"
            class="btn-primary ml-4"
          >
            다운로드
          </button>
        </div>
      </div>
      
      <!-- 무한 스크롤 로딩 -->
      <div 
        v-if="hasMore && materials.length > 0"
        ref="loadMoreTrigger"
        class="text-center py-8"
      >
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-gray-600 text-sm">더 많은 자료를 불러오는 중...</p>
      </div>
      
      <!-- 빈 상태 -->
      <div v-if="materials.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
        <p class="text-gray-600 mb-4">다른 검색어나 카테고리를 시도해보세요.</p>
        <button @click="handleClear" class="btn-secondary">
          필터 초기화
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaterialsStore } from '@/stores/materials'
import { useCategoriesStore } from '@/stores/categories'
import MaterialCard from '@/components/MaterialCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { formatFileSize, formatDate, getFileIcon } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const materialsStore = useMaterialsStore()
const categoriesStore = useCategoriesStore()

const searchBarRef = ref<InstanceType<typeof SearchBar>>()
const loadMoreTrigger = ref<HTMLElement>()

const selectedCategory = ref<number | null>(null)
const sortBy = ref('created_at')
const viewMode = ref<'grid' | 'list'>('grid')

const materials = computed(() => materialsStore.materials)
const loading = computed(() => materialsStore.loading)
const error = computed(() => materialsStore.error)
const hasMore = computed(() => materialsStore.hasMore)
const categories = computed(() => categoriesStore.categories)
const totalCount = computed(() => materialsStore.totalCount)

const handleSearch = async (query: string, categoryId: number | null) => {
  selectedCategory.value = categoryId
  await materialsStore.fetchMaterials({
    search: query,
    category_id: categoryId || undefined,
    limit: 20,
    offset: 0
  })
}

const handleClear = async () => {
  selectedCategory.value = null
  materialsStore.clearSearch()
  await materialsStore.fetchMaterials({ limit: 20, offset: 0 })
}

const filterByCategory = async (categoryId: number | null) => {
  selectedCategory.value = categoryId
  await materialsStore.filterByCategory(categoryId)
}

const handleSort = async () => {
  // 정렬 로직 구현 (향후 백엔드 API와 연동)
  console.log('Sort by:', sortBy.value)
}

const handleDownload = async (material: any) => {
  try {
    await materialsStore.downloadMaterial(material)
  } catch (error) {
    alert('다운로드에 실패했습니다.')
  }
}

const viewDetail = (id: number) => {
  router.push(`/materials/${id}`)
}

const retryFetch = () => {
  materialsStore.fetchMaterials({ limit: 20, offset: 0 })
}

// 무한 스크롤 설정
const setupInfiniteScroll = () => {
  if (!loadMoreTrigger.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        materialsStore.loadMore()
      }
    },
    { threshold: 0.1 }
  )
  
  observer.observe(loadMoreTrigger.value)
  
  return () => observer.disconnect()
}

// URL 파라미터 처리
const handleRouteParams = () => {
  const { search, category } = route.query
  
  if (search || category) {
    const categoryId = category ? Number(category) : null
    
    // 검색바에 값 설정
    if (searchBarRef.value) {
      if (search) searchBarRef.value.setQuery(String(search))
      if (categoryId) searchBarRef.value.setCategory(categoryId)
    }
    
    // 검색 실행
    handleSearch(String(search || ''), categoryId)
  }
}

watch(() => route.query, handleRouteParams)

watch(loadMoreTrigger, () => {
  nextTick(() => {
    if (loadMoreTrigger.value) {
      setupInfiniteScroll()
    }
  })
})

onMounted(async () => {
  // 카테고리 로드
  await categoriesStore.fetchCategories()
  
  // URL 파라미터 처리
  if (route.query.search || route.query.category) {
    handleRouteParams()
  } else {
    // 기본 자료 로드
    await materialsStore.fetchMaterials({ limit: 20, offset: 0 })
  }
})
</script>