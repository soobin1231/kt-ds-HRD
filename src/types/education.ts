export interface EducationCourse {
  id: string;
  name: string;
  description: string;
  college: 'Cloud College' | 'SW College' | 'IA College' | 'AI College';
  category?: string;
  instructor: string;
  date: string;
  duration: string;
  type: '기본' | '심화' | '실무';
  isSSAM: boolean;
  prerequisites?: string[];
  objectives: string[];
  curriculum: string[];
  targetAudience: string[];
}

export interface EducationProgram {
  id: string;
  title: string;
  description: string;
  courses: EducationCourse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CollegeInfo {
  name: 'Cloud College' | 'SW College' | 'IA College' | 'AI College';
  description: string;
  color: string;
  icon: string;
}

