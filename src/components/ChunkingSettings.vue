<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">청킹 설정</h3>
    
    <div class="space-y-6">
      <!-- 빠른 설정 프리셋 버튼 -->
      <div class="border-b pb-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">빠른 설정</label>
        <div class="flex space-x-3">
          <button
            @click="applyPreset('small')"
            class="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            작은 문서
            <span class="block text-xs text-blue-600 mt-1">&lt; 10페이지</span>
          </button>
          <button
            @click="applyPreset('medium')"
            class="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
          >
          중간 문서
            <span class="block text-xs text-green-600 mt-1">10-50페이지</span>
          </button>
          <button
            @click="applyPreset('large')"
            class="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
          >
            큰 문서
            <span class="block text-xs text-purple-600 mt-1">&gt; 50페이지</span>
          </button>
        </div>
      </div>

      <!-- 청킹 기본 설정 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 청크 크기 설정 -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-blue-800">청크 크기</label>
            <span class="text-lg font-bold text-blue-600">{{ settings.chunkSize }} 토큰</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            v-model.number="settings.chunkSize"
            class="w-full h-3 bg-white rounded-full appearance-none cursor-pointer"
          >
          <div class="flex justify-between text-xs text-blue-600 mt-2">
            <span>100</span>
            <span>2000</span>
          </div>
          <p class="text-xs text-blue-700 mt-2">
            {{ getChunkSizeDescription(settings.chunkSize) }}
          </p>
        </div>

        <!-- 오버랩 설정 -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-green-800">오버랩</label>
            <span class="text-lg font-bold text-green-600">{{ settings.overlap }} 토큰</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            v-model.number="settings.overlap"
            class="w-full h-3 bg-white rounded-full appearance-none cursor-pointer"
          >
          <div class="flex justify-between text-xs text-green-600 mt-2">
            <span>0</span>
            <span>500</span>
          </div>
          <p class="text-xs text-green-700 mt-2">
            권장: {{ Math.round(settings.chunkSize * 0.15) }} 토큰 (청크 크기의 15%)
          </p>
        </div>
      </div>

      <!-- 청킹 전략 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">청킹 전략</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              value="word"
              v-model="settings.strategy"
              class="mr-3 text-blue-500"
            >
            <div>
              <div class="text-sm font-medium text-gray-900">단어 단위</div>
              <div class="text-xs text-gray-600">단어 경계 기준</div>
            </div>
          </label>
          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              value="sentence"
              v-model="settings.strategy"
              class="mr-3 text-blue-500"
            >
            <div>
              <div class="text-sm font-medium text-gray-900">문장 단위</div>
              <div class="text-xs text-gray-600">문장 끝 기준</div>
            </div>
          </label>
          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="radio"
              value="paragraph"
              v-model="settings.strategy"
              class="mr-3 text-blue-500"
            >
            <div>
              <div class="text-sm font-medium text-gray-900">문단 단위</div>
              <div class="text-xs text-gray-600">줄바꿈 기준</div>
            </div>
          </label>
        </div>
      </div>

      <!-- 구조 보존 옵션 -->
      <div class="border-t pt-4">
        <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            v-model="settings.preserveStructure"
            class="mr-3 text-blue-500"
          >
          <div>
            <div class="text-sm font-medium text-gray-900">문서 구조 보존</div>
            <div class="text-xs text-gray-600">마크다운, HTML 구조 요소 유지</div>
          </div>
        </label>
      </div>

      <!-- 현재 설정 요약 -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
        <h4 class="text-sm font-medium text-gray-800 mb-3">현재 설정 요약</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div class="text-center">
            <div class="font-semibold text-gray-700">청크 크기</div>
            <div class="text-blue-600 font-bold">{{ settings.chunkSize }}</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-700">오버랩</div>
            <div class="text-green-600 font-bold">{{ settings.overlap }}</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-700">전략</div>
            <div class="text-purple-600 font-bold">{{ getStrategyLabel(settings.strategy) }}</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-gray-700">오버랩 비율</div>
            <div class="text-orange-600 font-bold">{{ Math.round((settings.overlap / settings.chunkSize) * 100) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import type { ChunkingSettings } from '@/types/embedding'

interface Props {
  settings: ChunkingSettings
}

interface Emits {
  (e: 'update:settings', settings: ChunkingSettings): void
}

const { settings } = defineProps<Props>()
const emit = defineEmits<Emits>()

// 청킹 전략 라벨 매핑
const getStrategyLabel = (strategy: string) => {
  const labels: { [key: string]: string } = {
    'word': '단어 단위',
    'sentence': '문장 단위',
    'paragraph': '문단 단위'
  }
  return labels[strategy] || strategy
}

// 청크 크기에 따른 설명 반환
const getChunkSizeDescription = (size: number) => {
  if (size < 500) return '매우 작은 청크 (짧은 문장)'
  if (size < 1000) return '작은 청크 (문단 단위)'
  if (size < 1500) return '중간 청크 (여러 문단)'
  if (size < 2000) return '큰 청크 (전체 섹션)'
  return '매우 큰 청크 (긴 내용)'
}

// 프리셋 적용
const applyPreset = (preset: 'small' | 'medium' | 'large') => {
  const presets = {
    small: {
      chunkSize: 500,
      overlap: 50,
      strategy: 'word' as const,
      preserveStructure: true
    },
    medium: {
      chunkSize: 1000,
      overlap: 150,
      strategy: 'sentence' as const,
      preserveStructure: true
    },
    large: {
      chunkSize: 1500,
      overlap: 200,
      strategy: 'paragraph' as const,
      preserveStructure: false
    }
  }
  
  Object.assign(settings, presets[preset])
  emit('update:settings', settings)
}

// 설정 변경 시 자동 보정
watch(() => [settings.chunkSize, settings.overlap], ([newChunkSize, newOverlap]) => {
  // 오버랩이 청크 크기보다 크면 조정
  if (newOverlap >= newChunkSize) {
    settings.overlap = Math.max(0, newChunkSize - 100)
    emit('update:settings', settings)
  }
  
  // 오버랩 비율이 50%를 초과하면 조정
  const overlapRatio = newOverlap / newChunkSize
  if (overlapRatio > 0.5) {
    settings.overlap = Math.floor(newChunkSize * 0.3)
    emit('update:settings', settings)
  }
})
</script>

<style scoped>
/* 슬라이더 스타일링 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 12px;
  border-radius: 6px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 12px;
  border-radius: 6px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* 프리셋 버튼 호버 효과 */
.bg-blue-50:hover {
  background-color: #dbeafe;
}

.bg-green-50:hover {
  background-color: #dcfce7;
}

.bg-purple-50:hover {
  background-color: #f3e8ff;
}

/* 설정 요약 카드 애니메이션 */
.bg-gradient-to-r {
  transition: all 0.3s ease;
}

.bg-gradient-to-r:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 그리드 레이아웃 반응형 조정 */
@media (max-width: 768px) {
  .grid.grid-cols-2.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .grid.grid-cols-3.md\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .grid.grid-cols-4.md\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>