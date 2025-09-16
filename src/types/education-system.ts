export interface EducationSystem {
  id: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EducationSystemCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  systems: EducationSystem[];
}

export interface CreateEducationSystemRequest {
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
  isActive?: boolean;
}

export interface UpdateEducationSystemRequest {
  name?: string;
  description?: string;
  category?: 'certification' | 'training' | 'development' | 'specialization';
  targetAudience?: string[];
  duration?: string;
  requirements?: string[];
  benefits?: string[];
  process?: string[];
  icon?: string;
  color?: string;
  isActive?: boolean;
}

