import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserCheck, UserX, Building2 } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalOrganizations: number;
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    organizationsWithoutAdmins: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  const { t } = useTranslation();

  const statItems = [
    {
      name: t('admin.organizations.title'),
      value: stats.totalOrganizations,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      detail: stats.organizationsWithoutAdmins > 0 
        ? t('admin.organizations.withoutAdmin', { count: stats.organizationsWithoutAdmins })
        : null
    },
    {
      name: t('admin.users.total'),
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      detail: t('admin.users.activePercentage', { 
        percentage: Math.round((stats.activeUsers / stats.totalUsers) * 100) 
      })
    },
    {
      name: t('admin.users.active'),
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: t('admin.users.inactive'),
      value: stats.inactiveUsers,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </div>
                    {item.detail && (
                      <div className="ml-2 text-sm text-gray-600">
                        {item.detail}
                      </div>
                    )}
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
