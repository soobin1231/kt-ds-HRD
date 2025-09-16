import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import type { EducationCourse, EducationProgram, CollegeInfo } from '@/types/education';

export const useEducationStore = defineStore('education', () => {
  const programs = ref<EducationProgram[]>([]);
  const currentProgram = ref<EducationProgram | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const colleges: CollegeInfo[] = [
    {
      name: 'Cloud College',
      description: '클라우드 기술과 마이크로서비스 아키텍처 전문 교육',
      color: 'rgba(135, 160, 200, 0.7)',
      icon: '☁️'
    },
    {
      name: 'SW College',
      description: '소프트웨어 개발과 품질관리 전문 교육',
      color: 'rgba(135, 160, 200, 0.7)',
      icon: '💻'
    },
    {
      name: 'IA College',
      description: '인프라와 데이터베이스 관리 전문 교육',
      color: 'rgba(135, 200, 180, 0.7)',
      icon: '🏗️'
    },
    {
      name: 'AI College',
      description: '인공지능과 자동화 기술 전문 교육',
      color: 'rgba(160, 135, 200, 0.7)',
      icon: '🤖'
    }
  ];

  const coursesByCollege = computed(() => {
    if (!currentProgram.value) return {};
    
    return currentProgram.value.courses.reduce((acc, course) => {
      if (!acc[course.college]) {
        acc[course.college] = [];
      }
      acc[course.college].push(course);
      return acc;
    }, {} as Record<string, EducationCourse[]>);
  });

  const getCollegeInfo = (collegeName: string): CollegeInfo | undefined => {
    return colleges.find(college => college.name === collegeName);
  };

  const uploadProgram = async (file: File): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      // 파일 유효성 검사
      if (!file) {
        throw new Error('파일이 선택되지 않았습니다.');
      }
      
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
      }

      // 엑셀 파일을 읽어서 교육 프로그램 데이터로 변환
      const programData = await parseExcelFile(file);
      
      const newProgram: EducationProgram = {
        id: `program_${Date.now()}`,
        title: programData.title || '새 교육 프로그램',
        description: programData.description || '',
        courses: programData.courses,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      programs.value.push(newProgram);
      currentProgram.value = newProgram;
    } catch (err) {
      console.error('Upload program error:', err);
      error.value = err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.';
    } finally {
      loading.value = false;
    }
  };

  const parseExcelFile = async (file: File): Promise<{ title: string; description: string; courses: EducationCourse[] }> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            if (!e.target?.result) {
              reject(new Error('파일을 읽을 수 없습니다.'));
              return;
            }
            
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 첫 번째 시트를 읽음
            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
              reject(new Error('엑셀 파일에 시트가 없습니다.'));
              return;
            }
            
            const worksheet = workbook.Sheets[firstSheetName];
            if (!worksheet) {
              reject(new Error('시트를 읽을 수 없습니다.'));
              return;
            }
            
            // 시트를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // 데이터 파싱
            const parsedData = parseExcelData(jsonData);
            resolve(parsedData);
          } catch (error) {
            console.error('Excel parsing error:', error);
            reject(new Error('엑셀 파일을 읽는 중 오류가 발생했습니다.'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
        };
        
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('FileReader error:', error);
        reject(new Error('파일 읽기 초기화 중 오류가 발생했습니다.'));
      }
    });
  };

  const parseExcelData = (data: any[][]): { title: string; description: string; courses: EducationCourse[] } => {
    const courses: EducationCourse[] = [];
    let title = 'DS University 교육 프로그램';
    let description = '업로드된 교육 프로그램';

    // 헤더 행 찾기 (첫 번째 행이 헤더라고 가정)
    if (data.length < 2) {
      throw new Error('엑셀 파일에 충분한 데이터가 없습니다.');
    }

    const headers = data[0] as string[];
    const dataRows = data.slice(1);

    // 필수 컬럼 확인
    const requiredColumns = ['교육명', '내용', '대학', '강사', '일정', '시간', '유형'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`필수 컬럼이 누락되었습니다: ${missingColumns.join(', ')}`);
    }

    // 각 행을 교육 과정으로 변환
    dataRows.forEach((row: any[], index: number) => {
      if (row.length === 0 || !row[0]) return; // 빈 행 건너뛰기

      try {
        const course: EducationCourse = {
          id: `course_${Date.now()}_${index}`,
          name: row[headers.indexOf('교육명')] || '',
          description: row[headers.indexOf('내용')] || '',
          college: mapCollegeName(row[headers.indexOf('대학')] || ''),
          category: row[headers.indexOf('카테고리')] || undefined,
          instructor: row[headers.indexOf('강사')] || '',
          date: row[headers.indexOf('일정')] || '',
          duration: row[headers.indexOf('시간')] || '',
          type: mapCourseType(row[headers.indexOf('유형')] || '기본'),
          isSSAM: row[headers.indexOf('SSAM')] === 'Y' || row[headers.indexOf('SSAM')] === true,
          prerequisites: parseArrayField(row[headers.indexOf('선수과목')]),
          objectives: parseArrayField(row[headers.indexOf('교육목표')]) || ['교육 목표가 설정되지 않았습니다.'],
          curriculum: parseArrayField(row[headers.indexOf('교육과정')]) || ['교육 과정이 설정되지 않았습니다.'],
          targetAudience: parseArrayField(row[headers.indexOf('대상자')]) || ['모든 직원']
        };

        courses.push(course);
      } catch (error) {
        console.warn(`행 ${index + 2} 파싱 중 오류:`, error);
      }
    });

    if (courses.length === 0) {
      throw new Error('유효한 교육 과정 데이터를 찾을 수 없습니다.');
    }

    return { title, description, courses };
  };

  const mapCollegeName = (collegeName: string): 'Cloud College' | 'SW College' | 'IA College' | 'AI College' => {
    const name = collegeName.toLowerCase().trim();
    
    if (name.includes('cloud') || name.includes('클라우드')) {
      return 'Cloud College';
    } else if (name.includes('sw') || name.includes('소프트웨어') || name.includes('프로그래밍')) {
      return 'SW College';
    } else if (name.includes('ia') || name.includes('인프라') || name.includes('네트워크') || name.includes('db') || name.includes('데이터베이스')) {
      return 'IA College';
    } else if (name.includes('ai') || name.includes('인공지능') || name.includes('rpa') || name.includes('딥러닝')) {
      return 'AI College';
    }
    
    // 기본값은 SW College
    return 'SW College';
  };

  const mapCourseType = (type: string): '기본' | '심화' | '실무' => {
    const typeStr = type.toLowerCase().trim();
    
    if (typeStr.includes('심화') || typeStr.includes('advanced')) {
      return '심화';
    } else if (typeStr.includes('실무') || typeStr.includes('practical')) {
      return '실무';
    }
    
    return '기본';
  };

  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    
    if (typeof field === 'string') {
      // 쉼표나 줄바꿈으로 구분된 문자열을 배열로 변환
      return field.split(/[,;\n]/).map(item => item.trim()).filter(item => item.length > 0);
    }
    
    if (Array.isArray(field)) {
      return field.map(item => String(item).trim()).filter(item => item.length > 0);
    }
    
    return [];
  };

  const setCurrentProgram = (programId: string): void => {
    const program = programs.value.find(p => p.id === programId);
    if (program) {
      currentProgram.value = program;
    }
  };

  const getCourseById = (courseId: string): EducationCourse | undefined => {
    if (!currentProgram.value) return undefined;
    return currentProgram.value.courses.find(course => course.id === courseId);
  };

  const downloadTemplate = (): void => {
    // 엑셀 템플릿 생성
    const templateData = [
      ['교육명', '내용', '대학', '강사', '일정', '시간', '유형', 'SSAM', '카테고리', '선수과목', '교육목표', '교육과정', '대상자'],
      ['Kubernetes와 ServiceMesh(ISTIO) 실무', 'Kubernetes와 Istio를 활용한 마이크로서비스 아키텍처 구현 실무 교육', 'Cloud College', '김클라우드', '09.22', '1일 8시간', '심화', 'Y', 'dsTech', 'Docker 기초;Kubernetes 기초', 'Kubernetes 클러스터 운영 능력 향상;Istio Service Mesh 구현 및 관리', 'Kubernetes 고급 기능;Istio 설치 및 설정', 'DevOps 엔지니어;클라우드 아키텍트'],
      ['AI 실무적용', 'AI 기술을 실제 업무에 적용하는 방법을 학습하는 실무 중심 교육', 'AI College', '박AI', '09.04~09.05', '2일 14시간', '실무', 'Y', 'AI', 'Python 기초;머신러닝 기초', 'AI 모델 개발 및 배포 실무;데이터 전처리 및 피처 엔지니어링', 'AI 프로젝트 기획;데이터 수집 및 전처리', '데이터 사이언티스트;AI 개발자']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '교육과정');

    // 파일 다운로드
    XLSX.writeFile(workbook, 'DS_University_교육과정_템플릿.xlsx');
  };

  return {
    programs,
    currentProgram,
    loading,
    error,
    colleges,
    coursesByCollege,
    getCollegeInfo,
    uploadProgram,
    setCurrentProgram,
    getCourseById,
    downloadTemplate
  };
});