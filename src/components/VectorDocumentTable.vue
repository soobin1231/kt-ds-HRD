<template>
  <div class="overflow-hidden">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">문서 목록을 불러오는 중...</p>
    </div>

    <!-- 문서가 없는 경우 -->
    <div v-else-if="documents.length === 0" class="text-center py-8 text-gray-500">
      <div class="text-4xl mb-4">📭</div>
      <p class="text-lg mb-2">업로드된 문서가 없습니다</p>
      <p class="text-sm">새 문서를 업로드하려면 위의 '새 문서 업로드' 버튼을 클릭하세요.</p>
    </div>

    <!-- 문서 테이블 -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              파일명
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              타입
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              업로드일
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              청크
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              벡터
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              액션
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="document in documents" :key="document.id" class="hover:bg-gray-50">
            <!-- 파일명 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-lg mr-3">{{ getFileIcon(document.fileType) }}</span>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ document.fileName }}</div>
                  <div class="text-sm text-gray-500">{{ formatFileSize(document.fileSize) }}</div>
                </div>
              </div>
            </td>

            <!-- 파일 타입 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTypeClass(document.fileType)">
                {{ getFileTypeLabel(document.fileType) }}
              </span>
            </td>

          <!-- 업로드 날짜 -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDateTime(document.uploadDate) }}
            </td>

            <!-- 청크 수 -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="text-sm font-medium text-green-600">{{ document.chunkCount }}</span>
            </td>

            <!-- 벡터 수 -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="text-sm font-medium text-purple-600">{{ document.vectorCount }}</span>
            </td>

            <!-- 상태 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(document.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusLabel(document.status) }}
              </span>
            </td>

            <!-- 액션 버튼들 -->
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="$emit('viewDetails', document)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                  title="상세 보기"
                >
                  👁️
                </button>
                <button
                  v-if="document.status === 'completed'"
                  @click="$emit('deleteDocument', document)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                  title="삭제"
                >
                  🗑️
                </button>
                <span v-else class="text-gray-400">-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VectorDocument } from '@/types/embedding'

interface Props {
  documents: VectorDocument[]
  isLoading?: boolean
}

interface Emits {
  (e: 'deleteDocument', document: VectorDocument): void
  (e: 'viewDetails', document: VectorDocument): void
}

defineProps<Props>()
defineEmits<Emits>()

// 파일 아이콘 매핑
const getFileIcon = (fileType: string): string => {
  const iconMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'text/markdown': '📝',
    'text/plain': '📄'
  }
  return iconMap[fileType] || '📁'
}

// 파일 타입 라벨 매핑
const getFileTypeLabel = (fileType: string): string => {
  const labelMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/markdown': 'Markdown',
    'text/plain': 'Text'
  }
  return labelMap[fileType] || 'Unknown'
}

// 파일 타입 클래스 매핑
const getTypeClass = (fileType: string): string => {
  const classMap: { [key: string]: string } = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'bg-green-100 text-green-800',
    'text/markdown': 'bg-blue-100 text-blue-800',
    'text/plain': 'bg-gray-100 text-gray-800'
  }
  return classMap[fileType] || 'bg-gray-100 text-gray-800'
}

// 상태 라벨 매핑
const getStatusLabel = (status: string): string => {
  const labelMap: { [key: string]: string } = {
    'processing': '처리 중',
    'completed': '완료',
    'error': '오류'
  }
  return labelMap[status] || status
}

// 상태 클래스 매핑
const getStatusClass = (status: string): string => {
  const classMap: { [key: string]: string } = {
    'processing': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'error': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 파일 크기 포맷팅
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 날짜/시간 포맷팅
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* 액션 버튼 호버 효과 */
.transition-colors:hover {
  opacity: 0.8;
}

/* 테이블 스크롤바 스타일링 */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
