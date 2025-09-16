import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

export interface DocumentAnalysisResult {
  extractedSystems: ExtractedEducationSystem[];
  summary: string;
  recommendations: string[];
  confidence: number;
}

export interface ExtractedEducationSystem {
  name: string;
  description: string;
  category: 'certification' | 'training' | 'development' | 'specialization';
  targetAudience: string[];
  duration: string;
  requirements: string[];
  benefits: string[];
  process: string[];
  icon: string;
  color: string;
  confidence: number;
}

export class DocumentAnalyzer {
  /**
   * 문서를 분석하여 교육제도를 추출합니다
   */
  static async analyzeDocument(file: File): Promise<DocumentAnalysisResult> {
    try {
      const fileType = this.getFileType(file);
      let content = '';

      switch (fileType) {
        case 'excel':
          content = await this.parseExcelContent(file);
          break;
        case 'powerpoint':
          content = await this.parsePowerPointContent(file);
          break;
        case 'word':
          content = await this.parseWordContent(file);
          break;
        default:
          throw new Error('지원하지 않는 파일 형식입니다.');
      }

      // 교육제도 분석
      const analysisResult = this.analyzeEducationSystems(content);
      
      return analysisResult;
    } catch (error) {
      console.error('Document analysis error:', error);
      throw new Error('문서 분석 중 오류가 발생했습니다.');
    }
  }

