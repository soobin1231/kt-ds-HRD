<template>
  <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- 뒤로가기 버튼 -->
    <div class="mb-6">
      <button @click="$router.back()" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        뒤로가기
      </button>
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
      <h3 class="text-lg font-medium text-gray-900 mb-2">자료를 불러올 수 없습니다</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchMaterial" class="btn-primary">
        다시 시도
      </button>
    </div>

    <!-- 자료 상세 정보 -->
    <div v-else-if="material" class="space-y-8">
      <!-- 헤더 정보 -->
      <div class="card">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <div class="flex items-center mb-4">
              <span class="text-4xl mr-4">{{ getFileIcon(material.mime_type) }}</span>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ material.title }}</h1>
                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>{{ formatFileSize(material.file_size) }}</span>
                  <span>{{ formatDateTime(material.created_at) }}</span>
                  <span v-if="categoryName" class="px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {{ categoryName }}
                  </span>
                </div>
              </div>
            </div>
            
            <p v-if="material.description" class="text-gray-700 text-lg leading-relaxed">
              {{ material.description }}
            </p>
            <p v-else class="text-gray-500 italic">
              설명이 없습니다.
            </p>
          </div>
          
          <div class="ml-6 flex flex-col items-end space-y-2">
            <span 
              v-if="material.is_featured" 
              class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
            >
              ⭐ 추천
            </span>
          </div>
        </div>

        <!-- 통계 정보 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ material.view_count }}</div>
            <div class="text-sm text-gray-600">조회수</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ material.download_count }}</div>
            <div class="text-sm text-gray-600">다운로드</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ formatFileSize(material.file_size) }}</div>
            <div class="text-sm text-gray-600">파일 크기</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-gray-900">{{ getMimeTypeLabel(material.mime_type) }}</div>
            <div class="text-sm text-gray-600">파일 형식</div>
          </div>
        </div>

        <!-- 태그 -->
        <div v-if="material.tags && material.tags.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">태그</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in material.tags" 
              :key="tag"
              class="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium cursor-pointer hover:bg-blue-100 transition-colors"
              @click="searchByTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- 다운로드 버튼 -->
        <div class="flex justify-center">
          <button 
            @click="downloadMaterial"
            :disabled="downloading"
            class="btn-primary px-8 py-3 text-lg"
          >
            <svg v-if="downloading" class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ downloading ? '다운로드 중...' : '다운로드' }}
          </button>
        </div>
      </div>

      <!-- 파일 정보 -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">파일 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="font-medium text-gray-700">원본 파일명</dt>
            <dd class="text-gray-900">{{ material.original_file_name }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-700">MIME 타입</dt>
            <dd class="text-gray-900">{{ material.mime_type }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-700">업로드 일시</dt>
            <dd class="text-gray-900">{{ formatDateTime(material.created_at) }}</dd>
          </div>
          <div v-if="material.updated_at && material.updated_at !== material.created_at">
            <dt class="font-medium text-gray-700">수정 일시</dt>
            <dd class="text-gray-900">{{ formatDateTime(material.updated_at) }}</dd>
          </div>
        </div>
      </div>

      <!-- 관련 자료 -->
      <div v-if="relatedMaterials.length > 0" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">관련 자료</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="related in relatedMaterials"
            :key="related.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="goToMaterial(related.id)"
          >
            <div class="flex items-center mb-2">
              <span class="text-xl mr-2">{{ getFileIcon(related.mime_type) }}</span>
              <h3 class="font-medium text-gray-900 truncate flex-1">{{ related.title }}</h3>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2">{{ related.description || '설명이 없습니다.' }}</p>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{{ formatFileSize(related.file_size) }}</span>
              <div class="flex items-center space-x-2">
                <span>👁 {{ related.view_count }}</span>
                <span>⬇ {{ related.download_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaterialsStore } from '@/stores/materials'
import { useCategoriesStore } from '@/stores/categories'
import { formatFileSize, formatDateTime, getFileIcon } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const materialsStore = useMaterialsStore()
const categoriesStore = useCategoriesStore()

const downloading = ref(false)

const material = computed(() => materialsStore.currentMaterial)
const loading = computed(() => materialsStore.loading)
const error = computed(() => materialsStore.error)

const categoryName = computed(() => {
  return material.value?.category_id 
    ? categoriesStore.getCategoryName(material.value.category_id)
    : null
})

const relatedMaterials = computed(() => {
  if (!material.value) return []
  
  return materialsStore.materials
    .filter(m => 
      m.id !== material.value!.id && 
      (m.category_id === material.value!.category_id || 
       (material.value!.tags && material.value!.tags.some(tag => 
         m.tags?.includes(tag)
       )))
    )
    .slice(0, 6)
})

const getMimeTypeLabel = (mimeType: string): string => {
  const types: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'video/mp4': 'MP4',
    'audio/mpeg': 'MP3',
  }
  
  return types[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'Unknown'
}

const fetchMaterial = async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    router.push('/404')
    return
  }
  
  try {
    await materialsStore.fetchMaterialById(id)
  } catch (error) {
    console.error('Failed to fetch material:', error)
  }
}

const downloadMaterial = async () => {
  if (!material.value) return
  
  try {
    downloading.value = true
    await materialsStore.downloadMaterial(material.value)
  } catch (error) {
    alert('다운로드에 실패했습니다.')
  } finally {
    downloading.value = false
  }
}

const searchByTag = (tag: string) => {
  router.push({
    name: 'Materials',
    query: { search: tag }
  })
}

const goToMaterial = (id: number) => {
  router.push(`/materials/${id}`)
}

watch(() => route.params.id, fetchMaterial, { immediate: true })

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    materialsStore.fetchMaterials({ limit: 50 }) // 관련 자료 표시용
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>