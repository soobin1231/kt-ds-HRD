<template>
  <div class="space-y-6">
    <!-- 문서 업로드 섹션 -->
    <div class="enhanced-glass-texture rounded-xl p-6">
      <h3 class="text-lg font-luxury-heading text-gray-800 mb-4">문서 분석으로 교육제도 추출</h3>
      <p class="font-luxury-body text-gray-600 mb-6">
        Excel, PowerPoint, Word 문서를 업로드하면 자동으로 교육제도를 분석하여 추출합니다.
      </p>
      
      <!-- 파일 드롭존 -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        :class="{ 'border-gray-400 bg-gray-50': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleFileDrop"
      >
        <div v-if="!selectedFile">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="font-luxury-body text-gray-600 mb-2">문서를 드래그하거나 클릭하여 업로드</p>
          <button
            type="button"
            @click="$refs.fileInput?.click()"
            class="btn-outline"
          >
            문서 선택
          </button>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".xlsx,.xls,.pptx,.ppt,.docx,.doc"
            @change="handleFileSelect"
          />
        </div>
        
        <div v-else class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ getFileIcon(selectedFile.type) }}</span>
            <div>
              <p class="font-luxury-body text-gray-900">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="removeFile"
            class="text-red-600 hover:text-red-800"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 분석 버튼 -->
      <div v-if="selectedFile" class="flex justify-end mt-6">
        <button 
          type="button" 
          @click="analyzeDocument"
          :disabled="analyzing"
          class="btn-primary"
        >
          <svg v-if="analyzing" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ analyzing ? '문서 분석 중...' : '문서 분석하기' }}
        </button>
      </div>
    </div>

    <!-- 분석 결과 -->
    <div v-if="analysisResult" class="space-y-6">
      <!-- 분석 요약 -->
      <div class="enhanced-glass-texture rounded-xl p-6">
        <h3 class="text-lg font-luxury-heading text-gray-800 mb-4">분석 결과 요약</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ analysisResult.extractedSystems.length }}</div>
            <div class="text-sm text-gray-600">추출된 교육제도</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600">{{ Math.round(analysisResult.confidence * 100) }}%</div>
            <div class="text-sm text-gray-600">분석 신뢰도</div>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ analysisResult.recommendations.length }}</div>
            <div class="text-sm text-gray-600">추천사항</div>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="font-medium text-gray-800 mb-2">요약</h4>
          <p class="font-luxury-body text-gray-600">{{ analysisResult.summary }}</p>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-800 mb-2">추천사항</h4>
          <ul class="space-y-1">
            <li 
              v-for="recommendation in analysisResult.recommendations" 
              :key="recommendation"
              class="flex items-center font-luxury-body text-gray-600"
            >
              <span class="text-blue-500 mr-2">•</span>
              {{ recommendation }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 추출된 교육제도 -->
      <div class="enhanced-glass-texture rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-luxury-heading text-gray-800">추출된 교육제도</h3>
          <button 
            @click="addAllToSystem"
            :disabled="adding"
            class="btn-primary"
          >
            <svg v-if="adding" class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {{ adding ? '추가 중...' : '모두 시스템에 추가' }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="system in analysisResult.extractedSystems" 
            :key="system.name"
            class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <!-- 시스템 헤더 -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-2xl">{{ system.icon }}</div>
              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="system.color"
                >
                  {{ getCategoryName(system.category) }}
                </span>
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-1" :class="getConfidenceColor(system.confidence)"></div>
                  <span class="text-xs text-gray-500">{{ Math.round(system.confidence * 100) }}%</span>
                </div>
              </div>
            </div>

            <!-- 시스템 정보 -->
            <h4 class="text-lg font-luxury-heading text-gray-800 mb-2">{{ system.name }}</h4>
            <p class="font-luxury-body text-gray-600 mb-4 line-clamp-3">{{ system.description }}</p>

            <!-- 기본 정보 -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">기간:</span>
                <span class="font-medium">{{ system.duration }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">대상자:</span>
                <span class="font-medium">{{ system.targetAudience.length }}명</span>
              </div>
            </div>

            <!-- 대상자 미리보기 -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="audience in system.targetAudience.slice(0, 2)" 
                  :key="audience"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {{ audience }}
                </span>
                <span 
                  v-if="system.targetAudience.length > 2"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  +{{ system.targetAudience.length - 2 }}
                </span>
              </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="flex space-x-2">
              <button 
                @click="previewSystem(system)"
                class="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                미리보기
              </button>
              <button 
                @click="addSingleSystem(system)"
                class="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 시스템 미리보기 모달 -->
    <div 
      v-if="previewSystem" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closePreview"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- 모달 헤더 -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="text-3xl mr-4">{{ previewSystem.icon }}</div>
              <div>
                <h2 class="text-xl font-luxury-heading text-gray-800">{{ previewSystem.name }}</h2>
                <p class="font-luxury-body text-gray-600">{{ previewSystem.description }}</p>
              </div>
            </div>
            <button 
              @click="closePreview"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 모달 내용 -->
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3 class="font-medium text-gray-800 mb-2">카테고리</h3>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="previewSystem.color"
              >
                {{ getCategoryName(previewSystem.category) }}
              </span>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 mb-2">기간</h3>
              <p class="font-luxury-body text-gray-600">{{ previewSystem.duration }}</p>
            </div>
          </div>

          <div>
            <h3 class="font-medium text-gray-800 mb-2">대상자</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="audience in previewSystem.targetAudience" 
                :key="audience"
                class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {{ audience }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="font-medium text-gray-800 mb-2">요구사항</h3>
            <ul class="space-y-1">
              <li 
                v-for="requirement in previewSystem.requirements" 
                :key="requirement"
                class="flex items-center font-luxury-body text-gray-600"
              >
                <span class="text-blue-500 mr-2">•</span>
                {{ requirement }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium text-gray-800 mb-2">주요 혜택</h3>
            <ul class="space-y-1">
              <li 
                v-for="benefit in previewSystem.benefits" 
                :key="benefit"
                class="flex items-center font-luxury-body text-gray-600"
              >
                <span class="text-green-500 mr-2">✓</span>
                {{ benefit }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium text-gray-800 mb-2">교육 과정</h3>
            <div class="space-y-2">
              <div 
                v-for="(step, index) in previewSystem.process" 
                :key="step"
                class="flex items-center"
              >
                <div class="flex-shrink-0 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  {{ index + 1 }}
                </div>
                <span class="font-luxury-body text-gray-700">{{ step }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 푸터 -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div class="flex justify-end space-x-4">
            <button 
              @click="closePreview"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-luxury-body"
            >
              닫기
            </button>
            <button 
              @click="addSingleSystem(previewSystem)"
              class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-luxury-body"
            >
              시스템에 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEducationSystemStore } from '@/stores/education-system'
import { DocumentAnalyzer, type DocumentAnalysisResult, type ExtractedEducationSystem } from '@/utils/documentAnalyzer'
import { formatFileSize, getFileIcon } from '@/utils/format'

const emit = defineEmits<{
  success: []
}>()

const educationSystemStore = useEducationSystemStore()

const isDragOver = ref(false)
const selectedFile = ref<File | null>(null)
const analysisResult = ref<DocumentAnalysisResult | null>(null)
const previewSystem = ref<ExtractedEducationSystem | null>(null)
const analyzing = ref(false)
const adding = ref(false)

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    analysisResult.value = null
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    analysisResult.value = null
  }
}

const removeFile = () => {
  selectedFile.value = null
  analysisResult.value = null
}

const analyzeDocument = async () => {
  if (!selectedFile.value) return
  
  try {
    analyzing.value = true
    analysisResult.value = await DocumentAnalyzer.analyzeDocument(selectedFile.value)
    console.log('Document analysis completed:', analysisResult.value)
  } catch (error) {
    console.error('Document analysis error:', error)
    alert('문서 분석에 실패했습니다. 파일 형식을 확인해주세요.')
  } finally {
    analyzing.value = false
  }
}

const addSingleSystem = async (system: ExtractedEducationSystem) => {
  try {
    adding.value = true
    
    const systemData = {
      name: system.name,
      description: system.description,
      category: system.category,
      targetAudience: system.targetAudience,
      duration: system.duration,
      requirements: system.requirements,
      benefits: system.benefits,
      process: system.process,
      icon: system.icon,
      color: system.color,
      isActive: true
    }
    
    await educationSystemStore.createSystem(systemData)
    alert('교육제도가 성공적으로 추가되었습니다!')
    emit('success')
  } catch (error) {
    console.error('Add system error:', error)
    alert('교육제도 추가에 실패했습니다.')
  } finally {
    adding.value = false
  }
}

const addAllToSystem = async () => {
  if (!analysisResult.value) return
  
  try {
    adding.value = true
    
    for (const system of analysisResult.value.extractedSystems) {
      const systemData = {
        name: system.name,
        description: system.description,
        category: system.category,
        targetAudience: system.targetAudience,
        duration: system.duration,
        requirements: system.requirements,
        benefits: system.benefits,
        process: system.process,
        icon: system.icon,
        color: system.color,
        isActive: true
      }
      
      await educationSystemStore.createSystem(systemData)
    }
    
    alert(`${analysisResult.value.extractedSystems.length}개의 교육제도가 성공적으로 추가되었습니다!`)
    emit('success')
  } catch (error) {
    console.error('Add all systems error:', error)
    alert('교육제도 추가에 실패했습니다.')
  } finally {
    adding.value = false
  }
}

const previewSystem = (system: ExtractedEducationSystem) => {
  previewSystem.value = system
}

const closePreview = () => {
  previewSystem.value = null
}

const getCategoryName = (category: string) => {
  const categoryNames = {
    certification: '자격증 취득',
    training: '직무 교육',
    development: '개인 개발',
    specialization: '전문 분야'
  }
  return categoryNames[category as keyof typeof categoryNames] || category
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-green-500'
  if (confidence >= 0.6) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

