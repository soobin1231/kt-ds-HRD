export interface ChunkingSettings {
  autoOptimize: boolean
  // 자동 최적화가 비활성화될 때만 사용
  chunkSize?: number  // 문자 수 기준 (기본값: 500)
  overlap?: number     // 문자 수 기준 (기본값: 100)
}

export interface PreprocessingOptions {
  removeEmptyLines: boolean
  normalizeSpacing: boolean
  removeMarkdown: boolean
}

export interface XlsxConfig {
  ruleType: 'auto' | 'course' | 'news' | 'system' | 'material'
}

export interface UploadedFile {
  file: File
  name: string
  size: number
  type: string
}

export interface ProcessingLog {
  type: 'info' | 'success' | 'error' | 'warning'
  message: string
  timestamp: Date
}

export interface ProcessingResponse {
  chunks: number
  success: boolean
  message: string
  fileId?: string
}

export interface EmbeddingStatus {
  totalFiles: number
  processedFiles: number
  totalChunks: number
  lastUpdated: Date
}

// 벡터 관리 페이지용 타입들
export interface VectorDocument {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
  chunkCount: number
  vectorCount: number
  fileSize: number
  status: 'processing' | 'completed' | 'error'
  lastUpdated: string
  // 확장된 메타데이터
  tags?: string[]
  category?: string
  language?: string
  version?: string
  totalChunks?: number
}

export interface VectorDbStatus {
  totalDocuments: number
  totalChunks: number
  totalVectors: number
  databaseSize: string
  lastUpdated: string
  status: 'healthy' | 'warning' | 'error'
}

export interface VectorManagementStats {
  recentUploads: VectorDocument[]
  processingQueue: number
  errorCount: number
  averageProcessingTime: number
}

// 문서 청크 정보
export interface DocumentChunk {
  chunk_id: string
  chunk_index: number
  content: string
  content_length: number
  created_at: string
  strategy: string
  auto_optimized: boolean
  chunk_size: number
  overlap: number
  source_file: string
  file_type: string
  language: string
}

// 문서 청크 응답
export interface DocumentChunksResponse {
  document_id: string
  chunks: DocumentChunk[]
  total_chunks: number
}

