<template>
  <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-luxury-heading text-gray-800 mb-4">교육제도</h1>
      <p class="text-xl font-luxury-body text-gray-600 max-w-3xl mx-auto">
        다양한 교육제도를 통해 전문성을 키우고 경쟁력을 높여보세요
      </p>
    </div>

    <!-- Excel File Upload Section -->
    <div class="mb-12">
      <div class="enhanced-glass-texture rounded-xl p-8 max-w-4xl mx-auto">
        <h2 class="text-2xl font-luxury-heading text-gray-800 mb-6 text-center">엑셀 파일로 교육제도 추가</h2>
        <p class="font-luxury-body text-gray-600 mb-6 text-center">
          엑셀 파일을 업로드하여 여러 교육제도를 한 번에 추가할 수 있습니다.<br>
          <span class="text-sm text-gray-500">A열: 제도명, B열: 제도 설명</span>
        </p>
        
        <!-- File Upload Area -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          @click="triggerFileUpload"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <div v-if="!uploading">
            <div class="text-4xl mb-4">📊</div>
            <p class="font-luxury-body text-gray-600 mb-2">
              엑셀 파일을 드래그하거나 클릭하여 업로드하세요
            </p>
            <p class="text-sm text-gray-500">.xlsx, .xls 파일만 지원됩니다</p>
          </div>
          <div v-else class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mr-3"></div>
            <p class="font-luxury-body text-gray-600">파일을 분석하는 중...</p>
          </div>
        </div>
        
        <!-- Hidden File Input -->
        <input 
          ref="fileInput"
          type="file" 
          accept=".xlsx,.xls"
          @change="handleFileUpload"
          class="hidden"
        />
        
        <!-- Analysis Results -->
        <div v-if="excelResults.length > 0" class="mt-8">
          <h3 class="text-lg font-luxury-heading text-gray-800 mb-4">📊 엑셀에서 발견된 교육제도</h3>
          <div class="max-w-2xl mx-auto">
            <div 
              v-for="(result, index) in excelResults" 
              :key="index"
              class="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow mb-4"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ result.icon }}</span>
                  <h4 class="font-luxury-heading text-gray-800 text-lg">{{ result.name }}</h4>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {{ getCategoryName(result.category) }}
                  </span>
                  <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    신규
                  </span>
                </div>
              </div>
              
              <div class="font-luxury-body text-gray-600 mb-4" v-html="result.description"></div>
              
              <!-- Add Button -->
              <div class="flex justify-center">
                <button 
                  @click="addEducationSystemFromExcel(result)"
                  class="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-luxury-body"
                >
                  교육제도로 추가
                </button>
              </div>
            </div>
            
            <!-- Bulk Add Button -->
            <div class="text-center mt-6">
              <button 
                @click="addAllSystemsFromExcel"
                class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-luxury-body"
              >
                모든 교육제도 일괄 추가 ({{ excelResults.length }}개)
              </button>
            </div>
          </div>
        </div>
      </div>
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
                <!-- 새로 추가된 교육제도 표시 -->
                <span 
                  v-if="isRecentlyAdded(system)"
                  class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  새로 추가됨
                </span>
              </div>
            </div>

            <!-- System Info -->
            <h3 class="text-lg font-luxury-heading text-gray-800 mb-2">{{ system.name }}</h3>
            <div class="text-sm text-gray-500 mb-4">자세한 내용을 보려면 자세히 보기를 클릭하세요</div>

            <!-- Action Button -->
            <button 
              @click="openSystemDetail(system)"
              class="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-luxury-body"
            >
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
        class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex-shrink-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="text-3xl mr-4">{{ selectedSystem.icon }}</div>
              <div>
                <h2 class="text-2xl font-luxury-heading text-gray-800">{{ selectedSystem.name }}</h2>
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

        <!-- Modal Content - 스크롤 가능한 영역 -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="font-luxury-body text-gray-600 space-y-4" v-html="selectedSystem.description"></div>
        </div>

        <!-- Modal Footer - 고정 버튼 -->
        <div class="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
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
import { ref, onMounted, nextTick } from 'vue'
import { useEducationSystemStore } from '@/stores/education-system'
import { api, educationSystemAPI } from '@/services/api'
import type { EducationSystem } from '@/types/education-system'