  /**
   * 엑셀 파일 내용을 파싱합니다
   */
  private static async parseExcelContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            reject(new Error('파일을 읽을 수 없습니다.'));
            return;
          }
          
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          let content = '';
          
          // 모든 시트를 순회하며 내용 추출
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            jsonData.forEach((row: any[]) => {
              if (Array.isArray(row)) {
                const rowText = row
                  .filter(cell => cell && typeof cell === 'string')
                  .join(' ');
                if (rowText.trim()) {
                  content += rowText.trim() + '\n';
                }
              }
            });
          });
          
          resolve(content);
        } catch (error) {
          reject(new Error('엑셀 파일을 읽는 중 오류가 발생했습니다.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 파워포인트 파일 내용을 파싱합니다
   */
  private static async parsePowerPointContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          // mammoth가 실패하면 파일명 기반으로 기본 내용 생성
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          resolve(`PowerPoint 프레젠테이션: ${fileName}\n\n이 파일은 PowerPoint 프레젠테이션입니다.`);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 워드 파일 내용을 파싱합니다
   */
  private static async parseWordContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error('워드 파일을 읽는 중 오류가 발생했습니다.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 파일 타입을 확인합니다
   */
  private static getFileType(file: File): 'excel' | 'powerpoint' | 'word' | 'unknown' {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['xlsx', 'xls'].includes(extension || '')) {
      return 'excel';
    } else if (['pptx', 'ppt'].includes(extension || '')) {
      return 'powerpoint';
    } else if (['docx', 'doc'].includes(extension || '')) {
      return 'word';
    }
    
    return 'unknown';
  }

  /**
   * 문서 내용을 분석하여 교육제도를 추출합니다
   */
  private static analyzeEducationSystems(content: string): DocumentAnalysisResult {
    const lines = content.split('\n').filter(line => line.trim());
    const extractedSystems: ExtractedEducationSystem[] = [];
    
    // 교육제도 관련 키워드 패턴
    const educationPatterns = [
      /교육.*프로그램/i,
      /자격증.*취득/i,
      /전문가.*양성/i,
      /교육.*과정/i,
      /훈련.*프로그램/i,
      /개발.*교육/i,
      /스킬.*업/i,
      /역량.*강화/i
    ];

    // 카테고리 분류 키워드
    const categoryKeywords = {
      certification: ['자격증', '인증', 'certification', 'license', 'qualification'],
      training: ['교육', '훈련', 'training', '교육과정', '교육프로그램'],
      development: ['개발', '성장', 'development', '개인개발', '자기계발'],
      specialization: ['전문', '특화', 'specialization', '전문가', '전문분야']
    };

    // 아이콘 매핑
    const iconMapping: Record<string, string> = {
      '클라우드': '☁️',
      '데이터': '📊',
      'AI': '🤖',
      '보안': '🔒',
      '네트워크': '🌐',
      '개발': '💻',
      '디자인': '🎨',
      '마케팅': '📱',
      '관리': '📋',
      '분석': '📈'
    };

    // 색상 매핑
    const colorMapping: Record<string, string> = {
      '클라우드': 'bg-orange-100 text-orange-800',
      '데이터': 'bg-blue-100 text-blue-800',
      'AI': 'bg-purple-100 text-purple-800',
      '보안': 'bg-red-100 text-red-800',
      '네트워크': 'bg-green-100 text-green-800',
      '개발': 'bg-indigo-100 text-indigo-800',
      '디자인': 'bg-pink-100 text-pink-800',
      '마케팅': 'bg-yellow-100 text-yellow-800',
      '관리': 'bg-gray-100 text-gray-800',
      '분석': 'bg-teal-100 text-teal-800'
    };

    // 교육제도 추출 로직
    let currentSystem: Partial<ExtractedEducationSystem> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 교육제도 시작 패턴 감지
      if (educationPatterns.some(pattern => pattern.test(line))) {
        if (currentSystem) {
          // 이전 시스템 완성
          if (currentSystem.name && currentSystem.description) {
            extractedSystems.push(this.completeEducationSystem(currentSystem, iconMapping, colorMapping));
          }
        }
        
        // 새 시스템 시작
        currentSystem = {
          name: line.trim(),
          description: '',
          targetAudience: [],
          requirements: [],
          benefits: [],
          process: [],
          confidence: 0.7
        };
      }
      
      // 현재 시스템 정보 수집
      if (currentSystem) {
        // 설명 추출
        if (!currentSystem.description && line.length > 20) {
          currentSystem.description = line.trim();
        }
        
        // 대상자 추출
        if (line.includes('대상') || line.includes('참가자') || line.includes('수강생')) {
          const audience = this.extractListItems(line);
          currentSystem.targetAudience.push(...audience);
        }
        
        // 요구사항 추출
        if (line.includes('요구사항') || line.includes('필수') || line.includes('선수')) {
          const requirements = this.extractListItems(line);
          currentSystem.requirements.push(...requirements);
        }
        
        // 혜택 추출
        if (line.includes('혜택') || line.includes('장점') || line.includes('효과')) {
          const benefits = this.extractListItems(line);
          currentSystem.benefits.push(...benefits);
        }
        
        // 과정 추출
        if (line.includes('과정') || line.includes('단계') || line.includes('절차')) {
          const process = this.extractListItems(line);
          currentSystem.process.push(...process);
        }
        
        // 기간 추출
        if (line.includes('개월') || line.includes('주') || line.includes('일') || line.includes('시간')) {
          const durationMatch = line.match(/(\d+[개월주일시간])/);
          if (durationMatch) {
            currentSystem.duration = durationMatch[1];
          }
        }
      }
    }
    
    // 마지막 시스템 처리
    if (currentSystem && currentSystem.name && currentSystem.description) {
      extractedSystems.push(this.completeEducationSystem(currentSystem, iconMapping, colorMapping));
    }

    // 카테고리 자동 분류
    extractedSystems.forEach(system => {
      system.category = this.classifyCategory(system.name + ' ' + system.description, categoryKeywords);
    });

    // 요약 및 추천 생성
    const summary = this.generateSummary(extractedSystems);
    const recommendations = this.generateRecommendations(extractedSystems);
    const confidence = this.calculateConfidence(extractedSystems);

    return {
      extractedSystems,
      summary,
      recommendations,
      confidence
    };
  }

  /**
   * 교육제도 정보를 완성합니다
   */
  private static completeEducationSystem(
    system: Partial<ExtractedEducationSystem>,
    iconMapping: Record<string, string>,
    colorMapping: Record<string, string>
  ): ExtractedEducationSystem {
    // 기본값 설정
    const name = system.name || '교육 프로그램';
    const description = system.description || '문서에서 추출한 교육 프로그램입니다.';
    
    // 아이콘 및 색상 결정
    let icon = '📚';
    let color = 'bg-gray-100 text-gray-800';
    
    for (const [keyword, iconValue] of Object.entries(iconMapping)) {
      if (name.includes(keyword) || description.includes(keyword)) {
        icon = iconValue;
        color = colorMapping[keyword] || color;
        break;
      }
    }

    return {
      name,
      description,
      category: system.category || 'training',
      targetAudience: system.targetAudience.length > 0 ? system.targetAudience : ['모든 직원'],
      duration: system.duration || '미정',
      requirements: system.requirements.length > 0 ? system.requirements : ['기본적인 업무 지식'],
      benefits: system.benefits.length > 0 ? system.benefits : ['전문성 향상', '업무 역량 강화'],
      process: system.process.length > 0 ? system.process : ['이론 학습', '실습', '평가'],
      icon,
      color,
      confidence: system.confidence || 0.5
    };
  }

  /**
   * 카테고리를 자동 분류합니다
   */
  private static classifyCategory(
    text: string,
    categoryKeywords: Record<string, string[]>
  ): 'certification' | 'training' | 'development' | 'specialization' {
    const scores: Record<string, number> = {
      certification: 0,
      training: 0,
      development: 0,
      specialization: 0
    };

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          scores[category]++;
        }
      });
    });

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'training';

    const category = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    return category as 'certification' | 'training' | 'development' | 'specialization';
  }

  /**
   * 리스트 항목을 추출합니다
   */
  private static extractListItems(text: string): string[] {
    const items: string[] = [];
    
    // 쉼표로 구분된 항목들
    const commaItems = text.split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
    items.push(...commaItems);
    
    // 줄바꿈으로 구분된 항목들
    const lineItems = text.split('\n').map(item => item.trim()).filter(item => item.length > 0);
    items.push(...lineItems);
    
    return [...new Set(items)]; // 중복 제거
  }

  /**
   * 요약을 생성합니다
   */
  private static generateSummary(systems: ExtractedEducationSystem[]): string {
    if (systems.length === 0) {
      return '문서에서 교육제도를 찾을 수 없습니다.';
    }

    const categories = [...new Set(systems.map(s => s.category))];
    const categoryNames = {
      certification: '자격증 취득',
      training: '직무 교육',
      development: '개인 개발',
      specialization: '전문 분야'
    };

    return `문서에서 총 ${systems.length}개의 교육제도를 발견했습니다. ${categories.map(c => categoryNames[c]).join(', ')} 분야의 프로그램들이 포함되어 있습니다.`;
  }

  /**
   * 추천사항을 생성합니다
   */
  private static generateRecommendations(systems: ExtractedEducationSystem[]): string[] {
    const recommendations: string[] = [];
    
    if (systems.length === 0) {
      recommendations.push('문서에 더 명확한 교육제도 정보를 추가해주세요.');
      return recommendations;
    }

    recommendations.push(`${systems.length}개의 교육제도를 시스템에 등록하는 것을 권장합니다.`);
    
    const categories = [...new Set(systems.map(s => s.category))];
    if (categories.length > 1) {
      recommendations.push('다양한 분야의 교육제도가 포함되어 있어 종합적인 교육 프로그램 구축이 가능합니다.');
    }

    const highConfidenceSystems = systems.filter(s => s.confidence > 0.7);
    if (highConfidenceSystems.length > 0) {
      recommendations.push(`${highConfidenceSystems.length}개의 교육제도가 높은 신뢰도로 추출되었습니다.`);
    }

    return recommendations;
  }

  /**
   * 전체 신뢰도를 계산합니다
   */
  private static calculateConfidence(systems: ExtractedEducationSystem[]): number {
    if (systems.length === 0) return 0;
    
    const totalConfidence = systems.reduce((sum, system) => sum + system.confidence, 0);
    return totalConfidence / systems.length;
  }
}

