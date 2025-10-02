export interface ChunkingSettings {
  chunkSize: number
  overlap: number
  strategy: 'word' | 'sentence' | 'paragraph'
  preserveStructure: boolean
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

