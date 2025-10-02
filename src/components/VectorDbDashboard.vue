<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900">Vector Database 상태</h2>
      <button
        @click="$emit('refresh')"
        :disabled="isLoading"
        class="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading">새로고침 중...</span>
        <span v-else>새로고침</span>
      </button>
    </div>

    <!-- 상태 지표 카드들 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <!-- 총 문서 수 -->
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">총 문서</p>
            <p class="text-2xl font-bold text-blue-800">{{ dbStatus.totalDocuments }}</p>
          </div>
          <div class="text-blue-400 text-2xl">📄</div>
        </div>
      </div>

      <!-- 총 청크 수 -->
      <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">총 청크</p>
            <p class="text-2xl font-bold text-green-800">{{ formatNumber(dbStatus.totalChunks) }}</p>
          </div>
          <div class="text-green-400 text-2xl">🧩</div>
        </div>
      </div>

      <!-- 총 벡터 수 -->
      <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">총 벡터</p>
            <p class="text-2xl font-bold text-purple-800">{{ formatNumber(dbStatus.totalVectors) }}</p>
          </div>
          <div class="text-purple-400 text-2xl">🎯</div>
        </div>
      </div>

      <!-- 데이터베이스 크기 -->
      <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
        <div class="flex items-center justify-items-between">
          <div>
            <p class="text-sm font-medium text-orange-600">DB 크기</p>
            <p class="text-2xl font-bold text-orange-800">{{ dbStatus.databaseSize }}</p>
          </div>
          <div class="text-orange-400 text-2xl">💾</div>
        </div>
      </div>
    </div>

    <!-- 시스템 상태 및 마지막 업데이트 -->
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-600">시스템 상태:</span>
          <span :class="getStatusBadgeClass(dbStatus.status)" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ getStatusLabel(dbStatus.status) }}
          </span>
        </div>
        <div class="text-sm text-gray-600">
          마지막 업데이트: {{ formatDateTime(dbStatus.lastUpdated) }}
        </div>
      </div>
      
      <!-- 청크 대비 벡터 비율 -->
            <div class="text-sm text-gray-600">
              벡터화율: {{ getVectorizationRate }}%
            </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VectorDbStatus } from '@/types/embedding'

interface Props {
  dbStatus: VectorDbStatus
  isLoading?: boolean
}

interface Emits {
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 숫자 포맷팅
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 날짜/시간 포맷팅
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 상태 라벨 매핑
const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    'healthy': '정상',
    'warning': '주의',
    'error': '오류'
  }
  return labels[status] || status
}

// 상태 배지 스타일 클래스
const getStatusBadgeClass = (status: string): string => {
  const classes: { [key: string]: string } = {
    'healthy': 'bg-green-100 text-green-800',
    'warning': 'bg-yellow-100 text-yellow-800',
    'error': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 벡터화율 계산
const getVectorizationRate = computed((): number => {
  if (props.dbStatus.totalChunks === 0) return 0
  return Math.round((props.dbStatus.totalVectors / props.dbStatus.totalChunks) * 100)
})
</script>

<style scoped>
.bg-gradient-to-r {
  transition: transform 0.2s ease;
}

.bg-gradient-to-r:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 상태 배지 애니메이션 */
.px-2.py-1.rounded-full {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
