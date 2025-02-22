import React from 'react';
import { useTranslation } from 'react-i18next';

interface CycleFormProps {
  formData: {
    name: string;
    start_date: string;
    end_date: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CycleForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: CycleFormProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('admin.cycles.form.cycleName')}
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          placeholder={t('admin.cycles.form.cycleNamePlaceholder')}
        />
      </div>

      <div>
        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
          {t('admin.cycles.form.startDate')}
        </label>
        <input
          type="date"
          id="start_date"
          value={formData.start_date}
          onChange={(e) => onChange('start_date', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
          {t('admin.cycles.form.endDate')}
        </label>
        <input
          type="date"
          id="end_date"
          value={formData.end_date}
          onChange={(e) => onChange('end_date', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t('admin.cycles.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
         {isSubmitting 
            ? t('admin.cycles.form.creating') 
            : t('admin.cycles.form.create')
          }
        </button>
      </div>
    </form>
  );
}