const educationSystemStore = useEducationSystemStore()
const selectedSystem = ref<EducationSystem | null>(null)

// File upload related
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const excelResults = ref<any[]>([])
const recentlyAddedSystems = ref<Set<string>>(new Set())

const getSystemsByCategory = (categoryId: string): EducationSystem[] => {
  return educationSystemStore.systemsByCategory[categoryId] || []
}

const isRecentlyAdded = (system: EducationSystem): boolean => {
  return recentlyAddedSystems.value.has(system.id)
}

const openSystemDetail = (system: EducationSystem) => {
  selectedSystem.value = system
}

const closeSystemDetail = () => {
  selectedSystem.value = null
}

// File upload functions
const triggerFileUpload = async () => {
  await nextTick()
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await processExcelFile(file)
  }
}

const handleFileDrop = async (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    await processExcelFile(file)
  } else {
    alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.')
  }
}

const processExcelFile = async (file: File) => {
  try {
    uploading.value = true
    excelResults.value = []
    
    console.log('엑셀 파일 처리 시작:', file.name)
    
    const response = await educationSystemAPI.uploadExcel(file)
    
    console.log('엑셀 분석 결과:', response.data)
    excelResults.value = response.data.systems
    
    if (response.data.systems.length === 0) {
      alert('엑셀 파일에서 교육제도를 찾을 수 없습니다.\n\nA열에 제도명, B열에 설명이 있는지 확인해주세요.')
    } else {
      alert(`${response.data.systems.length}개의 교육제도를 발견했습니다!`)
    }
  } catch (error) {
    console.error('Excel file processing error:', error)
    
    // 더 자세한 오류 정보 표시
    let errorMessage = '알 수 없는 오류'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    // Axios 오류인 경우 응답 데이터 확인
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any
      if (axiosError.response?.data?.detail) {
        errorMessage = axiosError.response.data.detail
      } else if (axiosError.response?.status) {
        errorMessage = `서버 오류 (${axiosError.response.status}): ${axiosError.response.statusText}`
      }
    }
    
    alert(`파일 처리 중 오류가 발생했습니다: ${errorMessage}`)
  } finally {
    uploading.value = false
  }
}

const getCategoryName = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'certification': '자격증',
    'training': '직무교육',
    'development': '개인개발',
    'specialization': '전문분야'
  }
  return categoryMap[category] || '기타'
}

const addEducationSystemFromExcel = async (systemData: any) => {
  try {
    const newSystem = {
      name: systemData.name,
      description: systemData.description,
      category: systemData.category as 'certification' | 'training' | 'development' | 'specialization',
      icon: systemData.icon,
      color: systemData.color
    }
    
    const createdSystem = await educationSystemStore.createSystem(newSystem)
    
    // 새로 추가된 시스템으로 표시
    if (createdSystem && createdSystem.id) {
      recentlyAddedSystems.value.add(createdSystem.id)
      
      // 5초 후 "새로 추가됨" 표시 제거
      setTimeout(() => {
        recentlyAddedSystems.value.delete(createdSystem.id)
      }, 5000)
    }
    
    // 분석 결과에서 제거
    const index = excelResults.value.findIndex(r => r.name === systemData.name)
    if (index > -1) {
      excelResults.value.splice(index, 1)
    }
    
    alert('교육제도가 성공적으로 추가되었습니다!')
  } catch (error) {
    console.error('Failed to add education system:', error)
    alert('교육제도 추가에 실패했습니다.')
  }
}

const addAllSystemsFromExcel = async () => {
  try {
    const response = await api.post('/api/education-systems/bulk-create', excelResults.value)
    
    // 새로 추가된 시스템들 표시
    response.data.systems.forEach((system: any) => {
      recentlyAddedSystems.value.add(system.id)
    })
    
    // 5초 후 "새로 추가됨" 표시 제거
    setTimeout(() => {
      response.data.systems.forEach((system: any) => {
        recentlyAddedSystems.value.delete(system.id)
      })
    }, 5000)
    
    // 분석 결과 초기화
    excelResults.value = []
    
    alert(`${response.data.created_count}개의 교육제도가 성공적으로 추가되었습니다!`)
  } catch (error) {
    console.error('Failed to bulk create education systems:', error)
    alert('교육제도 일괄 추가에 실패했습니다.')
  }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>