<template>
  <!-- 모달 배경 -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
    <div class="modal-container bg-white rounded-lg shadow-xl max-w-6xl w-full flex flex-col">
      <!-- 모달 헤더 -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-gray-900">문서 청크 상세 정보</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ document.fileName }} ({{ chunks.length }}개 청크)
          </p>
        </div>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span class="text-2xl">×</span>
        </button>
      </div>

      <!-- 모달 내용 -->
      <div class="flex-1 overflow-hidden">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span class="text-gray-600">청크 데이터를 불러오는 중...</span>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="flex items-center justify-center h-64 text-red-600">
          <div class="text-center">
            <div class="text-4xl mb-2">⚠️</div>
            <p class="font-medium">청크 데이터를 불러올 수 없습니다</p>
            <p class="text-sm mt-1">{{ error }}</p>
          </div>
        </div>

        <!-- 청크 목록 -->
        <div v-else class="chunks-container flex-1 overflow-y-auto min-h-0">
          <div class="p-6 space-y-4">
            <!-- 문서 요약 정보 -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-600">총 청크:</span>
                  <span class="ml-2 text-gray-900">{{ chunks.length }}개</span>
                </div>
                <div v-if="chunks.length > 0">
                  <span class="font-medium text-gray-600">청킹 전략:</span>
                  <span class="ml-2 text-gray-900">{{ chunks[0].strategy || 'unknown' }}</span>
                </div>
                <div v-if="chunks.length > 0">
                  <span class="font-medium text-gray-600">청크 크기:</span>
                  <span class="ml-2 text-gray-900">{{ chunks[0].chunk_size || 0 }}자</span>
                </div>
                <div v-if="chunks.length > 0">
                  <span class="font-medium text-gray-600">오버랩:</span>
                  <span class="ml-2 text-gray-900">{{ chunks[0].overlap || 0 }}자</span>
                </div>
              </div>
            </div>

            <!-- 청크 카드들 -->
            <div class="space-y-4">
              <div
                v-for="chunk in chunks"
                :key="chunk.chunk_id"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <!-- 청크 헤더 -->
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <span class="font-medium text-gray-900">
                        청크 #{{ chunk.chunk_index + 1 }}
                      </span>
                      <span class="text-sm text-gray-600">
                        {{ chunk.content_length }}자
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDateTime(chunk.created_at) }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span v-if="chunk.auto_optimized" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        자동 최적화
                      </span>
                      <button
                        @click="copyToClipboard(chunk.content)"
                        class="text-gray-500 hover:text-gray-700 transition-colors"
                        title="복사"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 청크 내용 -->
                <div class="p-4">
                  <div class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {{ chunk.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <button
          @click="handleClose"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { embeddingAPI } from '@/services/api'
import type { VectorDocument, DocumentChunk } from '@/types/embedding'

interface Props {
  document: VectorDocument
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const chunks = ref<DocumentChunk[]>([])
const isLoading = ref(true)
const error = ref<string>('')

// 청크 데이터 로드
const loadChunks = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await embeddingAPI.getDocumentChunks(props.document.id)
    chunks.value = response.data.chunks
    
    console.log(`✅ 문서 "${props.document.fileName}"의 청크 ${chunks.value.length}개 로드 완료`)
  } catch (err) {
    console.error('청크 로드 실패:', err)
    error.value = '청크 데이터를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 클립보드에 복사
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 간단한 피드백 (실제로는 토스트 알림을 사용하는 것이 좋음)
    console.log('클립보드에 복사됨')
  } catch (err) {
    console.error('클립보드 복사 실패:', err)
  }
}

// 날짜/시간 포맷팅
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 모달 닫기 핸들러
const handleClose = () => {
  restoreBodyScroll()
  emit('close')
}

// 배경 스크롤 방지
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}

const restoreBodyScroll = () => {
  document.body.style.overflow = 'auto'
}

// 컴포넌트 마운트 시 청크 데이터 로드
onMounted(() => {
  loadChunks()
  preventBodyScroll()
})

// 컴포넌트 언마운트 시 스크롤 복원
onUnmounted(() => {
  restoreBodyScroll()
})
</script>

<style scoped>
/* 모달 배경 블러 효과 */
.bg-black.bg-opacity-50 {
  backdrop-filter: blur(2px);
}

/* 모달 애니메이션 */
.bg-white {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 스크롤바 스타일링 */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 모달 배경 클릭 시 스크롤 방지 */
.overflow-hidden {
  overflow: hidden !important;
}

/* 모달 컨테이너 높이 강제 설정 */
.modal-container {
  height: 90vh !important;
  max-height: 90vh !important;
}

/* 청크 목록 컨테이너 높이 설정 */
.chunks-container {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto !important;
  max-height: calc(90vh - 200px); /* 헤더와 푸터 공간 제외 */
}
</style>