<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            HR 교육자료 관리 시스템
          </h1>
          <p class="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            우리 회사의 모든 교육자료를 한 곳에서 쉽게 찾고, 다운로드하세요.<br>
            로그인 없이 누구나 자유롭게 이용할 수 있습니다.
          </p>
          <div class="flex justify-center space-x-4">
            <router-link to="/materials" class="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors">
              교육자료 둘러보기
            </router-link>
            <a href="#features" class="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors">
              더 알아보기
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Search -->
    <section class="py-12 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">빠른 검색</h2>
          <p class="text-gray-600">찾고 있는 교육자료가 있나요?</p>
        </div>
        
        <SearchBar 
          :loading="searchLoading"
          @search="handleQuickSearch"
          @clear="clearSearch"
        />
      </div>
    </section>

    <!-- Featured Materials -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">추천 교육자료</h2>
          <p class="text-gray-600">인기 있고 중요한 교육자료들을 확인해보세요</p>
        </div>
        
        <!-- 로딩 상태 -->
        <div v-if="materialsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">자료를 불러오는 중...</p>
        </div>
        
        <!-- 추천 자료 그리드 -->
        <div v-else-if="featuredMaterials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MaterialCard
            v-for="material in featuredMaterials"
            :key="material.id"
            :material="material"
            @download="handleDownload"
          />
        </div>
        
        <!-- 추천 자료 없음 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-500">현재 추천 교육자료가 없습니다.</p>
          <router-link to="/materials" class="btn-primary mt-4 inline-block">
            전체 교육자료 보기
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">주요 기능</h2>
          <p class="text-gray-600">간편하고 효율적인 교육자료 관리 시스템</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">스마트 검색</h3>
            <p class="text-gray-600">제목, 내용, 태그를 기반으로 한 빠르고 정확한 검색</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">간편 다운로드</h3>
            <p class="text-gray-600">클릭 한 번으로 원하는 교육자료를 즉시 다운로드</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">카테고리 분류</h3>
            <p class="text-gray-600">체계적인 카테고리로 원하는 자료를 쉽게 찾기</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">반응형 디자인</h3>
            <p class="text-gray-600">PC, 태블릿, 스마트폰에서 모두 최적화된 경험</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">로그인 불필요</h3>
            <p class="text-gray-600">회원가입이나 로그인 없이 누구나 자유롭게 이용</p>
          </div>
          
          <div class="text-center">
            <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-lg mb-4">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">실시간 통계</h3>
            <p class="text-gray-600">조회수, 다운로드 수 등 실시간 사용 통계 제공</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-50 py-16">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">지금 바로 시작하세요</h2>
        <p class="text-xl text-gray-600 mb-8">
          수백 개의 교육자료가 여러분을 기다리고 있습니다.
        </p>
        <router-link to="/materials" class="btn-primary text-lg px-8 py-4 inline-block">
          교육자료 탐색하기 →
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMaterialsStore } from '@/stores/materials'
import { useCategoriesStore } from '@/stores/categories'
import MaterialCard from '@/components/MaterialCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const materialsStore = useMaterialsStore()
const categoriesStore = useCategoriesStore()

const searchLoading = ref(false)

const featuredMaterials = computed(() => materialsStore.featuredMaterials)

const handleQuickSearch = async (query: string, categoryId: number | null) => {
  searchLoading.value = true
  
  // 검색 페이지로 이동하면서 파라미터 전달
  const searchParams: any = {}
  if (query) searchParams.search = query
  if (categoryId) searchParams.category = categoryId
  
  await router.push({
    name: 'Materials',
    query: searchParams
  })
  
  searchLoading.value = false
}

const clearSearch = () => {
  router.push({ name: 'Materials' })
}

const handleDownload = async (material: any) => {
  try {
    await materialsStore.downloadMaterial(material)
  } catch (error) {
    alert('다운로드에 실패했습니다.')
  }
}

onMounted(async () => {
  // 추천 자료와 카테고리 정보 로드
  await Promise.all([
    materialsStore.fetchMaterials({ is_featured: true, limit: 6 }),
    categoriesStore.fetchCategories()
  ])
})
</script>