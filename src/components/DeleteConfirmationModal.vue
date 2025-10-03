<template>
  <!-- 모달 배경 -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <!-- 모달 헤더 -->
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <span class="text-red-500 text-xl">⚠️</span>
        </div>
        <h3 class="text-lg font-medium text-gray-900">문서 삭제 확인</h3>
      </div>

      <!-- 모달 내용 -->
      <div class="mb-6">
        <p class="text-sm text-gray-600 mb-4">
          다음 문서와 관련된 모든 데이터를 삭제합니다:
        </p>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center space-x-3">
            <span class="text-lg">{{ getFileIcon(document.fileType) }}</span>
            <div>
              <div class="font-medium text-gray-900">{{ document.fileName }}</div>
              <div class="text-sm text-gray-600">
                {{ document.chunkCount }}개 청크, {{ document.vectorCount }}개 벡터
              </div>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <span class="text-yellow-600 text-sm">⚠️</span>
            <div class="text-sm text-yellow-800">
              <strong>주의:</strong> 이 작업은 되돌릴 수 없습니다. 
              문서의 청크와 벡터 데이터가 모두 삭제되며, 
              EduBot이 이 정보를 참조할 수 없게 됩니다.
            </div>
          </div>
        </div>
      </div>

      <!-- 모달 액션 버튼들 -->
      <div class="flex space-x-3 justify-end">
        <button
          @click="emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          @click="emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          삭제하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VectorDocument } from '@/types/embedding'

interface Props {
  document: VectorDocument
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 파일 아이콘 매핑
const getFileIcon = (fileType: string): string => {
  const iconMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/markdown': '📝',
    'text/plain': '📄'
  }
  return iconMap[fileType] || '📁'
}
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

/* 버튼 호버 효과 */
.transition-colors:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 경고 아이콘 애니메이션 */
.text-red-500 {
  animation: warningPulse 2s infinite;
}

@keyframes warningPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
