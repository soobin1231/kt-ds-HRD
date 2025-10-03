<template>
  <div class="vector-management-container min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- 헤더 -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">🗂️</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Vector Database 관리</h1>
            <p class="text-gray-600">업로드된 문서와 벡터 데이터베이스 상태를 관리합니다</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 벡터 DB 상태 대시보드 -->
      <div class="mb-8">
        <VectorDbDashboard 
          :db-status="vectorDbStatus" 
          :is-loading="isLoadingDbStatus"
          @refresh="refreshDbStatus"
        />
      </div>

      <!-- 문서 목록 테이블 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">업로드된 문서</h2>
          <div class="flex space-x-3">
            <button
              @click="refreshDocuments"
              :disabled="isLoadingDocuments"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoadingDocuments">새로고침 중...</span>
              <span v-else>새로고침</span>
            </button>
            <router-link 
              to="/embedding"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              새 문서 업로드
            </router-link>
          </div>
        </div>

        <!-- 문서 테이블 -->
        <VectorDocumentTable 
          :documents="documents"
          :is-loading="isLoadingDocuments"
          @delete-document="handleDeleteDocument"
          @view-details="handleViewDetails"
        />
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :document="selectedDocument"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- 문서 청크 상세 보기 모달 -->
    <DocumentChunksModal
      v-if="showChunksModal"
      :document="selectedDocument"
      @close="closeChunksModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { embeddingAPI } from '@/services/api'
import type { VectorDocument, VectorDbStatus } from '@/types/embedding'
import VectorDbDashboard from '@/components/VectorDbDashboard.vue'
import VectorDocumentTable from '@/components/VectorDocumentTable.vue'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'
import DocumentChunksModal from '@/components/DocumentChunksModal.vue'

// 상태 관리
const documents = ref<VectorDocument[]>([])
const vectorDbStatus = ref<VectorDbStatus>({
  totalDocuments: 0,
  totalChunks: 0,
  totalVectors: 0,
  databaseSize: '0 B',
  lastUpdated: new Date().toISOString(),
  status: 'healthy'
})

const isLoadingDbStatus = ref(false)
const isLoadingDocuments = ref(false)
const showDeleteModal = ref(false)
const showChunksModal = ref(false)
const selectedDocument = ref<VectorDocument | null>(null)

// 데이터 로딩 함수들
const loadDocuments = async () => {
  isLoadingDocuments.value = true
  try {
    const response = await embeddingAPI.getVectorDocuments()
    documents.value = response.data
  } catch (error) {
    console.error('문서 목록 로드 실패:', error)
  } finally {
    isLoadingDocuments.value = false
  }
}

const loadVectorDbStatus = async () => {
  isLoadingDbStatus.value = true
  try {
    const response = await embeddingAPI.getVectorDbStatus()
    vectorDbStatus.value = response.data
  } catch (error) {
    console.error('벡터 DB 상태 로드 실패:', error)
  } finally {
    isLoadingDbStatus.value = false
  }
}

// refresh 함수들
const refreshDbStatus = () => {
  loadVectorDbStatus()
}

const refreshDocuments = () => {
  loadDocuments()
  loadVectorDbStatus() // 상태도 함께 업데이트
}

// 이벤트 핸들러들
const handleDeleteDocument = (document: VectorDocument) => {
  selectedDocument.value = document
  showDeleteModal.value = true
}

const handleViewDetails = (document: VectorDocument) => {
  selectedDocument.value = document
  showChunksModal.value = true
}

const confirmDelete = async () => {
  if (!selectedDocument.value) return
  
  const fileName = selectedDocument.value.fileName
  
  try {
    console.log(`🗑️ 문서 "${fileName}" 삭제 중...`)
    await embeddingAPI.deleteVectorDocument(selectedDocument.value.id)
    
    // 목록에서 제거
    documents.value = documents.value.filter(doc => doc.id !== selectedDocument.value!.id)
    
    // 벡터 DB 상태 업데이트
    await loadVectorDbStatus()
    
    console.log(`✅ 문서 "${fileName}" 삭제 완료`)
  } catch (error) {
    console.error(`❌ 문서 "${fileName}" 삭제 실패:`, error)
    alert(`문서 삭제에 실패했습니다: ${error}`)
  } finally {
    showDeleteModal.value = false
    selectedDocument.value = null
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  selectedDocument.value = null
}

const closeChunksModal = () => {
  showChunksModal.value = false
  selectedDocument.value = null
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadDocuments()
  loadVectorDbStatus()
})
</script>

<style scoped>
.vector-management-container {
  font-family: 'Inter', sans-serif;
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

.flex > div,
.bg-white {
  animation: fadeIn 0.3s ease-out;
}
</style>
