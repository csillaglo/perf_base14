import type { Goal, Profile } from '../../types/database';

export interface PerformanceStats {
  totalSubordinates: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
}

export interface SubordinateStats {
  [key: number]: {
    count: number;
    employees: string[];
  }
}

export interface SubordinatePerformance {
  id: string;
  full_name: string;
  email: string;
  score: number;
  department?: string;
  job_name?: string;
}

export function calculatePerformanceScore(goals: Goal[]): number {
  const totalWeight = goals.reduce((sum, goal) => sum + (goal.weight || 0), 0);
  if (totalWeight === 0) return 0;

  const weightedScore = goals.reduce((sum, goal) => {
    const normalizedScore = ((goal.evaluation_score || 1) / 5) * 100;
    return sum + (normalizedScore * (goal.weight || 0) / totalWeight);
  }, 0);

  return Math.round(weightedScore);
}

export function calculateTeamStats(
  employees: Profile[],
  goals: Goal[]
): PerformanceStats {
  const totalSubordinates = employees.length;
  let completedCount = 0;
  let totalScore = 0;

  employees.forEach(employee => {
    const employeeGoals = goals.filter(g => g.user_id === employee.id);
    if (employeeGoals.length > 0) {
      if (employeeGoals.every(g => g.evaluation_score)) {
        completedCount++;
        totalScore += calculatePerformanceScore(employeeGoals);
      }
    }
  });

  return {
    totalSubordinates,
    pendingEvaluations: totalSubordinates - completedCount,
    completedEvaluations: completedCount,
    averageScore: completedCount > 0 ? Math.round(totalScore / completedCount) : 0,
  };
}

export function calculateGradeDistribution(
  employees: Profile[],
  goals: Goal[],
  grades: { min_score: number; max_score: number }[]
): SubordinateStats {
  const gradeStats: SubordinateStats = {};

  employees.forEach(employee => {
    const employeeGoals = goals.filter(g => g.user_id === employee.id);
    if (employeeGoals.length > 0) {
      const score = calculatePerformanceScore(employeeGoals);
      const grade = grades.find(g => score >= g.min_score && score <= g.max_score);
      
      if (grade) {
        const gradeLevel = grades.indexOf(grade) + 1;
        if (!gradeStats[gradeLevel]) {
          gradeStats[gradeLevel] = { count: 0, employees: [] };
        }
        gradeStats[gradeLevel].count++;
        gradeStats[gradeLevel].employees.push(
          employee.full_name || 'Unnamed Employee'
        );
      }
    }
  });

  return gradeStats;
}

export function getTopPerformers(
  employees: Profile[],
  goals: Goal[],
  limit: number = 3
): SubordinatePerformance[] {
  const performanceList = employees.map(employee => {
    const employeeGoals = goals.filter(g => g.user_id === employee.id);
    return {
      id: employee.id,
      full_name: employee.full_name || 'Unnamed Employee',
      email: employee.email || '',
      score: calculatePerformanceScore(employeeGoals),
      department: employee.department,
      job_name: employee.job_name,
    };
  });

  return performanceList
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getLowPerformers(
  employees: Profile[],
  goals: Goal[],
  limit: number = 3
): SubordinatePerformance[] {
  const performanceList = employees.map(employee => {
    const employeeGoals = goals.filter(g => g.user_id === employee.id);
    return {
      id: employee.id,
      full_name: employee.full_name || 'Unnamed Employee',
      email: employee.email || '',
      score: calculatePerformanceScore(employeeGoals),
      department: employee.department,
      job_name: employee.job_name,
    };
  });

  return performanceList
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}
