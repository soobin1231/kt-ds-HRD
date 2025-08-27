<template>
  <div class="aurora-demo min-h-screen aurora-bg">
    <!-- 오로라 파티클들 -->
    <div class="aurora-particle"></div>
    <div class="aurora-particle"></div>
    <div class="aurora-particle"></div>
    <div class="aurora-particle"></div>
    <div class="aurora-particle"></div>
    <div class="aurora-particle"></div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- 메인 제목 -->
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-3d-glow mb-4">
          오로라 유리 효과
        </h1>
        <p class="text-xl text-white/80 text-3d">
          투명한 유리와 같은 색상으로 오로라처럼 동적으로 움직이는 UI
        </p>
      </div>

      <!-- 카드 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <!-- 유리 카드 1 -->
        <div class="glass-card group">
          <div class="text-center">
            <div class="text-4xl mb-4">✨</div>
            <h3 class="text-2xl font-bold text-3d mb-3">동적 오로라</h3>
            <p class="text-white/80">
              푸른색, 흰색, 연보라가 섞인 투명한 유리 효과
            </p>
          </div>
        </div>

        <!-- 유리 카드 2 -->
        <div class="glass-card group">
          <div class="text-center">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-2xl font-bold text-3d mb-3">3D 글씨체</h3>
            <p class="text-white/80">
              입체적이고 투명한 유리를 세워놓은 듯한 효과
            </p>
          </div>
        </div>

        <!-- 유리 카드 3 -->
        <div class="glass-card group">
          <div class="text-center">
            <div class="text-4xl mb-4">🌟</div>
            <h3 class="text-2xl font-bold text-3d mb-3">유동적 색상</h3>
            <p class="text-white/80">
              정적이지 않고 동적으로 살짝씩 움직이는 색상
            </p>
          </div>
        </div>
      </div>

      <!-- 버튼 섹션 -->
      <div class="text-center mb-16">
        <button class="glass-btn text-3d mr-4 mb-4">
          시작하기
        </button>
        <button class="glass-btn text-3d mr-4 mb-4">
          더 알아보기
        </button>
        <button class="glass-btn text-3d mb-4">
          문의하기
        </button>
      </div>

      <!-- 특별한 카드 -->
      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-12 text-center">
          <h2 class="text-4xl font-bold text-3d-glow mb-6">
            오로라의 마법
          </h2>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            북극의 오로라처럼 아름답게 빛나는 유리 효과로 사용자에게 
            특별한 경험을 제공합니다. 투명하면서도 생동감 있는 색상이 
            마치 살아있는 듯 움직이며, 3D 입체감이 더해진 글씨체로 
            시각적 깊이감을 극대화합니다.
          </p>
          <div class="flex justify-center space-x-6">
            <div class="text-center">
              <div class="text-3xl mb-2">🎭</div>
              <p class="text-white/80">동적 애니메이션</p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">💎</div>
              <p class="text-white/80">유리 질감</p>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">🌈</div>
              <p class="text-white/80">오로라 색상</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 컴포넌트 로직
</script>

<style scoped>
.aurora-demo {
  position: relative;
  overflow: hidden;
}

/* 추가적인 오로라 파티클 애니메이션 */
.aurora-particle:nth-child(5) {
  top: 15%;
  left: 50%;
  animation-delay: 1s;
  animation-duration: 7s;
}

.aurora-particle:nth-child(6) {
  top: 70%;
  left: 80%;
  animation-delay: 3s;
  animation-duration: 9s;
}

/* 그룹 호버 효과 */
.glass-card.group:hover {
  transform: translateY(-15px) rotateX(8deg) rotateY(8deg);
}

.glass-card.group:hover .text-3d {
  animation: text-3d 2s ease-in-out infinite;
}

.glass-card.group:hover .animate-aurora-sparkle {
  animation-duration: 1.5s;
}

/* 오로라 웨이브 효과 강화 */
.aurora-wave {
  z-index: -1;
}

/* 스파클 효과 강화 */
.aurora-sparkle {
  z-index: 1;
}

/* 유리 질감 효과 강화 */
.glass-texture {
  position: relative;
}

.glass-texture::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

/* 호버 시 추가 효과 */
.glass-card:hover .aurora-wave {
  animation-duration: 4s;
}

.glass-card:hover .aurora-sparkle {
  animation-duration: 1s;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  h1 {
    font-size: 3rem;
  }
  
  .glass-card {
    padding: 1.5rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  .aurora-particle {
    width: 1.5px;
    height: 1.5px;
  }
  
  .aurora-sparkle {
    width: 3px;
    height: 3px;
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .aurora-demo {
    background: linear-gradient(135deg, 
      rgba(0, 0, 0, 0.8) 0%, 
      rgba(20, 20, 40, 0.9) 100%);
  }
}
</style>
