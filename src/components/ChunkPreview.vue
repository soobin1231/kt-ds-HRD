<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">청킹 및 임베딩 처리</h3>
      <router-link 
        to="/vector-management"
        class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
      >
        🗂️ 벡터 관리
      </router-link>
    </div>
    
    <!-- 처리 버튼들 -->
    <div v-if="uploadedFile" class="mb-6">
      <div class="flex space-x-3">
        <button
          @click="emit('preview-chunks')"
          :disabled="!uploadedFile || isProcessing"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors',
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
          @click="emit('create-embeddings')"
          :disabled="chunks.length === 0 || isCreatingEmbeddings"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-colors',
            chunks.length === 0 || isCreatingEmbeddings
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          ]"
        >
          <span v-if="isCreatingEmbeddings">임베딩 생성 중...</span>
          <span v-else>임베딩 생성</span>
        </button>
      </div>
    </div>
    
    <!-- 처리 상태 -->
    <div v-if="processingLogs.length > 0" class="mb-6">
      <h4 class="text-md font-medium text-gray-900 mb-3">처리 상태</h4>
      
      <!-- 진행률 바 (처리 중일 때만 표시) -->
      <div v-if="isProcessing || isCreatingEmbeddings" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ isProcessing ? '청킹 처리 중...' : '임베딩 생성 중...' }}
          </span>
          <span class="text-sm text-gray-600">{{ progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="mt-2 text-xs text-gray-500">
          {{ currentStep }} / {{ totalSteps }}
        </div>
      </div>
      
      <!-- 로그 메시지 -->
      <div class="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2">
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
    </div>
    
    <!-- 성공 상태 -->
    <div v-if="showSuccessActions && embeddingResult" class="mb-6">
      <div class="text-center">
        <!-- 성공 아이콘과 메시지 -->
        <div class="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
          <span class="text-2xl">🎉</span>
        </div>
        <h4 class="text-lg font-bold text-green-800 mb-2">임베딩 생성 완료!</h4>
        <p class="text-gray-600 mb-4">
          <span class="font-medium">{{ embeddingResult.fileName }}</span> 파일이 성공적으로 처리되었습니다.
        </p>
        
        <!-- 처리 결과 요약 -->
        <div class="bg-green-50 rounded-lg p-3 mb-4 inline-block">
          <div class="text-sm">
            <span class="font-medium text-green-700">{{ embeddingResult.chunks }}개 청크</span>
            <span class="text-green-600 mx-2">·</span>
            <span class="font-medium text-green-700">{{ embeddingResult.chunks }}개 벡터</span>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <router-link 
            to="/vector-management"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center text-sm font-medium"
          >
            📊 벡터 관리 페이지로 이동
          </router-link>
          
          <button
            @click="emit('start-new-upload')"
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
          >
            📄 새 문서 업로드
          </button>
        </div>
      </div>
    </div>
    
    <!-- 청킹 결과 (성공 상태가 아닐 때만 표시) -->
    <div v-if="chunks.length > 0 && !showSuccessActions" class="space-y-6">
      <!-- 청크 카드 그리드 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-md font-medium text-gray-900">청킹 결과</h4>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              총 {{ chunks.length }}개 청크
            </span>
            <button
              @click="toggleEditMode"
              :class="[
                'px-3 py-1 text-sm rounded-lg transition-colors',
                isEditMode ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              ]"
            >
              {{ isEditMode ? '편집 완료' : '청크 편집' }}
            </button>
          </div>
        </div>
        
        <!-- 청크 그리드 (더 컴팩트하게) -->
        <div class="max-h-80 overflow-y-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div 
              v-for="(chunk, index) in (isEditMode ? editableChunks : chunks)"
              :key="index"
              :class="[
                'border rounded-md p-3 transition-all',
                isEditMode ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
                'cursor-pointer'
              ]"
              @click="!isEditMode && toggleChunkExpansion(index)"
            >
              <!-- 청크 헤더 (컴팩트) -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">청크 {{ index + 1 }}</span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {{ chunk?.length || 0 }}자
                  </span>
                  <button
                    @click.stop="copyToClipboard(chunk, index)"
                    class="text-xs text-blue-600 hover:text-blue-800"
                    title="복사"
                  >
                    📋
                  </button>
                  <button
                    v-if="isEditMode"
                    @click.stop="removeChunk(index)"
                    class="text-xs text-red-600 hover:text-red-800"
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <!-- 청크 내용 (편집 모드에 따라 다르게 표시) -->
              <div v-if="!isEditMode" class="text-xs text-gray-700 leading-relaxed">
                <span v-if="!expandedChunks[index]">
                  {{ chunk && chunk.length > 100 ? chunk.substring(0, 100) + '...' : chunk }}
                </span>
                <span v-else class="whitespace-pre-wrap text-sm">
                  {{ chunk }}
                </span>
              </div>
              
              <!-- 편집 모드: 텍스트 에리어 -->
              <div v-else class="space-y-2">
                <textarea
                  v-model="editableChunks[index]"
                  class="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  @input="updateChunkLength(index)"
                ></textarea>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>{{ editableChunks[index]?.length || 0 }}자</span>
                  <div class="space-x-2">
                    <button
                      @click.stop="splitChunk(index)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      분할
                    </button>
                    <button
                      @click.stop="mergeWithNext(index)"
                      :disabled="index === editableChunks.length - 1"
                      class="text-green-600 hover:text-green-800 disabled:text-gray-400"
                    >
                      다음과 합치기
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 확장 버튼 (편집 모드가 아닐 때만) -->
              <div v-if="!isEditMode && chunk && chunk.length > 100" class="mt-2 text-center">
                <span class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                  {{ expandedChunks[index] ? '접기' : '더보기' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 청킹 통계 (컴팩트) -->
      <div class="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg text-sm">
        <div class="flex space-x-6">
          <span class="text-gray-600">
            <span class="font-medium text-blue-600">{{ isEditMode ? (editableChunks?.length || 0) : (chunks?.length || 0) }}</span>개 청크
          </span>
          <span class="text-gray-600">
            평균 <span class="font-medium text-green-600">{{ Math.round(avgChunkLength) }}</span>자
          </span>
          <span class="text-gray-600">
            일정성 <span class="font-medium text-purple-600">{{ Math.round(minMaxRatio * 100) }}%</span>
          </span>
        </div>
        <button
          @click="copyAllChunks"
          class="text-gray-500 hover:text-gray-700 transition-colors"
          title="전체 청크 복사"
        >
          📋 전체 복사
        </button>
      </div>
    </div>

    <!-- 청킹 진행 상태 -->
    <div v-else-if="isProcessing" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">청킹 처리 중...</p>
    </div>

    <!-- 파일이 없을 때 -->
    <div v-else class="text-center py-8 text-gray-500">
      <p>먼저 파일을 업로드하고 미리보기를 실행하세요.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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

interface Props {
  chunks: string[]
  isProcessing?: boolean
  uploadedFile?: UploadedFile | null
  chunkingSettings?: any
  xlsxConfig?: { ruleType: string }
  preprocessing?: any
  isCreatingEmbeddings?: boolean
  showEmbeddingButton?: boolean
  processingLogs?: LogEntry[]
  showSuccessActions?: boolean
  embeddingResult?: {
    fileName: string
    chunks: number
    fileId: string
  } | null
  progressPercentage?: number
  currentStep?: number
  totalSteps?: number
}

interface Emits {
  (e: 'preview-chunks'): void
  (e: 'create-embeddings'): void
  (e: 'start-new-upload'): void
  (e: 'hide-success-actions'): void
  (e: 'update-chunks', chunks: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 청크 확장 상태 관리
const expandedChunks = ref<boolean[]>([])
const isEditMode = ref(false)
const editableChunks = ref<string[]>([])

// 청크들이 변경될 때 초기화
const initializeExpandedState = () => {
  expandedChunks.value = new Array(props.chunks.length).fill(false)
  editableChunks.value = [...props.chunks]
}

// props.chunks 변경 감지하여 초기화
watch(() => props.chunks, (newChunks) => {
  if (newChunks && newChunks.length > 0) {
    expandedChunks.value = new Array(newChunks.length).fill(false)
    editableChunks.value = [...newChunks]
  }
}, { immediate: true })

// 편집 모드 토글
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (isEditMode.value) {
    // 편집 모드 진입시 현재 청크들을 편집 가능한 배열로 복사
    editableChunks.value = [...props.chunks]
  } else {
    // 편집 모드 종료시 변경사항을 부모에게 전달
    emit('update-chunks', editableChunks.value)
  }
}

// 청크 편집 메서드들
const removeChunk = (index: number) => {
  if (confirm(`청크 ${index + 1}을 삭제하시겠습니까?`)) {
    editableChunks.value.splice(index, 1)
    expandedChunks.value.splice(index, 1)
  }
}

const splitChunk = (index: number) => {
  const chunk = editableChunks.value[index]
  if (!chunk) return
  
  const cursorPosition = prompt('분할할 위치를 입력하세요 (문자 수):')
  
  if (cursorPosition && !isNaN(Number(cursorPosition))) {
    const splitPos = Number(cursorPosition)
    if (splitPos > 0 && splitPos < chunk.length) {
      const firstPart = chunk.substring(0, splitPos).trim()
      const secondPart = chunk.substring(splitPos).trim()
      
      if (firstPart && secondPart) {
        editableChunks.value[index] = firstPart
        editableChunks.value.splice(index + 1, 0, secondPart)
        expandedChunks.value.splice(index + 1, 0, false)
      }
    }
  }
}

const mergeWithNext = (index: number) => {
  if (index < editableChunks.value.length - 1) {
    const currentChunk = editableChunks.value[index]
    const nextChunk = editableChunks.value[index + 1]
    if (currentChunk && nextChunk) {
      const mergedChunk = `${currentChunk}\n\n${nextChunk}`
      
      editableChunks.value[index] = mergedChunk
      editableChunks.value.splice(index + 1, 1)
      expandedChunks.value.splice(index + 1, 1)
    }
  }
}

// 청크 확장/축소 토글
const toggleChunkExpansion = (index: number) => {
  expandedChunks.value[index] = !expandedChunks.value[index]
}

// 클립보드 복사 기능
const copyToClipboard = async (text: string, index: number) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    console.log(`청크 ${index + 1} 텍스트가 클립보드에 복사되었습니다.`)
  } catch (err) {
    console.error('클립보드 복사 실패:', err)
    // fallback: textarea 사용
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

// 전체 청크 복사 기능
const copyAllChunks = async () => {
  try {
    const chunksToUse = isEditMode.value ? editableChunks.value : props.chunks
    const allChunksText = chunksToUse.map((chunk, index) => 
      `=== 청크 ${index + 1} ===\n${chunk}\n`
    ).join('\n')
    
    await navigator.clipboard.writeText(allChunksText)
    console.log('전체 청크가 클립보드에 복사되었습니다.')
  } catch (err) {
    console.error('전체 청크 복사 실패:', err)
  }
}

const avgChunkLength = computed(() => {
  const chunksToUse = isEditMode.value ? editableChunks.value : props.chunks
  if (!chunksToUse || !chunksToUse.length) return 0
  const totalLength = chunksToUse.reduce((sum, chunk) => sum + (chunk?.length || 0), 0)
  return totalLength / chunksToUse.length
})

const minMaxRatio = computed(() => {
  const chunksToUse = isEditMode.value ? editableChunks.value : props.chunks
  if (!chunksToUse || !chunksToUse.length) return 0
  const lengths = chunksToUse.map(chunk => chunk?.length || 0)
  const minLength = Math.min(...lengths)
  const maxLength = Math.max(...lengths)
  return maxLength > 0 ? minLength / maxLength : 1
})

// 진행률 계산
const progressPercentage = computed(() => {
  if (!props.progressPercentage) return 0
  return Math.min(100, Math.max(0, props.progressPercentage))
})

const currentStep = computed(() => {
  return props.currentStep || 0
})

const totalSteps = computed(() => {
  return props.totalSteps || 1
})
</script>

<style scoped>
/* 스크롤바 스타일링 (컴팩트) */
.max-h-80::-webkit-scrollbar {
  width: 4px;
}

.max-h-80::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 청크 카드 컴팩트 디자인 */
.grid .hover\:border-gray-300:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 반응형 조정 */
@media (max-width: 1024px) {
  .grid.lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* 트랜지션 애니메이션 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
