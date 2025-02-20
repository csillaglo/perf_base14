import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import type { Profile, Goal } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import { PerformanceMetrics } from './manager/PerformanceMetrics';
import { PerformanceDistribution } from './manager/PerformanceDistribution';
import {
  calculateTeamStats,
  calculateGradeDistribution,
  getTopPerformers,
  getLowPerformers,
  type PerformanceStats,
  type SubordinateStats,
  type SubordinatePerformance
} from '../../services/statistics/performanceStatistics';

interface ManagerOverviewProps {
  grades: any[];
  userRole: string;
  organizationId: string;
}

export function ManagerOverview({ grades, userRole, organizationId }: ManagerOverviewProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<PerformanceStats>({
    totalSubordinates: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
  });
  const [subordinateStats, setSubordinateStats] = useState<SubordinateStats>({});
  const [topPerformers, setTopPerformers] = useState<SubordinatePerformance[]>([]);
  const [lowPerformers, setLowPerformers] = useState<SubordinatePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubordinateData = useCallback(async () => {
    try {
      // Get employees based on role
      const query = supabase
        .from('profiles')
        .select('*');

      if (userRole === 'manager') {
        query.eq('manager_id', user.id);
      } else if (userRole === 'hr_admin') {
        query.eq('organization_id', organizationId);
      }

      const { data: employees, error: employeesError } = await query;
      if (employeesError) throw employeesError;

      if (!employees?.length) {
        setLoading(false);
        return;
      }

      // Get all goals for each employee
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .in('user_id', employees.map(e => e.id));

      if (goalsError) throw goalsError;

      // Calculate statistics
      const teamStats = calculateTeamStats(employees, goals || []);
      const gradeStats = calculateGradeDistribution(employees, goals || [], grades);
      const topPerformersList = getTopPerformers(employees, goals || []);
      const lowPerformersList = getLowPerformers(employees, goals || []);

      setStats(teamStats);
      setSubordinateStats(gradeStats);
      setTopPerformers(topPerformersList);
      setLowPerformers(lowPerformersList);
    } catch (error) {
      console.error('Error fetching subordinate data:', error);
    } finally {
      setLoading(false);
    }
  }, [userRole, organizationId, user.id, grades]);

  useEffect(() => {
    fetchSubordinateData();
  }, [fetchSubordinateData]);

  if (loading) {
    return <div className="text-center py-8">{t('goals.evaluation.manager.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
        {userRole === 'hr_admin' 
          ? t('goals.evaluation.hr.organizationOverview')
          : t('goals.evaluation.manager.title')}
      </h2>

      <PerformanceMetrics stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceDistribution 
          stats={subordinateStats} 
          totalSubordinates={stats.totalSubordinates} 
        />
        
        <div className="space-y-6">
          {/* Top Performers */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {userRole === 'hr_admin' 
                ? t('goals.evaluation.hr.topPerformers')
                : t('goals.evaluation.manager.topPerformers')}
            </h3>
            <div className="space-y-3">
              {topPerformers.map(performer => (
                <div key={performer.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {performer.full_name}
                    </p>
                    {(performer.department || performer.job_name) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {performer.department} {performer.job_name ? `• ${performer.job_name}` : ''}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-green-600">
                      {t('goals.evaluation.manager.score')}: {performer.score}%
                    </p>
                  </div>
                </div>
              ))}
              {topPerformers.length === 0 && (
                <p className="text-sm text-gray-500">{t('goals.evaluation.manager.noData')}</p>
              )}
            </div>
          </div>

          {/* Low Performers */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {userRole === 'hr_admin' 
                ? t('goals.evaluation.hr.needsImprovement')
                : t('goals.evaluation.manager.needsImprovement')}
            </h3>
            <div className="space-y-3">
              {lowPerformers.map(performer => (
                <div key={performer.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {performer.full_name}
                    </p>
                    {(performer.department || performer.job_name) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {performer.department} {performer.job_name ? `• ${performer.job_name}` : ''}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-red-600">
                      {t('goals.evaluation.manager.score')}: {performer.score}%
                    </p>
                  </div>
                </div>
              ))}
              {lowPerformers.length === 0 && (
                <p className="text-sm text-gray-500">{t('goals.evaluation.manager.noData')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
