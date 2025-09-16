<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-luxury-heading text-gray-800 mb-4">교육제도</h1>
      <p class="text-xl font-luxury-body text-gray-600 max-w-3xl mx-auto">
        다양한 교육제도를 통해 전문성을 키우고 경쟁력을 높여보세요
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="educationSystemStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
      <p class="mt-4 font-luxury-body text-gray-600">교육제도를 불러오는 중...</p>
    </div>

    <!-- Categories -->
    <div v-else class="space-y-12">
      <div 
        v-for="category in educationSystemStore.categories" 
        :key="category.id"
        class="enhanced-glass-texture rounded-xl p-8"
      >
        <!-- Category Header -->
        <div class="flex items-center mb-8">
          <div class="text-4xl mr-4">{{ category.icon }}</div>
          <div>
            <h2 class="text-2xl font-luxury-heading text-gray-800 mb-2">{{ category.name }}</h2>
            <p class="font-luxury-body text-gray-600">{{ category.description }}</p>
          </div>
        </div>

        <!-- Systems Grid -->
        <div v-if="getSystemsByCategory(category.id).length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="system in getSystemsByCategory(category.id)" 
            :key="system.id"
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            @click="openSystemDetail(system)"
          >
            <!-- System Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-2xl">{{ system.icon }}</div>
              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="system.color"
                >
                  {{ system.duration }}
                </span>
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="system.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  {{ system.isActive ? '활성' : '비활성' }}
                </span>
              </div>
            </div>

            <!-- System Info -->
            <h3 class="text-lg font-luxury-heading text-gray-800 mb-2">{{ system.name }}</h3>
            <p class="font-luxury-body text-gray-600 mb-4 line-clamp-3">{{ system.description }}</p>

            <!-- Target Audience -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">대상자</h4>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="audience in system.targetAudience.slice(0, 3)" 
                  :key="audience"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {{ audience }}
                </span>
                <span 
                  v-if="system.targetAudience.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  +{{ system.targetAudience.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Benefits Preview -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">주요 혜택</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li v-for="benefit in system.benefits.slice(0, 2)" :key="benefit" class="flex items-center">
                  <span class="text-green-500 mr-2">✓</span>
                  {{ benefit }}
                </li>
                <li v-if="system.benefits.length > 2" class="text-gray-500">
                  +{{ system.benefits.length - 2 }}개 더
                </li>
              </ul>
            </div>

            <!-- Action Button -->
            <button class="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-luxury-body">
              자세히 보기
            </button>
          </div>
        </div>

        <!-- No Systems -->
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-4">📚</div>
          <p class="font-luxury-body">해당 카테고리에 등록된 교육제도가 없습니다.</p>
        </div>
      </div>
    </div>

    <!-- System Detail Modal -->
    <div 
      v-if="selectedSystem" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeSystemDetail"
    >
      <div 
        class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="text-3xl mr-4">{{ selectedSystem.icon }}</div>
              <div>
                <h2 class="text-2xl font-luxury-heading text-gray-800">{{ selectedSystem.name }}</h2>
                <p class="font-luxury-body text-gray-600">{{ selectedSystem.description }}</p>
              </div>
            </div>
            <button 
              @click="closeSystemDetail"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-luxury-heading text-gray-800 mb-3">기본 정보</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">기간:</span>
                  <span class="font-luxury-body text-gray-600">{{ selectedSystem.duration }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">상태:</span>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="selectedSystem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ selectedSystem.isActive ? '활성' : '비활성' }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-luxury-heading text-gray-800 mb-3">대상자</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="audience in selectedSystem.targetAudience" 
                  :key="audience"
                  class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ audience }}
                </span>
              </div>
            </div>
          </div>

          <!-- Requirements -->
          <div>
            <h3 class="text-lg font-luxury-heading text-gray-800 mb-3">요구사항</h3>
            <ul class="space-y-2">
              <li 
                v-for="requirement in selectedSystem.requirements" 
                :key="requirement"
                class="flex items-center font-luxury-body text-gray-600"
              >
                <span class="text-blue-500 mr-3">•</span>
                {{ requirement }}
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div>
            <h3 class="text-lg font-luxury-heading text-gray-800 mb-3">주요 혜택</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="benefit in selectedSystem.benefits" 
                :key="benefit"
                class="flex items-center p-3 bg-green-50 rounded-lg"
              >
                <span class="text-green-500 mr-3">✓</span>
                <span class="font-luxury-body text-gray-700">{{ benefit }}</span>
              </div>
            </div>
          </div>

          <!-- Process -->
          <div>
            <h3 class="text-lg font-luxury-heading text-gray-800 mb-3">교육 과정</h3>
            <div class="space-y-3">
              <div 
                v-for="(step, index) in selectedSystem.process" 
                :key="step"
                class="flex items-center"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                  {{ index + 1 }}
                </div>
                <span class="font-luxury-body text-gray-700">{{ step }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div class="flex justify-end space-x-4">
            <button 
              @click="closeSystemDetail"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-luxury-body"
            >
              닫기
            </button>
            <button 
              class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-luxury-body"
            >
              신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEducationSystemStore } from '@/stores/education-system'
import type { EducationSystem } from '@/types/education-system'

const educationSystemStore = useEducationSystemStore()
const selectedSystem = ref<EducationSystem | null>(null)

const getSystemsByCategory = (categoryId: string): EducationSystem[] => {
  return educationSystemStore.systemsByCategory[categoryId] || []
}

const openSystemDetail = (system: EducationSystem) => {
  selectedSystem.value = system
}

const closeSystemDetail = () => {
  selectedSystem.value = null
}

onMounted(() => {
  educationSystemStore.fetchSystems()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>