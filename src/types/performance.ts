export interface PerformanceMetric {
  name: string;
  value: string | number;
  icon: any; // Lucide icon component type
  color: string;
  bgColor: string;
}

export interface GradeLevel {
  min_score: number;
  max_score: number;
  grade_text: string;
  grade_level: number;
}

export interface PerformanceGrade {
  id: string;
  organization_id: string | null;
  min_score: number;
  max_score: number;
  grade_text: string;
  grade_level: number;
  created_at: string;
  updated_at: string;
}

export type EvaluationStatus = 
  | 'awaiting_goal_setting'
  | 'awaiting_evaluation'
  | 'awaiting_approval'
  | 'finalized';
