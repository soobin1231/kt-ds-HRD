import mammoth from 'mammoth'

export interface ParsedEducationSystem {
  title: string
  description: string
  category: string
  requirements?: string[]
  benefits?: string[]
  process?: string[]
  confidence: number
}

export class WordParser {
  /**
   * 워드 파일을 읽고 교육제도를 분석합니다
   */
  static async parseWordFile(file: File): Promise<ParsedEducationSystem[]> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const text = result.value

      console.log('추출된 텍스트 길이:', text?.length || 0)
      console.log('추출된 텍스트 미리보기:', text?.substring(0, 200) + '...')

      if (!text || text.trim().length === 0) {
        throw new Error('파일에서 텍스트를 읽을 수 없습니다.')
      }

      const systems = this.extractEducationSystems(text, file.name)
      console.log('추출된 교육제도 개수:', systems.length)
      
      return systems
    } catch (error) {
      console.error('Word file parsing error:', error)
      throw new Error(`워드 파일 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  /**
   * 텍스트에서 교육제도를 추출하고 분석합니다 (하나의 파일 = 하나의 교육제도)
   */
  private static extractEducationSystems(text: string, fileName?: string): ParsedEducationSystem[] {
    const systems: ParsedEducationSystem[] = []
    
    // 카테고리 매핑
    const categoryMapping = {
      '자격증': ['자격증', '인증', '수료증', '자격', '면허'],
      '직무교육': ['직무교육', '직무훈련', '직무개발', '직무역량'],
      '개인개발': ['개인개발', '자기계발', '역량개발', '스킬업'],
      '전문분야': ['전문교육', '전문과정', '전문자격', '전문인력']
    }

    // 전체 텍스트를 하나의 교육제도로 처리
    if (text.trim().length > 10) {
      const system = this.parseEducationSystem(text.trim(), categoryMapping, fileName)
      if (system) {
        systems.push(system)
      }
    }

    return systems
  }

  /**
   * 개별 교육제도를 파싱합니다
   */
  private static parseEducationSystem(text: string, categoryMapping: any, fileName?: string): ParsedEducationSystem | null {
    try {
      // 파일명에서 확장자 제거하여 제목으로 사용
      let title = fileName ? fileName.replace(/\.(doc|docx)$/i, '').trim() : ''
      
      // 파일명이 없거나 너무 짧으면 텍스트에서 제목 추출
      if (!title || title.length < 3) {
        title = this.extractTitle(text)
      }
      
      // 설명 추출
      const description = this.extractDescription(text)
      
      // 카테고리 분류
      const category = this.categorizeSystem(text, categoryMapping)
      
      // 요구사항 추출
      const requirements = this.extractRequirements(text)
      
      // 혜택 추출
      const benefits = this.extractBenefits(text)
      
      // 과정 추출
      const process = this.extractProcess(text)
      
      // 신뢰도 계산
      const confidence = this.calculateConfidence(text, title, description)

      if (confidence < 0.2) {
        return null // 신뢰도가 너무 낮으면 제외
      }

      return {
        title,
        description,
        category,
        requirements,
        benefits,
        process,
        confidence
      }
    } catch (error) {
      console.error('Error parsing education system:', error)
      return null
    }
  }

  /**
   * 제목을 추출합니다
   */
  private static extractTitle(text: string): string {
    // 첫 번째 문장을 제목으로 사용
    const sentences = text.split(/[.!?]/)
    const firstSentence = sentences[0]?.trim()
    
    if (firstSentence && firstSentence.length > 5 && firstSentence.length < 100) {
      return firstSentence
    }

    // 특정 패턴으로 제목 찾기
    const titlePatterns = [
      /^(.{10,80})\s*[:：]/,
      /^(.{10,80})\s*[-–]/,
      /^(.{10,80})\s*[•·]/
    ]

    for (const pattern of titlePatterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    // 기본값
    return text.substring(0, 50).trim() + (text.length > 50 ? '...' : '')
  }

  /**
   * 설명을 추출합니다 (구조화된 형태로)
   */
  private static extractDescription(text: string): string {
    // 텍스트를 문단별로 분리
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    if (paragraphs.length === 0) {
      return text.trim()
    }
    
    // 첫 번째 문단을 기본 설명으로 사용
    let description = paragraphs[0].trim()
    
    // 특정 키워드가 포함된 문단들을 찾아서 구조화
    const structuredSections: string[] = []
    
    for (let i = 1; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim()
      if (paragraph.length > 10) {
        // 섹션 헤더가 있는지 확인
        const sectionHeaders = ['개요', '목적', '소개', '설명', '개요', '개념', '정의']
        const hasHeader = sectionHeaders.some(header => paragraph.toLowerCase().includes(header.toLowerCase()))
        
        if (hasHeader) {
          structuredSections.push(`📋 ${paragraph}`)
        } else {
          structuredSections.push(`• ${paragraph}`)
        }
      }
    }
    
    if (structuredSections.length > 0) {
      description += '\n\n' + structuredSections.join('\n\n')
    }
    
    return description
  }

  /**
   * 카테고리를 분류합니다
   */
  private static categorizeSystem(text: string, categoryMapping: any): string {
    const lowerText = text.toLowerCase()
    
    for (const [category, keywords] of Object.entries(categoryMapping)) {
      if ((keywords as string[]).some((keyword: string) => lowerText.includes(keyword.toLowerCase()))) {
        return category
      }
    }

    return '기타'
  }

  /**
   * 요구사항을 추출합니다 (구조화된 형태로)
   */
  private static extractRequirements(text: string): string[] {
    const requirements: string[] = []
    
    // 요구사항 관련 키워드
    const requirementKeywords = ['요구사항', '필수조건', '자격요건', '지원자격', '참가조건', '필요조건', '선수과목']
    
    // 문단별로 검색
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    for (const paragraph of paragraphs) {
      const lowerParagraph = paragraph.toLowerCase()
      
      for (const keyword of requirementKeywords) {
        if (lowerParagraph.includes(keyword.toLowerCase())) {
          // 키워드 이후의 내용을 추출
          const keywordIndex = lowerParagraph.indexOf(keyword.toLowerCase())
          const afterKeyword = paragraph.substring(keywordIndex + keyword.length).trim()
          
          if (afterKeyword.length > 10) {
            // 문장별로 분리하여 각각을 요구사항으로 추가
            const sentences = afterKeyword.split(/[.!?]/).filter(s => s.trim().length > 5)
            requirements.push(...sentences.map(s => s.trim()).filter(s => s.length > 0))
          }
          break
        }
      }
    }
    
    // 리스트 형태의 내용도 찾기
    const listPattern = /(?:요구사항|필수조건|자격요건)[\s\S]*?(?:\n\s*[-•]\s*|\n\s*\d+\.\s*)([\s\S]*?)(?=\n\s*(?:혜택|과정|교육|프로그램)|$)/i
    const listMatch = text.match(listPattern)
    if (listMatch) {
      const listContent = listMatch[1]
      const listItems = listContent.split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/).filter(item => item.trim().length > 5)
      requirements.push(...listItems.map(item => item.trim()))
    }

    return requirements.slice(0, 10) // 최대 10개까지만
  }

  /**
   * 혜택을 추출합니다 (구조화된 형태로)
   */
  private static extractBenefits(text: string): string[] {
    const benefits: string[] = []
    
    // 혜택 관련 키워드
    const benefitKeywords = ['혜택', '장점', '효과', '기대효과', '성과', '효익', '이점', '장점']
    
    // 문단별로 검색
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    for (const paragraph of paragraphs) {
      const lowerParagraph = paragraph.toLowerCase()
      
      for (const keyword of benefitKeywords) {
        if (lowerParagraph.includes(keyword.toLowerCase())) {
          // 키워드 이후의 내용을 추출
          const keywordIndex = lowerParagraph.indexOf(keyword.toLowerCase())
          const afterKeyword = paragraph.substring(keywordIndex + keyword.length).trim()
          
          if (afterKeyword.length > 10) {
            // 문장별로 분리하여 각각을 혜택으로 추가
            const sentences = afterKeyword.split(/[.!?]/).filter(s => s.trim().length > 5)
            benefits.push(...sentences.map(s => s.trim()).filter(s => s.length > 0))
          }
          break
        }
      }
    }
    
    // 리스트 형태의 내용도 찾기
    const listPattern = /(?:혜택|장점|효과|기대효과)[\s\S]*?(?:\n\s*[-•]\s*|\n\s*\d+\.\s*)([\s\S]*?)(?=\n\s*(?:과정|교육|프로그램|요구사항)|$)/i
    const listMatch = text.match(listPattern)
    if (listMatch) {
      const listContent = listMatch[1]
      const listItems = listContent.split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/).filter(item => item.trim().length > 5)
      benefits.push(...listItems.map(item => item.trim()))
    }

    return benefits.slice(0, 10) // 최대 10개까지만
  }

  /**
   * 과정을 추출합니다 (구조화된 형태로)
   */
  private static extractProcess(text: string): string[] {
    const process: string[] = []
    
    // 과정 관련 키워드
    const processKeywords = ['과정', '절차', '단계', '진행방법', '교육과정', '프로그램', '커리큘럼', '일정']
    
    // 문단별로 검색
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    
    for (const paragraph of paragraphs) {
      const lowerParagraph = paragraph.toLowerCase()
      
      for (const keyword of processKeywords) {
        if (lowerParagraph.includes(keyword.toLowerCase())) {
          // 키워드 이후의 내용을 추출
          const keywordIndex = lowerParagraph.indexOf(keyword.toLowerCase())
          const afterKeyword = paragraph.substring(keywordIndex + keyword.length).trim()
          
          if (afterKeyword.length > 10) {
            // 문장별로 분리하여 각각을 과정으로 추가
            const sentences = afterKeyword.split(/[.!?]/).filter(s => s.trim().length > 5)
            process.push(...sentences.map(s => s.trim()).filter(s => s.length > 0))
          }
          break
        }
      }
    }
    
    // 리스트 형태의 내용도 찾기
    const listPattern = /(?:과정|절차|단계|진행방법|교육과정)[\s\S]*?(?:\n\s*[-•]\s*|\n\s*\d+\.\s*)([\s\S]*?)(?=\n\s*(?:혜택|요구사항|교육|프로그램)|$)/i
    const listMatch = text.match(listPattern)
    if (listMatch) {
      const listContent = listMatch[1]
      const listItems = listContent.split(/\n\s*[-•]\s*|\n\s*\d+\.\s*/).filter(item => item.trim().length > 5)
      process.push(...listItems.map(item => item.trim()))
    }

    return process.slice(0, 10) // 최대 10개까지만
  }

  /**
   * 신뢰도를 계산합니다
   */
  private static calculateConfidence(text: string, title: string, description: string): number {
    let confidence = 0.3 // 기본 신뢰도를 낮춤

    // 텍스트 길이에 따른 가중치
    if (text.length > 50) confidence += 0.1
    if (text.length > 100) confidence += 0.1
    if (text.length > 200) confidence += 0.1

    // 제목 품질
    if (title.length > 5 && title.length < 100) confidence += 0.1
    if (description.length > 20) confidence += 0.1

    // 교육 관련 키워드 포함 (더 많은 키워드)
    const educationKeywords = [
      '교육', '자격', '과정', '프로그램', '훈련', '개발',
      '학습', '연수', '시스템', '제도', '인증', '수료',
      '직무', '전문', '역량', '스킬', '온라인', '디지털'
    ]
    const keywordCount = educationKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length
    confidence += keywordCount * 0.03

    // 최소 신뢰도 보장
    return Math.max(confidence, 0.2)
  }

}

