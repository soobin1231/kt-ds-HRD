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
          @dragover.prevent="handleDragOver"
          @dragenter.prevent="handleDragEnter"
          @dragleave.prevent="handleDragLeave"
          :class="[
            'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 transform',
            dragState === 'dragover' ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' :
            dragState === 'invalid' ? 'border-red-500 bg-red-50 scale-105' :
            'border-gray-300 hover:border-gray-400 hover:scale-102'
          ]"
        >
          <!-- 드래그 상태에 따른 아이콘 -->
          <div class="text-4xl mb-4 transition-all duration-300">
            <span v-if="dragState === 'dragover'">📂</span>
            <span v-else-if="dragState === 'invalid'">⚠️</span>
            <span v-else>📁</span>
          </div>
          
          <!-- 드래그 상태에 따른 메시지 -->
          <p class="text-lg font-medium mb-2 transition-colors duration-300"
             :class="dragState === 'dragover' ? 'text-blue-700' : 
                     dragState === 'invalid' ? 'text-red-700' : 'text-gray-900'">
            <span v-if="dragState === 'dragover'">파일을 여기에 놓으세요!</span>
            <span v-else-if="dragState === 'invalid'">지원되지 않는 파일 형식입니다</span>
            <span v-else>파일을 드래그하거나 클릭하여 업로드</span>
          </p>
          
          <p class="text-sm text-gray-600 mb-2">지원 형식: XLSX, MD, TXT</p>
          <p class="text-xs text-gray-500 mb-4">최대 파일 크기: 10MB</p>
          
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.md,.txt"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <button
            @click="$refs.fileInput.click()"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
          >
            파일 선택
          </button>
        </div>

        <!-- 파일 크기 경고 메시지 -->
        <div v-if="fileSizeWarning" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <span class="text-yellow-600">⚠️</span>
            <p class="text-sm text-yellow-800">{{ fileSizeWarning }}</p>
          </div>
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
                <p v-if="isFileSizeValid" class="text-xs text-green-600">✅ 파일 크기 적합</p>
                <p v-else class="text-xs text-red-600">⚠️ 파일 크기 초과</p>
              </div>
            </div>
            <button
              @click="removeFile"
              class="text-red-500 hover:text-red-700 transition-colors"
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
          :progress-percentage="progressPercentage"
          :current-step="currentStep"
          :total-steps="totalSteps"
          @preview-chunks="previewChunks"
          @create-embeddings="createEmbeddings"
          @start-new-upload="startNewUpload"
          @hide-success-actions="hideSuccessActions"
          @update-chunks="updateChunks"
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
const dragState = ref<'idle' | 'dragover' | 'invalid'>('idle')
const fileSizeWarning = ref<string>('')
const isFileSizeValid = ref(true)
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

// 진행률 상태
const progressPercentage = ref(0)
const currentStep = ref(0)
const totalSteps = ref(1)

// 파일 크기 제한 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

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
  dragState.value = 'idle'
  
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer?.files || [])
  
  if (files.length > 0) {
    const file = files[0]
    if (isValidFileType(file) && file.size <= MAX_FILE_SIZE) {
      dragState.value = 'dragover'
    } else {
      dragState.value = 'invalid'
    }
  }
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer?.files || [])
  
  if (files.length > 0) {
    const file = files[0]
    if (isValidFileType(file) && file.size <= MAX_FILE_SIZE) {
      dragState.value = 'dragover'
    } else {
      dragState.value = 'invalid'
    }
  }
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  // 드래그가 완전히 영역을 벗어났을 때만 상태 초기화
  if (!event.currentTarget?.contains(event.relatedTarget as Node)) {
    dragState.value = 'idle'
  }
}

const handleFileSelect = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  addFiles(files)
}

// 파일 유효성 검사
const isValidFileType = (file: File): boolean => {
  const supportedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/markdown',
    'text/plain'
  ]
  return supportedTypes.includes(file.type)
}

const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE
}

// 파일 추가
const addFiles = (files: File[]) => {
  if (files.length === 0) return
  
  // 첫 번째 파일만 사용
  const file = files[0]
  
  // 파일 크기 검증
  if (!isValidFileSize(file)) {
    fileSizeWarning.value = `파일 크기가 너무 큽니다. 최대 ${formatFileSize(MAX_FILE_SIZE)}까지 업로드 가능합니다.`
    isFileSizeValid.value = false
    addLog('error', `파일 크기 초과: ${file.name} (${formatFileSize(file.size)})`)
    return
  }
  
  // 파일 형식 검증
  if (!isValidFileType(file)) {
    fileSizeWarning.value = '지원되지 않는 파일 형식입니다. XLSX, MD, TXT 파일만 업로드 가능합니다.'
    isFileSizeValid.value = false
    addLog('error', `지원되지 않는 파일 형식: ${file.name}`)
    return
  }
  
  // 모든 검증 통과
  fileSizeWarning.value = ''
  isFileSizeValid.value = true
  
  uploadedFile.value = {
    file,
    name: file.name,
    size: file.size,
    type: file.type
  }
  
  addLog('success', `파일 업로드 완료: ${file.name} (${formatFileSize(file.size)})`)
}

