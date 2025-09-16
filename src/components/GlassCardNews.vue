<template>
  <div class="glass-card-news">
    <div 
      class="glass-card"
      :class="`priority-${news.priority}`"
      :style="{ animationDelay: `${index * 0.2}s` }"
    >
      <!-- 오로라 배경 효과 -->
      <div class="aurora-bg"></div>
      
      <!-- 카드 내용 -->
      <div class="card-content">
        <!-- 우선순위 표시 -->
        <div class="priority-badge" :class="`priority-${news.priority}`">
          <span v-if="news.priority === 'high'">🔥</span>
          <span v-else-if="news.priority === 'medium'">⚡</span>
          <span v-else>💡</span>
          {{ getPriorityText(news.priority) }}
        </div>
        
        <!-- 제목 -->
        <h3 class="card-title">{{ news.title }}</h3>
        
        <!-- 내용 -->
        <p class="card-description">{{ news.content }}</p>
        
        <!-- 생성일 -->
        <div class="card-date">
          {{ formatDate(news.created_at) }}
        </div>
      </div>
      
      <!-- 유리 반사 효과 -->
      <div class="glass-reflection"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EducationNews } from '@/types/education-news'

interface Props {
  news: EducationNews
  index: number
}

defineProps<Props>()

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '높음'
    case 'medium': return '보통'
    case 'low': return '낮음'
    default: return priority
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.glass-card-news {
  perspective: 1000px;
}

.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  animation: aurora-float 8s ease-in-out infinite;
  overflow: hidden;
}

.glass-card:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* 우선순위별 색상 테마 - 투명 유리 스타일 */
.glass-card.priority-high {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 107, 107, 0.3);
  animation: aurora-shift 8s ease-in-out infinite;
}

.glass-card.priority-medium {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 193, 7, 0.3);
  animation: aurora-shift 10s ease-in-out infinite;
}

.glass-card.priority-low {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(76, 175, 80, 0.3);
  animation: aurora-shift 12s ease-in-out infinite;
}

/* 카드 내용 */
.card-content {
  position: relative;
  z-index: 2;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.priority-badge.priority-high {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
  box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
}

.priority-badge.priority-medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
  box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
}

.priority-badge.priority-low {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
  margin-bottom: 12px;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.card-description {
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.6;
  margin-bottom: 16px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
}

.card-date {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 유리 반사 효과 */
.glass-reflection {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 80%,
    transparent 100%
  );
  border-radius: 20px;
  pointer-events: none;
  z-index: 1;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .glass-card {
    padding: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .card-description {
    font-size: 13px;
  }
}
</style>
