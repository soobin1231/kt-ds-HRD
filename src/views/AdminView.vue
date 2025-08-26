<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">관리자 페이지</h1>
      <p class="text-gray-600">교육자료와 교육 뉴스를 업로드하고 관리할 수 있습니다</p>
    </div>

    <!-- 인증 상태 확인 -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div class="flex-1">
          <h3 class="text-lg font-medium text-yellow-800">관리자 인증이 필요합니다</h3>
          <p class="text-yellow-700 mt-1">
            현재 SSO(Single Sign-On) 연동 기능을 개발 중입니다. 
            완성되면 회사 계정으로 로그인하여 관리자 기능을 사용할 수 있습니다.
          </p>
        </div>
      </div>
    </div>

    <!-- 임시 관리자 기능 (개발용) -->
    <div class="space-y-8">
      <!-- 통계 대시보드 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalMaterials }}</p>
              <p class="text-gray-600">총 교육자료</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalDownloads }}</p>
              <p class="text-gray-600">총 다운로드</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalViews }}</p>
              <p class="text-gray-600">총 조회수</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM11 13.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM4.5 11a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM4.5 4.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalNews }}</p>
              <p class="text-gray-600">총 교육뉴스</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 교육 뉴스 관리 섹션 -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">🔥 교육 뉴스 관리</h2>
          <button 
            @click="showNewsForm = !showNewsForm"
            class="btn-primary"
          >
            {{ showNewsForm ? '닫기' : '새 뉴스 추가' }}
          </button>
        </div>

        <!-- 교육 뉴스 추가 폼 -->
        <div v-if="showNewsForm" class="mb-8">
          <EducationNewsForm
            :loading="newsLoading"
            @submit="handleNewsSubmit"
            @cancel="showNewsForm = false"
          />
        </div>

        <!-- 교육 뉴스 목록 -->
        <div class="space-y-4">
          <div 
            v-for="news in educationNews" 
            :key="news.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4"
            :class="{
              'border-red-400': news.priority === 'high',
              'border-yellow-400': news.priority === 'medium',
              'border-green-400': news.priority === 'low'
            }"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': news.priority === 'high',
                    'bg-yellow-100 text-yellow-800': news.priority === 'medium',
                    'bg-green-100 text-green-800': news.priority === 'low'
                  }"
                >
                  {{ getPriorityText(news.priority) }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(news.created_at) }}
                </span>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ news.title }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2">{{ news.content }}</p>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="toggleNewsStatus(news.id)"
                class="text-sm px-3 py-1 rounded-full transition-colors"
                :class="news.is_active 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ news.is_active ? '활성' : '비활성' }}
              </button>
              <button
                @click="deleteNews(news.id)"
                class="text-red-600 hover:text-red-800 p-1"
                title="삭제"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 교육 뉴스 없음 -->
          <div v-if="educationNews.length === 0" class="text-center py-8 text-gray-500">
            등록된 교육 뉴스가 없습니다.
          </div>
        </div>
      </div>

      <!-- 교육 뉴스 관리 섹션 -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">🔥 교육 뉴스 관리</h2>
          <button 
            @click="showNewsForm = !showNewsForm"
            class="btn-primary"
          >
            {{ showNewsForm ? '닫기' : '새 뉴스 추가' }}
          </button>
        </div>

        <!-- 교육 뉴스 추가 폼 -->
        <div v-if="showNewsForm" class="mb-8">
          <EducationNewsForm
            :loading="newsLoading"
            @submit="handleNewsSubmit"
            @cancel="showNewsForm = false"
          />
        </div>

        <!-- 교육 뉴스 목록 -->
        <div class="space-y-4">
          <div 
            v-for="news in educationNews" 
            :key="news.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4"
            :class="{
              'border-red-400': news.priority === 'high',
              'border-yellow-400': news.priority === 'medium',
              'border-green-400': news.priority === 'low'
            }"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': news.priority === 'high',
                    'bg-yellow-100 text-yellow-800': news.priority === 'medium',
                    'bg-green-100 text-green-800': news.priority === 'low'
                  }"
                >
                  {{ getPriorityText(news.priority) }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(news.created_at) }}
                </span>
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ news.title }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2">{{ news.content }}</p>
            </div>
            
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="toggleNewsStatus(news.id)"
                class="text-sm px-3 py-1 rounded-full transition-colors"
                :class="news.is_active 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ news.is_active ? '활성' : '비활성' }}
              </button>
              <button
                @click="deleteNews(news.id)"
                class="text-red-600 hover:text-red-800 p-1"
                title="삭제"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 교육 뉴스 없음 -->
          <div v-if="educationNews.length === 0" class="text-center py-8 text-gray-500">
            등록된 교육 뉴스가 없습니다.
          </div>
        </div>
      </div>

      <!-- 파일 업로드 섹션 -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">📚 새 교육자료 업로드</h2>
        
        <form @submit.prevent="handleUpload" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                v-model="uploadForm.title"
                type="text"
                required
                class="input w-full"
                placeholder="교육자료 제목을 입력하세요"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select v-model="uploadForm.category_id" class="input w-full">
                <option value="">카테고리 선택</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              v-model="uploadForm.description"
              rows="3"
              class="input w-full resize-none"
              placeholder="교육자료에 대한 설명을 입력하세요"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">태그</label>
            <input
              v-model="uploadForm.tagsInput"
              type="text"
              class="input w-full"
              placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 교육, 안전, 신입사원)"
            />
            <p class="text-xs text-gray-500 mt-1">
              태그는 검색 시 도움이 됩니다. 쉼표(,)로 구분해서 입력하세요.
            </p>
          </div>
          
          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="uploadForm.is_featured"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm font-medium text-gray-700">추천 자료로 설정</span>
            </label>
          </div>
          
          <!-- 파일 드롭존 -->
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
            :class="{ 'border-primary-400 bg-primary-50': isDragOver }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleFileDrop"
          >
            <div v-if="!uploadForm.file">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
              <button
                type="button"
                @click="$refs.fileInput?.click()"
                class="btn-outline"
              >
                파일 선택
              </button>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                @change="handleFileSelect"
              />
            </div>
            
            <div v-else class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div class="flex items-center">
                <span class="text-2xl mr-3">{{ getFileIcon(uploadForm.file.type) }}</span>
                <div>
                  <p class="font-medium text-gray-900">{{ uploadForm.file.name }}</p>
                  <p class="text-sm text-gray-600">{{ formatFileSize(uploadForm.file.size) }}</p>
                </div>
              </div>
              <button
                type="button"
                @click="removeFile"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button type="button" @click="resetForm" class="btn-secondary">
              초기화
            </button>
            <button 
              type="submit" 
              :disabled="uploading || !uploadForm.file || !uploadForm.title"
              class="btn-primary"
            >
              <svg v-if="uploading" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ uploading ? '업로드 중...' : '업로드' }}
            </button>
          </div>
        </form>
      </div>

      <!-- 최근 업로드된 자료 -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">📋 최근 업로드된 자료</h2>
        <div class="space-y-3">
          <div 
            v-for="material in recentMaterials" 
            :key="material.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <span class="text-lg mr-3">{{ getFileIcon(material.mime_type) }}</span>
              <div>
                <p class="font-medium text-gray-900">{{ material.title }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatDate(material.created_at) }} · {{ formatFileSize(material.file_size) }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>👁 {{ material.view_count }}</span>
              <span>⬇ {{ material.download_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useMaterialsStore } from '@/stores/materials'
import { useCategoriesStore } from '@/stores/categories'
import { useEducationNewsStore } from '@/stores/education-news'
import { formatFileSize, formatDate, getFileIcon } from '@/utils/format'
import EducationNewsForm from '@/components/EducationNewsForm.vue'
import type { CreateEducationNewsRequest } from '@/types/education-news'

const materialsStore = useMaterialsStore()
const categoriesStore = useCategoriesStore()
const educationNewsStore = useEducationNewsStore()

const isDragOver = ref(false)
const uploading = ref(false)
const newsLoading = ref(false)
const showNewsForm = ref(false)
const fileInput = ref<HTMLInputElement>()

const uploadForm = reactive({
  title: '',
  description: '',
  category_id: null as number | null,
  tagsInput: '',
  is_featured: false,
  file: null as File | null
})

const categories = computed(() => categoriesStore.categories)
const materials = computed(() => materialsStore.materials)
const educationNews = computed(() => educationNewsStore.news)

const stats = computed(() => {
  const totalMaterials = materials.value.length
  const totalDownloads = materials.value.reduce((sum, m) => sum + m.download_count, 0)
  const totalViews = materials.value.reduce((sum, m) => sum + m.view_count, 0)
  const totalNews = educationNews.value.length
  
  return { totalMaterials, totalDownloads, totalViews, totalNews }
})

const recentMaterials = computed(() => 
  materials.value
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
)

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '높음'
    case 'medium': return '보통'
    case 'low': return '낮음'
    default: return priority
  }
}

