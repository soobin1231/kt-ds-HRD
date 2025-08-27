<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link 
              to="/" 
              class="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
            >
              🎓 HR 교육자료 시스템
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-primary-600 font-medium': $route.name === 'Home' }"
            >
              홈
            </router-link>
            <router-link 
              to="/materials" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-primary-600 font-medium': $route.name === 'Materials' }"
            >
              교육자료
            </router-link>
            <router-link 
              to="/aurora-demo" 
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-primary-600 font-medium': $route.name === 'AuroraDemo' }"
            >
              오로라 데모
            </router-link>
            <router-link 
              to="/admin" 
              class="btn-primary"
            >
              관리자
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500 text-sm">
          © 2024 HR 교육자료 관리 시스템. Made with Vue.js + TypeScript
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>