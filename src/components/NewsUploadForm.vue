<template>
  <div class="space-y-6">
    <!-- 파일 업로드 섹션 -->
    <div class="enhanced-glass-texture rounded-xl p-6">
      <h3 class="text-lg font-luxury-heading text-gray-800 mb-4">파일에서 뉴스 생성</h3>
      <p class="font-luxury-body text-gray-600 mb-6">
        Excel(.xlsx, .xls) 또는 PowerPoint(.pptx, .ppt) 파일을 업로드하면 
        자동으로 제목과 내용을 추출하여 교육 뉴스를 생성합니다.
      </p>
      
      <!-- 파일 드롭존 -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        :class="{ 'border-gray-400 bg-gray-50': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleFileDrop"
      >
        <div v-if="!selectedFile">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="font-luxury-body text-gray-600 mb-2">Excel 또는 PowerPoint 파일을 드래그하거나 클릭하여 업로드</p>
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
            accept=".xlsx,.xls,.pptx,.ppt"
            @change="handleFileSelect"
          />
        </div>
        
        <div v-else class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ getFileIcon(selectedFile.type) }}</span>
            <div>
              <p class="font-luxury-body text-gray-900">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">{{ formatFileSize(selectedFile.size) }}</p>
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
      
      <!-- 우선순위 선택 -->
      <div v-if="selectedFile" class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
        <select v-model="priority" class="input w-full">
          <option value="high">높음 (중요한 공지사항)</option>
          <option value="medium">보통 (일반 교육 안내)</option>
          <option value="low">낮음 (참고 자료)</option>
        </select>
      </div>
      
      <!-- 미리보기 -->
      <div v-if="parsedContent" class="mt-6">
        <h4 class="font-luxury-heading text-gray-800 mb-3">미리보기</h4>
        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">제목:</label>
            <p class="font-luxury-body text-gray-900">{{ parsedContent.title }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">내용:</label>
            <p class="font-luxury-body text-gray-800">{{ parsedContent.content }}</p>
          </div>
        </div>
      </div>
      
      <!-- 액션 버튼 -->
      <div v-if="selectedFile" class="flex justify-end space-x-4 mt-6">
        <button 
          type="button" 
          @click="parseFile"
          :disabled="parsing"
          class="btn-outline"
        >
          <svg v-if="parsing" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ parsing ? '파일 분석 중...' : '파일 분석' }}
        </button>
        <button 
          type="button" 
          @click="createNewsFromFile"
          :disabled="!parsedContent || creating"
          class="btn-primary"
        >
          <svg v-if="creating" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ creating ? '뉴스 생성 중...' : '뉴스 생성' }}
        </button>
      </div>
    </div>
    
    <!-- 수동 입력 폼 -->
    <div class="enhanced-glass-texture rounded-xl p-6">
      <h3 class="text-lg font-luxury-heading text-gray-800 mb-4">수동으로 뉴스 추가</h3>
      
      <form @submit.prevent="handleManualSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            v-model="manualForm.title"
            type="text"
            required
            class="input w-full"
            placeholder="교육 뉴스 제목을 입력하세요"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            v-model="manualForm.content"
            rows="4"
            required
            class="input w-full resize-none"
            placeholder="교육 뉴스 내용을 입력하세요"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
          <select v-model="manualForm.priority" class="input w-full">
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button type="button" @click="resetManualForm" class="btn-secondary">
            초기화
          </button>
          <button 
            type="submit" 
            :disabled="manualCreating"
            class="btn-primary"
          >
            <svg v-if="manualCreating" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ manualCreating ? '생성 중...' : '뉴스 생성' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useEducationNewsStore } from '@/stores/education-news'
import { FileParser, type ParsedContent } from '@/utils/fileParser'
import { formatFileSize, getFileIcon } from '@/utils/format'
import type { CreateEducationNewsRequest } from '@/types/education-news'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const educationNewsStore = useEducationNewsStore()

const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const parsedContent = ref<ParsedContent | null>(null)
const priority = ref<'high' | 'medium' | 'low'>('medium')
const parsing = ref(false)
const creating = ref(false)
const manualCreating = ref(false)

const manualForm = reactive({
  title: '',
  content: '',
  priority: 'medium' as 'high' | 'medium' | 'low'
})

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    parsedContent.value = null
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    parsedContent.value = null
  }
}

const removeFile = () => {
  selectedFile.value = null
  parsedContent.value = null
}

const parseFile = async () => {
  if (!selectedFile.value) return
  
  try {
    parsing.value = true
    parsedContent.value = await FileParser.parseFile(selectedFile.value)
    console.log('File parsed successfully:', parsedContent.value)
  } catch (error) {
    console.error('File parsing error:', error)
    const errorMessage = error instanceof Error ? error.message : '파일 분석에 실패했습니다.'
    alert(`파일 분석에 실패했습니다: ${errorMessage}`)
  } finally {
    parsing.value = false
  }
}

const createNewsFromFile = async () => {
  if (!parsedContent.value || !selectedFile.value) return
  
  try {
    creating.value = true
    console.log('Creating news from file:', selectedFile.value.name, priority.value)
    await educationNewsStore.createNewsFromFile(selectedFile.value, priority.value)
    alert('파일에서 교육 뉴스가 성공적으로 생성되었습니다!')
    emit('success')
    resetFileForm()
  } catch (error) {
    console.error('News creation error:', error)
    const errorMessage = error instanceof Error ? error.message : '뉴스 생성에 실패했습니다.'
    alert(`뉴스 생성에 실패했습니다: ${errorMessage}`)
  } finally {
    creating.value = false
  }
}

const handleManualSubmit = async () => {
  try {
    manualCreating.value = true
    
    const newsData: CreateEducationNewsRequest = {
      title: manualForm.title,
      content: manualForm.content,
      priority: manualForm.priority,
      is_active: true
    }
    
    await educationNewsStore.createNews(newsData)
    alert('교육 뉴스가 성공적으로 생성되었습니다!')
    emit('success')
    resetManualForm()
  } catch (error) {
    console.error('Manual news creation error:', error)
    alert('뉴스 생성에 실패했습니다.')
  } finally {
    manualCreating.value = false
  }
}

const resetFileForm = () => {
  selectedFile.value = null
  parsedContent.value = null
  priority.value = 'medium'
}

const resetManualForm = () => {
  manualForm.title = ''
  manualForm.content = ''
  manualForm.priority = 'medium'
}
</script>
