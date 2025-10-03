<template>
  <div class="embedding-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- 헤더 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">📚</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Document Embedding</h1>
            <p class="text-gray-600">문서를 업로드하고 벡터 임베딩을 생성하여 EduBot의 지식 기반을 구축합니다</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <!-- 파일 업로드 영역 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">파일 업로드</h2>
        
        <!-- 파일 드래그 앤 드롭 영역 -->
        <div
          @drop="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <div class="text-4xl mb-4">📁</div>
          <p class="text-lg font-medium text-gray-900 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
          <p class="text-sm text-gray-600 mb-4">지원 형식: XLSX, MD, TXT</p>
          
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.md,.txt"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <button
            @click="$refs.fileInput.click()"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            파일 선택
          </button>
        </div>

        <!-- 업로드된 파일 -->
        <div v-if="uploadedFile" class="mt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">업로드된 파일</h3>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="text-lg">{{ getFileIcon(uploadedFile.type) }}</span>
              <div>
                <p class="font-medium text-gray-900">{{ uploadedFile.name }}</p>
                <p class="text-sm text-gray-600">{{ formatFileSize(uploadedFile.size) }}</p>
              </div>
            </div>
            <button
              @click="removeFile"
              class="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- 청킹 설정 -->
      <div class="mt-6">
        <ChunkingSettings v-model:settings="chunkingSettings" />
      </div>

      <!-- 청킹 미리보기 -->
      <div class="mt-6">
        <ChunkPreview 
          :chunks="chunks" 
          :is-processing="isProcessing"
          :uploaded-file="uploadedFile"
          :chunking-settings="chunkingSettings"
          :xlsx-config="xlsxConfig"
          :preprocessing="preprocessing"
          :is-creating-embeddings="isCreatingEmbeddings"
          :show-embedding-button="showEmbeddingButton"
          :processing-logs="processingLogs"
          :show-success-actions="showSuccessActions"
          :embedding-result="embeddingResult"
          @preview-chunks="previewChunks"
          @create-embeddings="createEmbeddings"
          @start-new-upload="startNewUpload"
          @hide-success-actions="hideSuccessActions"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { embeddingAPI } from '@/services/api'
import ChunkingSettings from '@/components/ChunkingSettings.vue'
import ChunkPreview from '@/components/ChunkPreview.vue'
import type { ChunkingSettings as ChunkingSettingsType } from '@/types/embedding'

interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
}

interface LogEntry {
  type: 'info' | 'success' | 'error'
  message: string
  timestamp: Date
}

// 사용자 정의 인터페이스 (API와 동일하게 유지)

// 상태 관리
const uploadedFile = ref<UploadedFile | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const isCreatingEmbeddings = ref(false)
const showEmbeddingButton = ref(false)
const processingLogs = ref<LogEntry[]>([])
const fileInput = ref<HTMLInputElement>()
const chunks = ref<string[]>([])
const showSuccessActions = ref(false)
const embeddingResult = ref<{
  fileName: string
  chunks: number
  fileId: string
} | null>(null)

// 청킹 설정 - 자동 최적화 활성화 (기본값)
const chunkingSettings = reactive<ChunkingSettingsType>({
  autoOptimize: true,
  chunkSize: 500,  // 수동 모드용 기본값
  overlap: 100     // 수동 모드용 기본값
})

// XLSX 설정
const xlsxConfig = reactive({
  ruleType: 'auto'
})

// 전처리 설정
const preprocessing = reactive({
  removeEmptyLines: true,
  normalizeSpacing: true,
  removeMarkdown: false
})

// 파일 아이콘 매핑
const getFileIcon = (fileType: string) => {
  const iconMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/markdown': '📝',
    'text/plain': '📄'
  }
  return iconMap[fileType] || '📁'
}

// 파일 크기 포맷팅
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 파일 드래그 앤 드롭 처리
const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

const handleFileSelect = (event: DragEvent) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  addFiles(files)
}

// 파일 추가
const addFiles = (files: File[]) => {
  if (files.length === 0) return
  
  // 첫 번째 파일만 사용
  const file = files[0]
  
  // 지원되는 파일 형식 확인
  const supportedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/markdown',
    'text/plain'
  ]
  
  if (!supportedTypes.includes(file.type)) {
    alert('지원되지 않는 파일 형식입니다. XLSX, MD, TXT 파일만 업로드 가능합니다.')
    return
  }
  
  uploadedFile.value = {
    file,
    name: file.name,
    size: file.size,
    type: file.type
  }
  
  addLog('success', `파일 업로드 완료: ${file.name}`)
}

