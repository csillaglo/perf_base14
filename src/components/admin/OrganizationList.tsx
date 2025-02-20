import React from 'react';
import { Building2, Users, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Organization } from '../../types/database';

interface OrganizationListProps {
  organizations: (Organization & { adminCount: number; userCount: number })[];
  onAddAdmin: (org: Organization) => void;
  onDelete: (org: Organization) => void;
}

export function OrganizationList({ organizations, onAddAdmin, onDelete }: OrganizationListProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.organizations.table.organization')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.organizations.table.admins')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.organizations.table.totalUsers')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('admin.organizations.table.created')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {organizations.map((org) => (
            <tr key={org.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{org.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {t('admin.organizations.table.adminCount', { count: org.adminCount })}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {t('admin.organizations.table.userCount', { count: org.userCount })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(org.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onAddAdmin(org)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  title={t('admin.organizations.addAdmin')}
                >
                  <Users className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(org)}
                  className="text-red-600 hover:text-red-900"
                  title={t('common.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
