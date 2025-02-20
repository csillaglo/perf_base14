import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, Clock, BarChart3 } from 'lucide-react';
import type { PerformanceStats } from '../../../services/statistics/performanceStatistics';

interface PerformanceMetricsProps {
  stats: PerformanceStats;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  const { t } = useTranslation();

  const metrics = [
    {
      name: t('goals.evaluation.manager.teamMembers'),
      value: stats.totalSubordinates,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: t('goals.evaluation.manager.pendingEvaluations'),
      value: stats.pendingEvaluations,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: t('goals.evaluation.manager.completedEvaluations'),
      value: stats.completedEvaluations,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: t('goals.evaluation.manager.averageScore'),
      value: `${stats.averageScore}%`,
      icon: BarChart3,
      color: getScoreColor(stats.averageScore),
      bgColor: `bg-${getScoreColor(stats.averageScore).split('-')[1]}-100`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.name} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {metric.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {metric.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 81) return 'text-green-600';
  if (score >= 61) return 'text-blue-600';
  if (score >= 41) return 'text-yellow-600';
  if (score >= 21) return 'text-orange-600';
  return 'text-red-600';
}
