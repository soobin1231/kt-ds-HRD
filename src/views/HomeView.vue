<template>
  <div>
    <!-- Hero Section with Card News -->
    <section class="hero-section">
      <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h1 class="text-4xl font-luxury-heading tracking-tight sm:text-5xl text-gray-800 mb-6">
              DS University
            </h1>
            <p class="text-xl font-luxury-body text-gray-600 mb-8 max-w-3xl mx-auto">
              중요 교육 사안과 교육자료를 한 곳에서 확인하세요
            </p>
          </div>
        
        <!-- 중요 교육 뉴스 섹션 -->
        <div class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-luxury-heading text-gray-800 mb-4">중요 교육 사안</h2>
            <p class="font-luxury-body text-gray-600">최신 교육 정보와 공지사항을 확인하세요</p>
          </div>
          
          <!-- 교육 뉴스 추가 폼 -->
          <div class="mb-8">
            <div class="enhanced-glass-texture rounded-xl p-6 max-w-2xl mx-auto">
              <h3 class="text-lg font-luxury-heading text-gray-800 mb-4 text-center">새 교육 뉴스 추가</h3>
              <form @submit.prevent="addNews" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input 
                    v-model="newNews.title"
                    type="text" 
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="교육 뉴스 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea 
                    v-model="newNews.content"
                    required
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="교육 뉴스 내용을 입력하세요"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">우선순위</label>
                  <select 
                    v-model="newNews.priority"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="high">높음 🔥</option>
                    <option value="medium">보통 ⚡</option>
                    <option value="low">낮음 💡</option>
                  </select>
                </div>
                <div class="flex justify-center">
                  <button 
                    type="submit" 
                    :disabled="adding"
                    class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-luxury-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="adding">추가 중...</span>
                    <span v-else>교육 뉴스 추가</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- 로딩 상태 -->
          <div v-if="educationNewsStore.loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
            <p class="mt-4 font-luxury-body text-gray-600">교육 뉴스를 불러오는 중...</p>
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
          
          <!-- 뉴스 없음 -->
          <div v-else class="text-center py-12">
            <div class="enhanced-glass-texture rounded-xl p-8 max-w-md mx-auto">
              <p class="font-luxury-body text-gray-600">현재 등록된 교육 뉴스가 없습니다.</p>
            </div>
          </div>
        </div>
        
        <!-- 액션 버튼 -->
        <div class="flex justify-center space-x-4">
          <router-link to="/education" class="enhanced-glass-texture rounded-xl px-6 py-3 font-luxury-body text-gray-800 transition-all duration-300 hover:scale-105">
            교육 프로그램
          </router-link>
          <router-link to="/materials" class="enhanced-glass-texture rounded-xl px-6 py-3 font-luxury-body text-gray-800 transition-all duration-300 hover:scale-105">
            교육자료 둘러보기
          </router-link>
          <router-link to="/admin" class="enhanced-glass-texture rounded-xl px-6 py-3 font-luxury-body text-gray-800 transition-all duration-300 hover:scale-105">
            관리자 페이지
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useEducationNewsStore } from '@/stores/education-news'
import GlassCardNews from '@/components/GlassCardNews.vue'

type EducationNewsPriority = 'high' | 'medium' | 'low'

const educationNewsStore = useEducationNewsStore()

const activeNews = computed(() => educationNewsStore.activeNews)

// 새 뉴스 폼 데이터
const newNews = ref({
  title: '',
  content: '',
  priority: 'medium' as EducationNewsPriority
})

const adding = ref(false)

const addNews = async () => {
  if (!newNews.value.title.trim() || !newNews.value.content.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }

  try {
    adding.value = true
    await educationNewsStore.createNews({
      title: newNews.value.title.trim(),
      content: newNews.value.content.trim(),
      priority: newNews.value.priority,
      is_active: true
    })
    
    // 폼 초기화
    newNews.value = {
      title: '',
      content: '',
      priority: 'medium'
    }
    
    alert('교육 뉴스가 성공적으로 추가되었습니다!')
  } catch (error) {
    console.error('Failed to add news:', error)
    alert('교육 뉴스 추가에 실패했습니다.')
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  educationNewsStore.fetchNews()
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, 
    rgba(252, 251, 249, 0.98) 0%,
    rgba(251, 250, 248, 0.95) 25%,
    rgba(250, 249, 247, 0.98) 50%,
    rgba(249, 248, 246, 0.95) 75%,
    rgba(248, 247, 245, 0.98) 100%);
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
  background: 
    radial-gradient(circle at 20% 20%, rgba(230, 220, 200, 0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(235, 225, 205, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(225, 215, 195, 0.02) 0%, transparent 50%);
  animation: aurora-shift 25s ease-in-out infinite;
}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.08) 0%, transparent 30%);
  pointer-events: none;
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