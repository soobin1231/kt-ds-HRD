<template>
  <div id="app" class="min-h-screen bright-neon-gradient-bg">
    <!-- Navigation -->
    <nav class="vibrant-purple-navbar shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link 
              to="/" 
              class="flex items-center space-x-3 text-xl font-luxury-heading text-white hover:text-gray-200 transition-colors"
            >
              <img src="/logo.svg" alt="DS University Logo" class="h-8 w-8" />
              <span>DS University</span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="font-luxury-body text-white hover:text-gray-200 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-pink-200 font-medium': $route.name === 'Home' }"
            >
              홈
            </router-link>
            <router-link 
              to="/materials" 
              class="font-luxury-body text-white hover:text-gray-200 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-pink-200 font-medium': $route.name === 'Materials' }"
            >
              교육자료
            </router-link>
            <router-link 
              to="/education" 
              class="font-luxury-body text-white hover:text-gray-200 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-pink-200 font-medium': $route.name === 'Education' }"
            >
              교육 프로그램
            </router-link>
            <router-link 
              to="/education-system" 
              class="font-luxury-body text-white hover:text-gray-200 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-pink-200 font-medium': $route.name === 'EducationSystem' }"
            >
              교육제도
            </router-link>
            <router-link 
              to="/aurora-demo" 
              class="font-luxury-body text-white hover:text-gray-200 px-3 py-2 rounded-md transition-colors"
              :class="{ 'text-pink-200 font-medium': $route.name === 'AuroraDemo' }"
            >
              오로라 데모
            </router-link>
            <router-link 
              to="/admin" 
              class="enhanced-glass-texture rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300"
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
    <footer class="enhanced-glass-texture border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="text-center bright-text-secondary text-sm">
          © 2024 DS University. Made with Vue.js + TypeScript
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