const handleNewsSubmit = async (data: CreateEducationNewsRequest) => {
  try {
    newsLoading.value = true
    await educationNewsStore.createNews(data)
    showNewsForm.value = false
    alert('교육 뉴스가 성공적으로 추가되었습니다!')
  } catch (error) {
    console.error('Failed to create news:', error)
    alert('교육 뉴스 추가에 실패했습니다.')
  } finally {
    newsLoading.value = false
  }
}

const toggleNewsStatus = async (id: number) => {
  try {
    await educationNewsStore.toggleNewsStatus(id)
  } catch (error) {
    console.error('Failed to toggle news status:', error)
    alert('상태 변경에 실패했습니다.')
  }
}

const deleteNews = async (id: number) => {
  if (!confirm('정말로 이 교육 뉴스를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    await educationNewsStore.deleteNews(id)
    alert('교육 뉴스가 삭제되었습니다.')
  } catch (error) {
    console.error('Failed to delete news:', error)
    alert('삭제에 실패했습니다.')
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    uploadForm.file = files[0]
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadForm.file = files[0]
  }
}

const removeFile = () => {
  uploadForm.file = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  Object.assign(uploadForm, {
    title: '',
    description: '',
    category_id: null,
    tagsInput: '',
    is_featured: false,
    file: null
  })
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = async () => {
  if (!uploadForm.file || !uploadForm.title) {
    alert('제목과 파일을 입력해주세요.')
    return
  }
  
  try {
    uploading.value = true
    
    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('title', uploadForm.title)
    
    if (uploadForm.description) {
      formData.append('description', uploadForm.description)
    }
    
    if (uploadForm.category_id) {
      formData.append('category_id', uploadForm.category_id.toString())
    }
    
    if (uploadForm.tagsInput) {
      const tags = uploadForm.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
      formData.append('tags', JSON.stringify(tags))
    }
    
    formData.append('is_featured', uploadForm.is_featured.toString())
    
    // API 호출 (실제 구현 시)
    console.log('Upload form data:', Object.fromEntries(formData))
    
    // 임시로 성공 메시지 표시
    alert('교육자료가 성공적으로 업로드되었습니다!')
    resetForm()
    
    // 목록 새로고침
    await materialsStore.fetchMaterials({ limit: 20 })
    
  } catch (error) {
    console.error('Upload failed:', error)
    alert('업로드에 실패했습니다. 다시 시도해주세요.')
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    materialsStore.fetchMaterials({ limit: 20 }),
    categoriesStore.fetchCategories(),
    educationNewsStore.fetchNews()
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>