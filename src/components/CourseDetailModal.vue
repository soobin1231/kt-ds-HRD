<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ course.name }}</h2>
        <button class="close-button" @click="closeModal">✕</button>
      </div>
      
      <div class="modal-body">
        <!-- 교육 기본 정보 -->
        <div class="course-info-section">
          <div class="info-grid">
            <div class="info-item">
              <label>🏫 대학</label>
              <span>{{ course.college }}</span>
            </div>
            <div class="info-item">
              <label>👨‍🏫 강사</label>
              <span>{{ course.instructor }}</span>
            </div>
            <div class="info-item">
              <label>📅 일정</label>
              <span>{{ course.date }}</span>
            </div>
            <div class="info-item">
              <label>⏰ 시간</label>
              <span>{{ course.duration }}</span>
            </div>
            <div class="info-item">
              <label>📊 유형</label>
              <span class="course-type" :class="`type-${course.type.toLowerCase()}`">
                {{ course.type }}
              </span>
            </div>
            <div class="info-item">
              <label>🏷️ 카테고리</label>
              <span>{{ course.category || '미분류' }}</span>
            </div>
          </div>
        </div>

        <!-- 교육 설명 -->
        <div class="description-section">
          <h3>📝 교육 개요</h3>
          <p>{{ course.description }}</p>
        </div>

        <!-- 교육 목표 -->
        <div class="objectives-section">
          <h3>🎯 교육 목표</h3>
          <ul>
            <li v-for="objective in course.objectives" :key="objective">
              {{ objective }}
            </li>
          </ul>
        </div>

        <!-- 교육 과정 -->
        <div class="curriculum-section">
          <h3>📚 교육 과정</h3>
          <ol>
            <li v-for="(item, index) in course.curriculum" :key="index">
              {{ item }}
            </li>
          </ol>
        </div>

        <!-- 대상자 -->
        <div class="audience-section">
          <h3>👥 대상자</h3>
          <div class="audience-tags">
            <span 
              v-for="audience in course.targetAudience" 
              :key="audience"
              class="audience-tag"
            >
              {{ audience }}
            </span>
          </div>
        </div>

        <!-- 선수과목 -->
        <div v-if="course.prerequisites && course.prerequisites.length > 0" class="prerequisites-section">
          <h3>📋 선수과목</h3>
          <div class="prerequisites-tags">
            <span 
              v-for="prerequisite in course.prerequisites" 
              :key="prerequisite"
              class="prerequisite-tag"
            >
              {{ prerequisite }}
            </span>
          </div>
        </div>

        <!-- 신청 버튼 -->
        <div class="action-section">
          <button class="apply-button" @click="applyCourse">
            📝 교육 신청하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EducationCourse } from '@/types/education';

interface Props {
  course: EducationCourse;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const closeModal = () => {
  emit('close');
};

const applyCourse = () => {
  // 교육 신청 로직 구현
  alert(`${props.course.name} 교육 신청이 완료되었습니다!`);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  color: #2d3748;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.modal-body {
  padding: 2rem;
}

.course-info-section {
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.info-item span {
  color: #2d3748;
  font-size: 1rem;
}

.course-type {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.type-기본 {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
}

.type-심화 {
  background: linear-gradient(135deg, #fff3e0, #ffcc02);
  color: #e65100;
}

.type-실무 {
  background: linear-gradient(135deg, #fce4ec, #f8bbd9);
  color: #ad1457;
}

.description-section,
.objectives-section,
.curriculum-section,
.audience-section,
.prerequisites-section {
  margin-bottom: 2rem;
}

.description-section h3,
.objectives-section h3,
.curriculum-section h3,
.audience-section h3,
.prerequisites-section h3 {
  color: #2d3748;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
}

.description-section p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

.objectives-section ul,
.curriculum-section ol {
  color: #4a5568;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.objectives-section li,
.curriculum-section li {
  margin-bottom: 0.5rem;
}

.audience-tags,
.prerequisites-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.audience-tag,
.prerequisite-tag {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  color: #8b5cf6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.prerequisite-tag {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1));
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.2);
}

.action-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 2px solid rgba(139, 92, 246, 0.2);
}

.apply-button {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-header h2 {
    font-size: 1.2rem;
  }
}
</style>

