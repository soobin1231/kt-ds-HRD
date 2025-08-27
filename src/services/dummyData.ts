import type { Material } from '@/types/material'
import type { Category } from '@/types/category'

export const dummyMaterials: Material[] = [
  {
    id: 1,
    title: 'HR 기본 교육 가이드',
    content: '인사 관리의 기본 원칙과 실무 가이드',
    category_id: 1,
    file_path: '/files/hr-basic-guide.pdf',
    file_size: 2048576,
    view_count: 156,
    is_featured: true,
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
    category: { id: 1, name: '기본 교육', description: 'HR 기본 교육 자료' }
  },
  {
    id: 2,
    title: '성과 관리 시스템 운영',
    content: 'KPI 설정부터 평가까지 성과 관리 전 과정',
    category_id: 2,
    file_path: '/files/performance-management.pdf',
    file_size: 3145728,
    view_count: 89,
    is_featured: true,
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    category: { id: 2, name: '성과 관리', description: '성과 관리 관련 자료' }
  },
  {
    id: 3,
    title: '노동법 규정 해설',
    content: '최신 노동법 개정사항과 실무 적용법',
    category_id: 3,
    file_path: '/files/labor-law-guide.pdf',
    file_size: 1572864,
    view_count: 234,
    is_featured: true,
    created_at: '2024-01-05T11:15:00Z',
    updated_at: '2024-01-05T11:15:00Z',
    category: { id: 3, name: '법규', description: '노동법 및 관련 법규' }
  },
  {
    id: 4,
    title: '채용 프로세스 가이드',
    content: '효과적인 채용을 위한 프로세스와 체크리스트',
    category_id: 4,
    file_path: '/files/recruitment-guide.pdf',
    file_size: 1835008,
    view_count: 67,
    is_featured: false,
    created_at: '2024-01-20T16:45:00Z',
    updated_at: '2024-01-20T16:45:00Z',
    category: { id: 4, name: '채용', description: '채용 및 인재 발굴' }
  },
  {
    id: 5,
    title: '복리후생 제도 운영',
    content: '직원 만족도를 높이는 복리후생 제도 설계',
    category_id: 5,
    file_path: '/files/benefits-guide.pdf',
    file_size: 2359296,
    view_count: 45,
    is_featured: false,
    created_at: '2024-01-25T10:20:00Z',
    updated_at: '2024-01-25T10:20:00Z',
    category: { id: 5, name: '복리후생', description: '복리후생 제도 운영' }
  }
]

export const dummyCategories: Category[] = [
  { id: 1, name: '기본 교육', description: 'HR 기본 교육 자료' },
  { id: 2, name: '성과 관리', description: '성과 관리 관련 자료' },
  { id: 3, name: '법규', description: '노동법 및 관련 법규' },
  { id: 4, name: '채용', description: '채용 및 인재 발굴' },
  { id: 5, name: '복리후생', description: '복리후생 제도 운영' }
]
