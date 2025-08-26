<template>
  <div class="card group cursor-pointer" @click="viewDetail">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center mb-2">
          <span class="text-2xl mr-2">{{ getFileIcon(material.mime_type) }}</span>
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {{ material.title }}
          </h3>
        </div>
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ material.description || '설명이 없습니다.' }}
        </p>
      </div>
      
      <span 
        v-if="material.is_featured" 
        class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium"
      >
        추천
      </span>
    </div>
    
    <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
      <div class="flex items-center space-x-3">
        <span>{{ formatFileSize(material.file_size) }}</span>
        <span>{{ formatDate(material.created_at) }}</span>
        <span v-if="categoryName" class="px-2 py-1 bg-gray-100 rounded text-gray-700">
          {{ categoryName }}
        </span>
      </div>
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4 text-sm text-gray-500">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          {{ material.view_count }}
        </span>
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ material.download_count }}
        </span>
      </div>
      
      <button 
        @click.stop="$emit('download', material)" 
        class="btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        다운로드
      </button>
    </div>
    
    <!-- Tags -->
    <div v-if="material.tags && material.tags.length > 0" class="mt-3">
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="tag in material.tags.slice(0, 3)" 
          :key="tag"
          class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
        >
          #{{ tag }}
        </span>
        <span 
          v-if="material.tags.length > 3"
          class="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
        >
          +{{ material.tags.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriesStore } from '@/stores/categories'
import type { Material } from '@/types/material'
import { formatFileSize, formatDate, getFileIcon } from '@/utils/format'

const props = defineProps<{
  material: Material
}>()

defineEmits<{
  download: [material: Material]
}>()

const router = useRouter()
const categoriesStore = useCategoriesStore()

const categoryName = computed(() => {
  return props.material.category_id 
    ? categoriesStore.getCategoryName(props.material.category_id)
    : null
})

const viewDetail = () => {
  router.push(`/materials/${props.material.id}`)
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>