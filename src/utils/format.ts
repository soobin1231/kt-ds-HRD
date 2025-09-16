export const formatFileSize = (bytes: number | undefined | null): string => {
  if (bytes === undefined || bytes === null || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDate = (date: string | undefined | null): string => {
  if (!date) return '날짜 없음'
  try {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return '날짜 오류'
  }
}

export const formatDateTime = (date: string | undefined | null): string => {
  if (!date) return '날짜 없음'
  try {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return '날짜 오류'
  }
}

export const getFileIcon = (mimeType: string | undefined | null): string => {
  if (!mimeType || typeof mimeType !== 'string') return '📁'
  
  const type = mimeType.toLowerCase()
  if (type.includes('pdf')) return '📄'
  if (type.includes('word')) return '📝'
  if (type.includes('excel')) return '📊'
  if (type.includes('powerpoint')) return '📈'
  if (type.includes('image')) return '🖼️'
  if (type.includes('video')) return '🎥'
  if (type.includes('audio')) return '🎵'
  return '📁'
}