// 파일 제거
const removeFile = () => {
  uploadedFile.value = null
  chunks.value = []
  showEmbeddingButton.value = false
  processingLogs.value = []
}

// 로그 추가
const addLog = (type: LogEntry['type'], message: string) => {
  processingLogs.value.push({
    type,
    message,
    timestamp: new Date()
  })
}

// 파일 드래그 오버 상태 관리
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

// 청킹 미리보기
const previewChunks = async () => {
  if (!uploadedFile.value) return
  
  isProcessing.value = true
  processingLogs.value = []
  chunks.value = []
  
  try {
    addLog('info', `${uploadedFile.value.name} 청킹 처리 시작...`)
    
    let response
    
    if (uploadedFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX 파일 처리 API 호출 (청킹만)
      response = await embeddingAPI.previewXlsxChunks(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing,
        xlsxConfig
      )
    } else {
      // 텍스트 파일 처리 API 호출 (청킹만)
      response = await embeddingAPI.previewTextChunks(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing
      )
    }
    
    chunks.value = response.data.chunks
    addLog('success', `${uploadedFile.value.name} 청킹 완료`)
    addLog('info', `생성된 청크: ${chunks.value.length}개`)
    showEmbeddingButton.value = true
    
  } catch (error: any) {
    console.error('청킹 처리 오류:', error)
    
    // 더 자세한 에러 메시지 추출
    let errorMessage = '알 수 없는 오류가 발생했습니다.'
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    addLog('error', `❌ 청킹 처리 실패: ${errorMessage}`)
  } finally {
    isProcessing.value = false
  }
}

// 임베딩 생성
const createEmbeddings = async () => {
  if (!uploadedFile.value || chunks.value.length === 0) return
  
  isCreatingEmbeddings.value = true
  processingLogs.value = []
  
  try {
    addLog('info', `${uploadedFile.value.name} 임베딩 생성 시작...`)
    
    let result
    if (uploadedFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX 파일 임베딩 생성
      result = await embeddingAPI.createXlsxEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing,
        xlsxConfig
      )
    } else {
      // 텍스트 파일 임베딩 생성
      result = await embeddingAPI.createTextEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing
      )
    }
    
    addLog('success', `${uploadedFile.value.name} 임베딩 생성 완료`)
    addLog('info', '벡터 데이터베이스 업데이트 완료')
    
    // 성공 후 액션 표시
    showSuccessActions.value = true
    embeddingResult.value = {
      fileName: uploadedFile.value.name,
      chunks: result.data.chunks_created || 0,
      fileId: result.data.file_id
    }
    
  } catch (error: any) {
    console.error('임베딩 생성 오류:', error)
    
    // 더 자세한 에러 메시지 추출
    let errorMessage = '알 수 없는 오류가 발생했습니다.'
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    addLog('error', `❌ 임베딩 생성 실패: ${errorMessage}`)
    
    // 네트워크 오류나 서버 연결 문제인 경우 추가 안내
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      addLog('error', '서버 연결을 확인해주세요. 백엔드 서버가 실행 중인지 확인하세요.')
    }
  } finally {
    isCreatingEmbeddings.value = false
  }
}

// 성공 액션 함수들
const startNewUpload = () => {
  // 모든 상태 초기화
  uploadedFile.value = null
  chunks.value = []
  showEmbeddingButton.value = false
  showSuccessActions.value = false
  embeddingResult.value = null
  processingLogs.value = []
  isProcessing.value = false
  isCreatingEmbeddings.value = false
  isDragging.value = false
  
  // 파일 입력 초기화
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const hideSuccessActions = () => {
  showSuccessActions.value = false
  embeddingResult.value = null
}
</script>

<style scoped>
.embedding-container {
  min-height: 100vh;
}

/* 드래그 앤 드롭 영역 스타일링 */
.border-dashed {
  border-style: dashed;
}

/* 파일 아이콘 설정 */
.file-icon {
  font-size: 1.5rem;
}

/* 반응형 레이아웃 */
@media (max-width: 768px) {
  .max-w-4xl {
    max-width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 폰트 최적화 */
.font-medium {
  font-weight: 500;
}

/* 트랜지션 효과 */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>