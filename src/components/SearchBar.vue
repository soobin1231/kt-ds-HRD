<template>
  <div class="relative">
    <div class="flex items-center space-x-4">
      <!-- 검색 입력 -->
      <div class="flex-1 relative">
        <svg 
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="교육자료를 검색해보세요..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
      
      <!-- 카테고리 필터 -->
      <select 
        v-model="selectedCategory" 
        @change="handleCategoryChange"
        class="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[150px]"
      >
        <option value="">전체 카테고리</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <!-- 검색 버튼 -->
      <button 
        @click="handleSearch"
        class="btn-primary px-6 py-3"
        :disabled="loading"
      >
        <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span v-else>검색</span>
      </button>
      
      <!-- 필터 초기화 -->
      <button 
        v-if="hasFilters"
        @click="clearFilters" 
        class="btn-secondary"
      >
        초기화
      </button>
    </div>
    
    <!-- 필터 요약 -->
    <div v-if="hasFilters" class="mt-3 flex items-center space-x-2 text-sm text-gray-600">
      <span>필터:</span>
      <span v-if="searchQuery" class="px-2 py-1 bg-blue-50 text-blue-700 rounded">
        검색: "{{ searchQuery }}"
      </span>
      <span v-if="selectedCategory" class="px-2 py-1 bg-green-50 text-green-700 rounded">
        카테고리: {{ getCategoryName(selectedCategory) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCategoriesStore } from '@/stores/categories'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  search: [query: string, categoryId: number | null]
  clear: []
}>()

const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.categories)

const searchQuery = ref('')
const selectedCategory = ref<number | string>('')

const hasFilters = computed(() => {
  return searchQuery.value.trim() || selectedCategory.value
})

const handleSearch = () => {
  const categoryId = selectedCategory.value ? Number(selectedCategory.value) : null
  emit('search', searchQuery.value.trim(), categoryId)
}

const handleCategoryChange = () => {
  handleSearch()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  emit('clear')
}

const getCategoryName = (id: number | string): string => {
  return categoriesStore.getCategoryName(Number(id))
}

// 외부에서 필터 상태 설정 가능하도록 노출
defineExpose({
  setQuery: (query: string) => {
    searchQuery.value = query
  },
  setCategory: (categoryId: number | null) => {
    selectedCategory.value = categoryId || ''
  },
  clearFilters
})
</script>