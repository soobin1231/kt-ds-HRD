<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">청킹 설정</h3>
    
    <div class="space-y-6">
      <!-- 스마트 자동 청킹 안내 -->
      <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">✨ 스마트 자동 청킹</h4>
            <p class="text-sm text-gray-700 mb-3">
              AI가 문서 구조와 내용을 자동으로 분석해서 최적의 청킹 전략을 결정합니다. 
              문단, 섹션, 구조 기반으로 의미 단위를 유지하며 분할합니다!
            </p>
            
            <!-- 스마트 청킹 전략 안내 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">구조 인식</div>
                <div class="text-sm font-bold text-blue-600">문단/섹션</div>
                <div class="text-xs text-gray-500">의미 단위 보존</div>
              </div>
              <div class="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">적응형 크기</div>
                <div class="text-sm font-bold text-green-600">300-800자</div>
                <div class="text-xs text-gray-500">내용에 따라 조절</div>
              </div>
              <div class="bg-white bg-opacity-80 rounded-lg p-3 text-center">
                <div class="text-xs font-medium text-gray-600 mb-1">토큰 최적화</div>
                <div class="text-sm font-bold text-purple-600">효율적 분할</div>
                <div class="text-xs text-gray-500">검색 성능 향상</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 자동 최적화 옵션 -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-1">🚀 자동 최적화</h4>
            <p class="text-xs text-gray-600">문서 구조를 분석하여 의미 단위 기반 스마트 청킹 적용</p>
          </div>
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="settings.autoOptimize"
              @change="updateSettings"
              class="w-4 h-4 text-blue-500 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            >
            <span class="text-sm font-medium" :class="settings.autoOptimize ? 'text-blue-600' : 'text-gray-600'">
              {{ settings.autoOptimize ? '활성화됨' : '비활성화됨' }}
            </span>
          </label>
        </div>
        <div class="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
          {{ settings.autoOptimize ? '💡 스마트 청킹이 활성화되었습니다. 문서 구조를 분석하여 최적의 청크로 분할됩니다.' : '⚙️ 수동 모드로 전환되었습니다. 아래에서 직접 청킹 설정을 할 수 있습니다.' }}
        </div>
      </div>

      <!-- 수동 설정 (자동 최적화 비활성화시만 표시) -->
      <div v-if="!settings.autoOptimize" class="space-y-4 border-t pt-4">
        <h4 class="text-sm font-medium text-gray-700">수동 청킹 설정</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 청크 크기 설정 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-semibold text-gray-800">청크 크기</label>
              <span class="text-lg font-bold text-blue-600">{{ manualChunkSize }}자</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="100"
              v-model.number="manualChunkSize"
              @input="updateManualSettings"
              class="w-full h-3 bg-white rounded-full appearance-none cursor-pointer"
            >
            <div class="flex justify-between text-xs text-gray-600 mt-2">
              <span>100</span>
              <span>1500</span>
            </div>
          </div>

          <!-- 오버랩 설정 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-semibold text-gray-800">오버랩</label>
              <span class="text-lg font-bold text-green-600">{{ manualOverlap }}자</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="50"
              v-model.number="manualOverlap"
              @input="updateManualSettings"
              class="w-full h-3 bg-white rounded-full appearance-none cursor-pointer"
            >
            <div class="flex justify-between text-xs text-gray-600 mt-2">
              <span>0</span>
              <span>300</span>
            </div>
          </div>
        </div>
        
        <!-- 수동 설정 프리셋 -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-gray-700">빠른 설정:</label>
          <div class="flex space-x-2">
            <button
              @click="applyManualPreset('small')"
              class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              작은 청크 (300자)
            </button>
            <button
              @click="applyManualPreset('medium')"
              class="px-3 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100"
            >
              중간 청크 (500자)
            </button>
            <button
              @click="applyManualPreset('large')"
              class="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
            >
              큰 청크 (800자)
            </button>
          </div>
        </div>
      </div>

      <!-- 주요 특징 -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">주요 특징</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-sm text-gray-700">구조 인식 분할 (structure_aware)</span>
          </div>
          <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span class="text-sm text-gray-700">토큰 기반 최적화</span>
          </div>
          <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span class="text-sm text-gray-700">완전 섹션 유지</span>
          </div>
          <div class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span class="text-sm text-gray-700">메타데이터 자동 생성</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ChunkingSettings } from '@/types/embedding'

interface Props {
  settings: ChunkingSettings
}

interface Emits {
  (e: 'update:settings', settings: ChunkingSettings): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 수동 설정용 반응 데이터
const manualChunkSize = ref(props.settings.chunkSize || 500)
const manualOverlap = ref(props.settings.overlap || 100)

// 설정 업데이트 함수
const updateSettings = () => {
  emit('update:settings', props.settings)
}

// 수동 설정 업데이트 함수
const updateManualSettings = () => {
  const newSettings: ChunkingSettings = {
    ...props.settings,
    autoOptimize: false,
    chunkSize: manualChunkSize.value,
    overlap: manualOverlap.value
  }
  emit('update:settings', newSettings)
}

// 수동 설정 프리셋 함수
const applyManualPreset = (preset: 'small' | 'medium' | 'large') => {
  const presets = {
    small: { chunkSize: 300, overlap: 50 },
    medium: { chunkSize: 500, overlap: 100 },
    large: { chunkSize: 800, overlap: 150 }
  }
  
  manualChunkSize.value = presets[preset].chunkSize
  manualOverlap.value = presets[preset].overlap
  
  const newSettings: ChunkingSettings = {
    autoOptimize: false,
    chunkSize: manualChunkSize.value,
    overlap: manualOverlap.value
  }
  
  emit('update:settings', newSettings)
}

// 자동 최적화 변경시 수동 설정 초기화
watch(() => props.settings.autoOptimize, (newValue) => {
  if (newValue) {
    manualChunkSize.value = 500
    manualOverlap.value = 100
  } else {
    // 수동 모드로 전환시 현재 설정값으로 동기화
    manualChunkSize.value = props.settings.chunkSize || 500
    manualOverlap.value = props.settings.overlap || 100
  }
})

// props.settings 변경시 로컬 값도 동기화
watch(() => [props.settings.chunkSize, props.settings.overlap], ([newChunkSize, newOverlap]) => {
  if (!props.settings.autoOptimize) {
    manualChunkSize.value = newChunkSize || 500
    manualOverlap.value = newOverlap || 100
  }
}, { immediate: true })
</script>

<style scoped>
/* 스타일링 */
</style>