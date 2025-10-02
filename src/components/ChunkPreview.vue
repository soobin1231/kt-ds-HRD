<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">청킹된 조각 미리보기</h3>
    
    <div v-if="chunks.length > 0" class="space-y-4">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-600">총 {{ chunks.length }}개의 청크가 생성되었습니다</span>
        <div class="flex space-x-2">
          <button
            v-for="(chunk, index) in chunks.slice(0, Math.min(5, chunks.length))"
            :key="index"
            @click="selectedChunk = index"
            :class="[
              'px-3 py-1 text-xs rounded transition-colors',
              selectedChunk === index 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            청크 {{ index + 1 }}
          </button>
          <span v-if="chunks.length > 5" class="text-xs text-gray-500 px-2 py-1">
            +{{ chunks.length - 5 }}개 더
          </span>
        </div>
      </div>

      <!-- 현재 선택된 청크 표시 -->
      <div v-if="selectedChunk !== null" class="border rounded-lg p-4 bg-gray-50">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">청크 {{ selectedChunk + 1 }}</span>
          <div class="text-xs text-gray-500">
            {{ currentChunk.length }}자
          </div>
        </div>
        <div class="whitespace-pre-wrap text-sm text-gray-900 bg-white p-3 rounded border max-h-60 overflow-y-auto">
          {{ currentChunk }}
        </div>
      </div>

      <!-- 청킹 통계 -->
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="text-center p-3 bg-blue-50 rounded">
          <div class="text-lg font-semibold text-blue-600">{{ chunks.length }}</div>
          <div class="text-xs text-blue-700">전체 청크</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded">
          <div class="text-lg font-semibold text-green-600">{{ Math.round(avgChunkLength) }}</div>
          <div class="text-xs text-green-700">평균 길이</div>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded">
          <div class="text-lg font-semibold text-purple-600">{{ Math.round(minMaxRatio * 100) }}%</div>
          <div class="text-xs text-purple-700">길이 일정성</div>
        </div>
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
import { ref, computed } from 'vue'

interface Props {
  chunks: string[]
  isProcessing?: boolean
}

const props = defineProps<Props>()

const selectedChunk = ref<number>(0)

const currentChunk = computed(() => {
  if (selectedChunk.value === null || !props.chunks[selectedChunk.value]) {
    return ''
  }
  return props.chunks[selectedChunk.value]
})

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
/* 스크롤바 스타일링 */
.max-h-60::-webkit-scrollbar {
  width: 4px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
