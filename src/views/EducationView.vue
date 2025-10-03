<template>
  <div class="education-page">
    <!-- 헤더 섹션 -->
    <div class="education-header">
      <div class="container">
        <h1 class="page-title font-luxury-heading">DS University 교육 프로그램</h1>
        <p class="page-description font-luxury-body">전문 교육 과정을 통해 역량을 향상시키세요</p>
      </div>
    </div>

    <!-- 파일 업로드 섹션 -->
    <div class="upload-section">
      <div class="container">
        <div class="upload-card">
          <h2>📁 교육 프로그램 업로드</h2>
          <p>엑셀 파일을 업로드하여 새로운 교육 프로그램을 등록하세요</p>
          
          <div class="template-section">
            <button @click="downloadTemplate" class="template-button">
              📋 엑셀 템플릿 다운로드
            </button>
            <p class="template-hint">먼저 템플릿을 다운로드하여 교육 과정 정보를 입력하세요</p>
          </div>
          
          <div class="upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
            <input 
              ref="fileInput" 
              type="file" 
              accept=".xlsx,.xls" 
              @change="handleFileUpload" 
              style="display: none"
            />
            
            <div v-if="!educationStore.loading" class="upload-content">
              <div class="upload-icon">📤</div>
              <p>클릭하거나 파일을 드래그하여 업로드</p>
              <p class="upload-hint">지원 형식: .xlsx, .xls</p>
            </div>
            
            <div v-else class="upload-loading">
              <div class="loading-spinner"></div>
              <p>파일을 처리하는 중...</p>
            </div>
          </div>
          
          <div v-if="educationStore.error" class="error-message">
            ❌ {{ educationStore.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- 교육 프로그램 목록 -->
    <div v-if="educationStore.programs.length > 0" class="programs-section">
      <div class="container">
        <h2>📚 등록된 교육 프로그램</h2>
        <div class="programs-grid">
          <div 
            v-for="program in educationStore.programs" 
            :key="program.id"
            class="program-card"
            @click="selectProgram(program.id)"
            :class="{ active: educationStore.currentProgram?.id === program.id }"
          >
            <h3>{{ program.title }}</h3>
            <p>{{ program.description }}</p>
            <div class="program-stats">
              <span>📖 {{ program.courses.length }}개 과정</span>
              <span>📅 {{ formatDate(program.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 교육 과정 섹션 -->
    <div v-if="educationStore.currentProgram" class="courses-section">
      <div class="container">
        <div class="intro-section">
          <h2>{{ educationStore.currentProgram.title }}</h2>
          <p>{{ educationStore.currentProgram.description }}</p>
        </div>

        <div class="college-grid">
          <div 
            v-for="college in educationStore.colleges" 
            :key="college.name"
            class="college-section"
            :class="college.name.toLowerCase().replace(' ', '-')"
          >
            <div class="college-title">
              <span class="college-icon">{{ college.icon }}</span>
              <h3>{{ college.name }}</h3>
            </div>
            
            <div v-if="educationStore.coursesByCollege[college.name]?.length > 0" class="courses-list">
              <div 
                v-for="course in educationStore.coursesByCollege[college.name]" 
                :key="course.id"
                class="course-item"
                @click="openCourseDetail(course.id)"
              >
                <div class="course-header">
                  <span v-if="course.isSSAM" class="ssam-badge">SSAM</span>
                  <span v-if="course.category" class="course-category">{{ course.category }}</span>
                </div>
                
                <div class="course-name">
                  <h4>{{ course.name }}</h4>
                </div>
                
                <div class="course-details">
                  <div class="course-date">
                    <span>{{ course.date }} 📅 {{ course.duration }} ⏰</span>
                  </div>
                  <span class="course-type" :class="`type-${course.type.toLowerCase()}`">
                    {{ course.type }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-else class="no-courses">
              <p>등록된 교육 과정이 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 교육 과정 상세 모달 -->
    <Teleport to="body">
      <CourseDetailModal 
        v-if="selectedCourse" 
        :course="selectedCourse"
        @close="closeCourseDetail"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useEducationStore } from '@/stores/education';
import type { EducationCourse } from '@/types/education';
import CourseDetailModal from '@/components/CourseDetailModal.vue';

const educationStore = useEducationStore();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedCourse = ref<EducationCourse | null>(null);

const triggerFileUpload = async () => {
  await nextTick();
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      educationStore.uploadProgram(file);
    }
  } catch (error) {
    console.error('File upload error:', error);
    educationStore.error = '파일 업로드 중 오류가 발생했습니다.';
  }
};

const handleFileDrop = (event: DragEvent) => {
  try {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        educationStore.uploadProgram(file);
      }
    }
  } catch (error) {
    console.error('File drop error:', error);
    educationStore.error = '파일 드롭 중 오류가 발생했습니다.';
  }
};

const selectProgram = (programId: string) => {
  educationStore.setCurrentProgram(programId);
};

const openCourseDetail = (courseId: string) => {
  const course = educationStore.getCourseById(courseId);
  if (course) {
    selectedCourse.value = course;
  }
};

const closeCourseDetail = () => {
  selectedCourse.value = null;
};

const downloadTemplate = () => {
  educationStore.downloadTemplate();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR');
};

onMounted(() => {
  // 초기 데이터 로드 (필요시)
});

onUnmounted(() => {
  // 리소스 정리
  educationStore.error = null;
  educationStore.loading = false;
  
  // 파일 입력 정리
  if (fileInput.value) {
    fileInput.value.value = '';
    fileInput.value = null;
  }
});
</script>

<style scoped>
.education-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(252, 251, 249, 0.98) 0%,
    rgba(251, 250, 248, 0.95) 25%,
    rgba(250, 249, 247, 0.98) 50%,
    rgba(249, 248, 246, 0.95) 75%,
    rgba(248, 247, 245, 0.98) 100%);
  background-size: 400% 400%;
  animation: aurora-shift 20s ease-in-out infinite;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.education-page::before {
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
  pointer-events: none;
  z-index: -1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.education-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

.upload-section {
  margin-bottom: 3rem;
}

.upload-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.upload-card h2 {
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.upload-card p {
  color: #4a5568;
  margin-bottom: 1.5rem;
}

.template-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 15px;
  border: 2px dashed rgba(139, 92, 246, 0.2);
}

.template-button {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  margin-bottom: 1rem;
}

.template-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

.template-hint {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.upload-area {
  border: 2px dashed #8b5cf6;
  border-radius: 15px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(139, 92, 246, 0.05);
}

.upload-area:hover {
  border-color: #7c3aed;
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
}

.upload-hint {
  font-size: 0.9rem;
  color: #718096;
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #feb2b2;
}

.programs-section {
  margin-bottom: 3rem;
}

.programs-section h2 {
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.program-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.program-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.program-card.active {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.program-card h3 {
  color: #2d3748;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.program-card p {
  color: #4a5568;
  margin-bottom: 1rem;
}

.program-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #718096;
}

.courses-section {
  margin-bottom: 3rem;
}

.intro-section {
  text-align: center;
  margin-bottom: 3rem;
}

.intro-section h2 {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.intro-section p {
  color: #4a5568;
  font-size: 1.1rem;
}

.college-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.college-section {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 1.2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.college-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.college-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.2);
}

.college-icon {
  font-size: 1.5rem;
}

.college-title h3 {
  color: #2d3748;
  font-size: 1.3rem;
  margin: 0;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.course-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 1);
}

.course-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ssam-badge {
  background: linear-gradient(135deg, #c4976e, #d4a77e);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
}

.course-category {
  background: linear-gradient(135deg, #757db3, #8899c3);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
}

.course-name h4 {
  color: #2d3748;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.course-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.course-date {
  color: #4a5568;
  font-size: 0.9rem;
}

.course-type {
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
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

.no-courses {
  text-align: center;
  color: #718096;
  padding: 2rem;
}

@media (max-width: 1200px) {
  .college-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .college-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .programs-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .college-section {
    padding: 1rem;
  }
  
  .college-title h3 {
    font-size: 1.1rem;
  }
}
</style>
