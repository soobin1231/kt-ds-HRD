import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EducationSystem, EducationSystemCategory, CreateEducationSystemRequest, UpdateEducationSystemRequest } from '@/types/education-system'

export const useEducationSystemStore = defineStore('educationSystem', () => {
  const systems = ref<EducationSystem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const categories: EducationSystemCategory[] = [
    {
      id: 'certification',
      name: '자격증 취득',
      description: '전문 자격증 취득을 위한 교육 프로그램',
      icon: '🏆',
      color: 'bg-yellow-100 text-yellow-800',
      systems: []
    },
    {
      id: 'training',
      name: '직무 교육',
      description: '업무 역량 향상을 위한 실무 교육',
      icon: '📚',
      color: 'bg-blue-100 text-blue-800',
      systems: []
    },
    {
      id: 'development',
      name: '개인 개발',
      description: '개인의 성장과 발전을 위한 교육',
      icon: '🌱',
      color: 'bg-green-100 text-green-800',
      systems: []
    },
    {
      id: 'specialization',
      name: '전문 분야',
      description: '특정 분야의 전문성 향상 교육',
      icon: '🎯',
      color: 'bg-purple-100 text-purple-800',
      systems: []
    }
  ]

  const systemsByCategory = computed(() => {
    const result: Record<string, EducationSystem[]> = {}
    categories.forEach(category => {
      result[category.id] = systems.value.filter(system => system.category === category.id)
    })
    return result
  })

  const activeSystems = computed(() => 
    systems.value.filter(system => system.isActive)
  )

  const fetchSystems = async () => {
    try {
      loading.value = true
      error.value = null
      
      // 임시 데이터 (실제로는 API 호출)
      const mockData: EducationSystem[] = [
        {
          id: '1',
          name: 'AWS 클라우드 자격증',
          description: 'Amazon Web Services의 클라우드 서비스 전문 자격증 취득을 위한 교육 프로그램입니다.',
          category: 'certification',
          targetAudience: ['개발자', 'DevOps 엔지니어', '클라우드 아키텍트'],
          duration: '3개월',
          requirements: ['기본적인 IT 지식', 'Linux 명령어 이해', '네트워킹 기초'],
          benefits: ['클라우드 전문성 인정', '취업 경쟁력 향상', '높은 연봉 기대'],
          process: ['기초 이론 학습', '실습 환경 구축', '모의 시험 응시', '실제 시험 응시'],
          icon: '☁️',
          color: 'bg-orange-100 text-orange-800',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '데이터 사이언스 전문가',
          description: '빅데이터 분석과 머신러닝을 활용한 데이터 사이언스 전문가 양성 프로그램입니다.',
          category: 'specialization',
          targetAudience: ['데이터 분석가', '연구원', '마케팅 담당자'],
          duration: '6개월',
          requirements: ['Python 기초', '통계학 기초', '수학적 사고력'],
          benefits: ['데이터 분석 전문성', 'AI/ML 기술 습득', '비즈니스 인사이트 도출'],
          process: ['Python 프로그래밍', '통계 분석', '머신러닝 알고리즘', '실제 프로젝트 수행'],
          icon: '📊',
          color: 'bg-blue-100 text-blue-800',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: '프로젝트 관리자(PM)',
          description: '효율적인 프로젝트 관리와 팀 리더십을 기를 수 있는 교육 프로그램입니다.',
          category: 'training',
          targetAudience: ['프로젝트 매니저', '팀 리더', '관리자'],
          duration: '2개월',
          requirements: ['업무 경험 3년 이상', '커뮤니케이션 능력', '문제 해결 능력'],
          benefits: ['프로젝트 관리 역량', '리더십 향상', '효율적인 업무 수행'],
          process: ['PM 이론 학습', '도구 활용법', '케이스 스터디', '실제 프로젝트 관리'],
          icon: '📋',
          color: 'bg-green-100 text-green-800',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          name: '디지털 마케팅 전문가',
          description: '온라인 마케팅과 디지털 전환 시대에 맞는 마케팅 전문가 양성 프로그램입니다.',
          category: 'development',
          targetAudience: ['마케팅 담당자', '브랜드 매니저', '창업자'],
          duration: '4개월',
          requirements: ['마케팅 기초', 'SNS 활용 경험', '창의적 사고'],
          benefits: ['디지털 마케팅 전문성', '브랜드 관리 역량', '고객 분석 능력'],
          process: ['디지털 마케팅 이론', 'SNS 마케팅', '데이터 분석', '캠페인 기획 및 실행'],
          icon: '📱',
          color: 'bg-pink-100 text-pink-800',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]
      
      systems.value = mockData
    } catch (err: any) {
      error.value = err.message || '교육제도를 불러오는데 실패했습니다.'
      console.error('Failed to fetch education systems:', err)
    } finally {
      loading.value = false
    }
  }

  const createSystem = async (data: CreateEducationSystemRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const newSystem: EducationSystem = {
        id: Date.now().toString(),
        ...data,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString()
      }
      
      systems.value.unshift(newSystem)
      return newSystem
    } catch (err: any) {
      error.value = err.message || '교육제도 생성에 실패했습니다.'
      console.error('Failed to create education system:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSystem = async (id: string, data: UpdateEducationSystemRequest) => {
    try {
      loading.value = true
      error.value = null
      
      const index = systems.value.findIndex(s => s.id === id)
      if (index === -1) {
        throw new Error('교육제도를 찾을 수 없습니다.')
      }
      
      systems.value[index] = {
        ...systems.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      
      return systems.value[index]
    } catch (err: any) {
      error.value = err.message || '교육제도 수정에 실패했습니다.'
      console.error('Failed to update education system:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSystem = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const index = systems.value.findIndex(s => s.id === id)
      if (index === -1) {
        throw new Error('교육제도를 찾을 수 없습니다.')
      }
      
      systems.value.splice(index, 1)
    } catch (err: any) {
      error.value = err.message || '교육제도 삭제에 실패했습니다.'
      console.error('Failed to delete education system:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleSystemStatus = async (id: string) => {
    try {
      const system = systems.value.find(s => s.id === id)
      if (system) {
        await updateSystem(id, { isActive: !system.isActive })
      }
    } catch (err) {
      console.error('Failed to toggle system status:', err)
    }
  }

  const getSystemById = (id: string): EducationSystem | undefined => {
    return systems.value.find(system => system.id === id)
  }

  const getCategoryById = (id: string): EducationSystemCategory | undefined => {
    return categories.find(category => category.id === id)
  }

  return {
    systems,
    categories,
    loading,
    error,
    systemsByCategory,
    activeSystems,
    fetchSystems,
    createSystem,
    updateSystem,
    deleteSystem,
    toggleSystemStatus,
    getSystemById,
    getCategoryById
  }
})

