<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br>
        URL을 다시 확인해주세요.
      </p>
      
      <div class="space-x-4">
        <router-link to="/" class="btn-primary">
          홈으로 돌아가기
        </router-link>
        <router-link to="/materials" class="btn-secondary">
          교육자료 보기
        </router-link>
      </div>
    </div>
  </div>
</template>