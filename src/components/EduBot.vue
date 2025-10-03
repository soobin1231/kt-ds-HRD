<template>
  <div class="edubot-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <!-- 헤더 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">🤖</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">EduBot</h1>
            <p class="text-gray-600">교육제도 및 Q&A 전문 챗봇</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 채팅 영역 -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
        <!-- 메시지 영역 -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- 환영 메시지 -->
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
            <div class="text-4xl mb-4">👋</div>
            <p class="text-lg">안녕하세요! DS University EduBot입니다.</p>
            <p class="text-sm mt-2">교육제도나 Q&A에 대해 궁금한 것이 있으시면 언제든 물어보세요!</p>
          </div>

          <!-- 메시지들 -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-xs lg:max-w-md px-4 py-3 rounded-lg',
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              ]"
            >
              <div class="whitespace-pre-wrap">{{ message.content }}</div>
              <div class="text-xs mt-1 opacity-70">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>

          <!-- 로딩 인디케이터 -->
          <div v-if="isLoading" class="flex justify-start">
            <div class="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>답변을 생성하고 있습니다...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="border-t p-4">
          <div class="flex space-x-3">
            <input
              v-model="inputMessage"
              @keypress.enter="sendMessage"
              :disabled="isLoading"
              placeholder="교육제도나 Q&A에 대해 질문해보세요..."
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              @click="sendMessage"
              :disabled="isLoading || !inputMessage.trim()"
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </div>
          
          <!-- 빠른 질문 버튼들 -->
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="quickQuestion in quickQuestions"
              :key="quickQuestion"
              @click="sendQuickQuestion(quickQuestion)"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:bg-gray-50 transition-colors"
            >
              {{ quickQuestion }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { chatbotApi } from '@/services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()

const quickQuestions = [
  '교육제도는 어떻게 되나요?',
  '신입사원 교육 과정은?',
  '온라인 교육은 어떻게 신청하나요?',
  '교육비 지원 정책은?',
  '자격증 취득 지원은?'
]

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage: Message = {
    role: 'user',
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const question = inputMessage.value.trim()
  inputMessage.value = ''
  isLoading.value = true

  scrollToBottom()

  try {
    const response = await chatbotApi.post('/api/chat/query', {
      message: question,
      use_search: true,
      search_top_k: 5,
      temperature: 0.7
    })

    const assistantMessage: Message = {
      role: 'assistant',
      content: response.data.message,
      timestamp: new Date()
    }

    messages.value.push(assistantMessage)
  } catch (error) {
    console.error('챗봇 API 오류:', error)
    
    const errorMessage: Message = {
      role: 'assistant',
      content: '죄송합니다. 현재 서버에 문제가 있어 답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.',
      timestamp: new Date()
    }

    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const sendQuickQuestion = (question: string) => {
  inputMessage.value = question
  sendMessage()
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.edubot-container {
  font-family: 'Inter', sans-serif;
}

/* 스크롤바 스타일링 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex > div {
  animation: fadeIn 0.3s ease-out;
}
</style>