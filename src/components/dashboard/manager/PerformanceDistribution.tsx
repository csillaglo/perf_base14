import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubordinateStats } from '../../../services/statistics/performanceStatistics';

interface PerformanceDistributionProps {
  stats: SubordinateStats;
  totalSubordinates: number;
}

export function PerformanceDistribution({ stats, totalSubordinates }: PerformanceDistributionProps) {
  const { t } = useTranslation();

  const getGradeColor = (level: number) => {
    switch (level) {
      case 5: return 'text-green-600 bg-green-100';
      case 4: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {t('goals.evaluation.manager.gradeDistribution')}
      </h3>
      <div className="space-y-4">
        {Object.entries(stats)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([level, { count, employees }]) => {
            const percentage = (count / totalSubordinates) * 100;
            const colorClass = getGradeColor(Number(level));
            
            return (
              <div key={level} className="relative">
                <div className="flex items-center mb-1">
                  <span className={`text-sm font-medium ${colorClass} px-2 py-1 rounded-full`}>
                    {t(`goals.evaluation.performance.grades.level${level}`)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({count} {count === 1 
                      ? t('goals.evaluation.manager.employee') 
                      : t('goals.evaluation.manager.employees')})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass.split(' ')[1]} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-500 w-12 text-right">
                    {Math.round(percentage)}%
                  </span>
                </div>
                {count > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {employees.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
