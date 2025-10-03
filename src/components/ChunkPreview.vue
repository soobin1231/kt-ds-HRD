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
          <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            총 {{ chunks.length }}개 청크
          </span>
        </div>
        
        <!-- 청크 그리드 (더 컴팩트하게) -->
        <div class="max-h-80 overflow-y-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div 
              v-for="(chunk, index) in chunks"
              :key="index"
              class="border border-gray-200 rounded-md p-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
              @click="toggleChunkExpansion(index)"
            >
              <!-- 청크 헤더 (컴팩트) -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">청크 {{ index + 1 }}</span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {{ chunk.length }}자
                  </span>
                  <button
                    @click.stop="copyToClipboard(chunk, index)"
                    class="text-xs text-blue-600 hover:text-blue-800"
                    title="복사"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <!-- 청크 내용 미리보기 -->
              <div class="text-xs text-gray-700 leading-relaxed">
                <span v-if="!expandedChunks[index]">
                  {{ chunk.length > 100 ? chunk.substring(0, 100) + '...' : chunk }}
                </span>
                <span v-else class="whitespace-pre-wrap text-sm">
                  {{ chunk }}
                </span>
              </div>
              
              <!-- 확장 버튼 -->
              <div v-if="chunk.length > 100" class="mt-2 text-center">
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
            <span class="font-medium text-blue-600">{{ chunks.length }}</span>개 청크
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
import { computed, ref } from 'vue'

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
}

interface Emits {
  (e: 'preview-chunks'): void
  (e: 'create-embeddings'): void
  (e: 'start-new-upload'): void
  (e: 'hide-success-actions'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 청크 확장 상태 관리
const expandedChunks = ref<boolean[]>([])

// 청크들이 변경될 때 초기화
const initializeExpandedState = () => {
  expandedChunks.value = new Array(props.chunks.length).fill(false)
}

// 청크 확장/축소 토글
const toggleChunkExpansion = (index: number) => {
  expandedChunks.value[index] = !expandedChunks.value[index]
}

// 클립보드 복사 기능
const copyToClipboard = async (text: string, index: number) => {
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
    const allChunksText = props.chunks.map((chunk, index) => 
      `=== 청크 ${index + 1} ===\n${chunk}\n`
    ).join('\n')
    
    await navigator.clipboard.writeText(allChunksText)
    console.log('전체 청크가 클립보드에 복사되었습니다.')
  } catch (err) {
    console.error('전체 청크 복사 실패:', err)
  }
}

const avgChunkLength = computed(() => {
  if (!props.chunks.length) return 0
  const totalLength = props.chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  return totalLength / props.chunks.length
})

const minMaxRatio = computed(() => {
  if (!props.chunks.length) return 0
  const lengths = props.chunks.map(chunk => chunk.length)
  const minLength = Math.min(...lengths)
  const maxLength = Math.max(...lengths)
  return maxLength > 0 ? minLength / maxLength : 1
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
