<template>
  <div class="education-news-form">
    <div class="form-container">
      <h3 class="form-title">새로운 교육 뉴스 추가</h3>
      
      <form @submit.prevent="handleSubmit" class="form">
        <!-- 제목 입력 -->
        <div class="form-group">
          <label for="title" class="form-label">교육명 *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="예: 데이터 사이언스 기초 교육"
            required
          />
        </div>
        
        <!-- 내용 입력 -->
        <div class="form-group">
          <label for="content" class="form-label">교육 내용 *</label>
          <textarea
            id="content"
            v-model="form.content"
            class="form-textarea"
            rows="4"
            placeholder="교육 내용을 자세히 입력해주세요..."
            required
          ></textarea>
        </div>
        
        <!-- 우선순위 선택 -->
        <div class="form-group">
          <label for="priority" class="form-label">우선순위 *</label>
          <select id="priority" v-model="form.priority" class="form-select" required>
            <option value="">우선순위를 선택하세요</option>
            <option value="high">높음 (🔥 중요)</option>
            <option value="medium">보통 (⚡ 일반)</option>
            <option value="low">낮음 (💡 참고)</option>
          </select>
        </div>
        
        <!-- 활성화 여부 -->
        <div class="form-group">
          <label class="form-label">표시 여부</label>
          <div class="checkbox-group">
            <input
              id="is_active"
              v-model="form.is_active"
              type="checkbox"
              class="form-checkbox"
            />
            <label for="is_active" class="checkbox-label">
              즉시 화면에 표시
            </label>
          </div>
        </div>
        
        <!-- 버튼 그룹 -->
        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn-secondary">
            취소
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '추가 중...' : '추가하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CreateEducationNewsRequest } from '@/types/education-news'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: CreateEducationNewsRequest): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const form = reactive<CreateEducationNewsRequest>({
  title: '',
  content: '',
  priority: 'medium',
  is_active: true
})

const handleSubmit = () => {
  if (!form.title.trim() || !form.content.trim()) {
    alert('제목과 내용을 모두 입력해주세요.')
    return
  }
  
  emit('submit', { ...form })
  
  // 폼 초기화
  form.title = ''
  form.content = ''
  form.priority = 'medium'
  form.is_active = true
}
</script>

<style scoped>
.education-news-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
}

.checkbox-label {
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .form-container {
    padding: 24px 20px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
