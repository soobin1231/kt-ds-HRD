export interface ParsedContent {
  title: string
  content: string
}

export class FileParser {
  static async parseFile(file: File): Promise<ParsedContent> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          
          // 파일 확장자에 따른 파싱 로직
          const extension = file.name.split('.').pop()?.toLowerCase()
          
          switch (extension) {
            case 'txt':
              resolve(this.parseTextFile(content, file.name))
              break
            case 'md':
              resolve(this.parseMarkdownFile(content, file.name))
              break
            case 'json':
              resolve(this.parseJsonFile(content, file.name))
              break
            default:
              // 기본적으로 텍스트 파일로 처리
              resolve(this.parseTextFile(content, file.name))
          }
        } catch (error) {
          reject(new Error(`파일 파싱 중 오류가 발생했습니다: ${error}`))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
      }
      
      // 파일을 텍스트로 읽기
      reader.readAsText(file, 'UTF-8')
    })
  }
  
  private static parseTextFile(content: string, fileName: string): ParsedContent {
    const lines = content.split('\n').filter(line => line.trim())
    
    // 첫 번째 줄을 제목으로 사용하거나, 파일명을 제목으로 사용
    const title = lines.length > 0 && lines[0].length < 100 
      ? lines[0].trim() 
      : fileName.replace(/\.[^/.]+$/, '') // 확장자 제거
    
    // 내용은 전체 텍스트 사용
    const parsedContent = content.trim()
    
    return {
      title,
      content: parsedContent
    }
  }
  
  private static parseMarkdownFile(content: string, fileName: string): ParsedContent {
    const lines = content.split('\n')
    
    // 첫 번째 헤더(#)를 찾아서 제목으로 사용
    let title = fileName.replace(/\.[^/.]+$/, '') // 기본값: 파일명
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim()
        break
      }
    }
    
    return {
      title,
      content: content.trim()
    }
  }
  
  private static parseJsonFile(content: string, fileName: string): ParsedContent {
    try {
      const jsonData = JSON.parse(content)
      
      // JSON에서 title과 content 필드를 찾거나 기본값 사용
      const title = jsonData.title || jsonData.name || fileName.replace(/\.[^/.]+$/, '')
      const content = jsonData.content || jsonData.description || JSON.stringify(jsonData, null, 2)
      
      return {
        title,
        content
      }
    } catch (error) {
      // JSON 파싱 실패 시 텍스트 파일로 처리
      return this.parseTextFile(content, fileName)
    }
  }
}
