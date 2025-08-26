<template>
  <div>
    <!-- Hero Section with Card News -->
    <section class="hero-section">
      <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-white">
            🎓 HR 교육자료 관리 시스템
          </h1>
          <p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            중요 교육 사안과 교육자료를 한 곳에서 확인하세요
          </p>
        </div>
        
        <!-- 중요 교육 뉴스 섹션 -->
        <div class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">🔥 중요 교육 사안</h2>
            <p class="text-blue-100">최신 교육 정보와 공지사항을 확인하세요</p>
          </div>
          
          <!-- 로딩 상태 -->
          <div v-if="educationNewsStore.loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p class="mt-4 text-blue-100">교육 뉴스를 불러오는 중...</p>
          </div>
          
          <!-- 교육 뉴스 그리드 -->
          <div v-else-if="activeNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlassCardNews
              v-for="(news, index) in activeNews"
              :key="news.id"
              :news="news"
              :index="index"
            />
          </div>
          
          <!-- 교육 뉴스 없음 -->
          <div v-else class="text-center py-12">
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <p class="text-blue-100 text-lg mb-4">현재 표시할 교육 뉴스가 없습니다.</p>
              <p class="text-blue-200 text-sm">관리자가 새로운 교육 뉴스를 추가하면 여기에 표시됩니다.</p>
            </div>
          </div>
        </div>
        
        <!-- 액션 버튼 -->
        <div class="flex justify-center space-x-4">
          <router-link to="/materials" class="bg-white text-blue-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-all hover:scale-105">
            📚 교육자료 둘러보기
          </router-link>
          <router-link to="/admin" class="border border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-all hover:scale-105">
            ⚙️ 관리자 페이지
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Search -->
    <section class="py-12 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🔍 빠른 검색</h2>
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
          <h2 class="text-3xl font-bold text-gray-900 mb-4">⭐ 추천 교육자료</h2>
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
          <h2 class="text-3xl font-bold text-gray-900 mb-4">✨ 주요 기능</h2>
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
import { useEducationNewsStore } from '@/stores/education-news'
import MaterialCard from '@/components/MaterialCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import GlassCardNews from '@/components/GlassCardNews.vue'

const router = useRouter()
const materialsStore = useMaterialsStore()
const categoriesStore = useCategoriesStore()
const educationNewsStore = useEducationNewsStore()

const searchLoading = ref(false)

const featuredMaterials = computed(() => materialsStore.featuredMaterials)
const activeNews = computed(() => educationNewsStore.activeNews)

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
  // 추천 자료, 카테고리, 교육 뉴스 정보 로드
  await Promise.all([
    materialsStore.fetchMaterials({ is_featured: true, limit: 6 }),
    categoriesStore.fetchCategories(),
    educationNewsStore.fetchNews()
  ])
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(1deg);
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 4rem 0;
  }
  
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .hero-section p {
    font-size: 1.1rem;
  }
}
</style>