// 파일 제거
const removeFile = () => {
  uploadedFile.value = null
  chunks.value = []
  showEmbeddingButton.value = false
  processingLogs.value = []
  fileSizeWarning.value = ''
  isFileSizeValid.value = true
  dragState.value = 'idle'
}

// 로그 추가
const addLog = (type: LogEntry['type'], message: string) => {
  processingLogs.value.push({
    type,
    message,
    timestamp: new Date()
  })
}

// 청킹 미리보기
const previewChunks = async () => {
  if (!uploadedFile.value) return
  
  isProcessing.value = true
  processingLogs.value = []
  chunks.value = []
  
  // 진행률 초기화
  progressPercentage.value = 0
  currentStep.value = 0
  totalSteps.value = 3
  
  try {
    addLog('info', `${uploadedFile.value.name} 청킹 처리 시작...`)
    currentStep.value = 1
    progressPercentage.value = 33
    
    let response
    
    if (uploadedFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX 파일 처리 API 호출 (청킹만)
      currentStep.value = 2
      progressPercentage.value = 66
      response = await embeddingAPI.previewXlsxChunks(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing,
        xlsxConfig
      )
    } else {
      // 텍스트 파일 처리 API 호출 (청킹만)
      currentStep.value = 2
      progressPercentage.value = 66
      response = await embeddingAPI.previewTextChunks(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing
      )
    }
    
    chunks.value = response.data.chunks
    currentStep.value = 3
    progressPercentage.value = 100
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
    // 진행률 초기화
    setTimeout(() => {
      progressPercentage.value = 0
      currentStep.value = 0
    }, 1000)
  }
}

// 임베딩 생성
const createEmbeddings = async () => {
  if (!uploadedFile.value || chunks.value.length === 0) return
  
  isCreatingEmbeddings.value = true
  processingLogs.value = []
  
  // 진행률 초기화
  progressPercentage.value = 0
  currentStep.value = 0
  totalSteps.value = 4
  
  try {
    addLog('info', `${uploadedFile.value.name} 임베딩 생성 시작...`)
    currentStep.value = 1
    progressPercentage.value = 25
    
    let result
    if (uploadedFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX 파일 임베딩 생성
      currentStep.value = 2
      progressPercentage.value = 50
      result = await embeddingAPI.createXlsxEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing,
        xlsxConfig
      )
    } else {
      // 텍스트 파일 임베딩 생성
      currentStep.value = 2
      progressPercentage.value = 50
      result = await embeddingAPI.createTextEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing
      )
    }
    
    currentStep.value = 3
    progressPercentage.value = 75
    addLog('success', `${uploadedFile.value.name} 임베딩 생성 완료`)
    addLog('info', '벡터 데이터베이스 업데이트 완료')
    
    currentStep.value = 4
    progressPercentage.value = 100
    
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
    // 진행률 초기화
    setTimeout(() => {
      progressPercentage.value = 0
      currentStep.value = 0
    }, 1000)
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
  dragState.value = 'idle'
  fileSizeWarning.value = ''
  isFileSizeValid.value = true
  
  // 진행률 초기화
  progressPercentage.value = 0
  currentStep.value = 0
  totalSteps.value = 1
  
  // 파일 입력 초기화
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const hideSuccessActions = () => {
  showSuccessActions.value = false
  embeddingResult.value = null
}

// 청크 업데이트 처리
const updateChunks = (newChunks: string[]) => {
  chunks.value = newChunks
  addLog('info', `청크가 수동으로 수정되었습니다. 총 ${newChunks.length}개 청크`)
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

/* 호버 효과 */
.hover\:scale-102:hover {
  transform: scale(1.02);
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

/* 드래그 상태 애니메이션 */
.scale-105 {
  transform: scale(1.05);
}

.scale-102 {
  transform: scale(1.02);
}

/* 파일 크기 경고 애니메이션 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.bg-red-50 {
  animation: shake 0.5s ease-in-out;
}
</style>