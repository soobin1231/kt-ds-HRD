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

    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 파일 업로드 영역 -->
        <div class="lg:col-span-2">
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
            <ChunkPreview :chunks="chunks" :is-processing="isProcessing" />
          </div>
        </div>

        <!-- 설정 및 처리 영역 -->
        <div class="space-y-6">
          <!-- 처리 옵션 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">처리 옵션</h3>
            
            <!-- 파일 타입별 옵션 -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">XLSX 규칙 설정</label>
                <select v-model="xlsxConfig.ruleType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="auto">자동 감지</option>
                  <option value="course">교육과정 정보</option>
                  <option value="news">교육 뉴스</option>
                  <option value="system">교육제도</option>
                  <option value="material">학습자료</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">텍스트 전처리</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="checkbox" v-model="preprocessing.removeEmptyLines" class="mr-2" />
                    <span class="text-sm">빈 줄 제거</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="preprocessing.normalizeSpacing" class="mr-2" />
                    <span class="text-sm">공백 정규화</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" v-model="preprocessing.removeMarkdown" class="mr-2" />
                    <span class="text-sm">마크다운 문법 제거</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 처리 버튼들 -->
            <div class="space-y-3 mt-6">
              <button
                @click="previewChunks"
                :disabled="!uploadedFile || isProcessing"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-medium transition-colors',
                  !uploadedFile || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                ]"
              >
                <span v-if="isProcessing">처리 중...</span>
                <span v-else>청킹 미리보기</span>
              </button>
              
              <button
                v-if="showEmbeddingButton"
                @click="createEmbeddings"
                :disabled="chunks.length === 0 || isCreatingEmbeddings"
                :class="[
                  'w-full px-4 py-3 rounded-lg font-medium transition-colors',
                  chunks.length === 0 || isCreatingEmbeddings
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                ]"
              >
                <span v-if="isCreatingEmbeddings">임베딩 생성 중...</span>
                <span v-else>임베딩 생성</span>
              </button>

              <!-- 벡터 관리 페이지 링크 -->
              <router-link 
                to="/vector-management"
                class="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 text-center inline-block"
              >
                🗂️ 벡터 관리 페이지
              </router-link>
            </div>
          </div>

          <!-- 처리 상태 -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">처리 상태</h3>
            <div class="space-y-3">
              <div v-if="processingLogs.length > 0" class="max-h-60 overflow-y-auto">
                <div
                  v-for="(log, index) in processingLogs"
                  :key="index"
                  :class="[
                    'p-2 rounded text-sm',
                    log.type === 'success' ? 'bg-green-50 text-green-800' :
                    log.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
                  ]"
                >
                  {{ log.message }}
                </div>
              </div>
              <div v-else class="text-gray-500 text-sm">업로드된 파일을 처리할 준비가 되었습니다.</div>
            </div>
          </div>
        </div>
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

// 청킹 설정
const chunkingSettings = reactive<ChunkingSettingsType>({
  chunkSize: 1000,
  overlap: 200,
  strategy: 'word',
  preserveStructure: true
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
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'text/markdown', // md
    'text/plain' // txt
  ]
  
  const validFile = files.find(file => allowedTypes.includes(file.type))
  
  if (validFile) {
    uploadedFile.value = {
      file: validFile,
      name: validFile.name,
      size: validFile.size,
      type: validFile.type
    }
    // 새 파일이 업로드되면 이전 청킹 결과 초기화
    chunks.value = []
    showEmbeddingButton.value = false
  }
  
  if (!validFile && files.length > 0) {
    addLog('warning', '지원되지 않는 파일 형식입니다. (지원: XLSX, MD, TXT)')
  }
}

// 파일 제거
const removeFile = () => {
  uploadedFile.value = null
  chunks.value = []
  showEmbeddingButton.value = false
}

// 로그 추가
const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
  processingLogs.value.push({
    type: type === 'warning' ? 'info' : type,
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
    addLog('error', `청킹 중 오류 발생: ${error.response?.data?.message || error.message}`)
  } finally {
    isProcessing.value = false
  }
}

// 임베딩 생성
const createEmbeddings = async () => {
  if (!uploadedFile.value || chunks.value.length === 0) return
  
  isCreatingEmbeddings.value = true
  
  try {
    addLog('info', '임베딩 생성 시작...')
    
    let response
    
    if (uploadedFile.value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // XLSX 파일 임베딩 생성
      response = await embeddingAPI.createXlsxEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing,
        xlsxConfig
      )
    } else {
      // 텍스트 파일 임베딩 생성
      response = await embeddingAPI.createTextEmbeddings(
        uploadedFile.value.file,
        chunkingSettings,
        preprocessing
      )
    }
    
    addLog('success', `${uploadedFile.value.name} 임베딩 생성 완료!`)
    addLog('info', `생성된 벡터: ${response.data.embeddings}개`)
    
  } catch (error: any) {
    console.error('임베딩 생성 오류:', error)
    addLog('error', `임베딩 생성 중 오류 발생: ${error.response?.data?.message || error.message}`)
  } finally {
    isCreatingEmbeddings.value = false
  }
}

// 드래그 이벤트 핸들러
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}
</script>

<style scoped>
.embedding-container {
  font-family: 'Inter', sans-serif;
}

/* 드래그 앤 드롭 애니메이션 */
.border-dashed {
  transition: all 0.3s ease;
}

/* 스크롤바 스타일링 */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex > div {
  animation: fadeIn 0.3s ease-out;
}
</style>
