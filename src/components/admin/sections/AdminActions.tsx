import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Building2 } from 'lucide-react';

interface AdminActionsProps {
  viewMode: 'list' | 'chart';
  onViewModeChange: (mode: 'list' | 'chart') => void;
  onInviteUser: () => void;
}

export function AdminActions({ viewMode, onViewModeChange, onInviteUser }: AdminActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex rounded-md shadow-sm" role="group">
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-4 py-2 text-sm font-medium border ${
            viewMode === 'list'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <Users className="h-4 w-4 inline-block mr-2" />
          {t('admin.users.listView')}
        </button>
        <button
          onClick={() => onViewModeChange('chart')}
          className={`px-4 py-2 text-sm font-medium border ${
            viewMode === 'chart'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <Building2 className="h-4 w-4 inline-block mr-2" />
          {t('admin.users.orgChart')}
        </button>
      </div>
      <button
        onClick={onInviteUser}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        {t('admin.users.invite')}
      </button>
    </div>
  );
}
