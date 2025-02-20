import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { inviteUser } from '../../../lib/auth';
import type { UserRole } from '../../../types/database';

interface BulkUploadSectionProps {
  organizationId?: string;
  onSuccess: () => void;
}

interface UserData {
  email: string;
  full_name?: string;
  role?: UserRole;
  department?: string;
  job_level?: string;
  job_name?: string;
}

export function BulkUploadSection({ organizationId, onSuccess }: BulkUploadSectionProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateUserData = (data: any): UserData | null => {
    if (!data.email || typeof data.email !== 'string') {
      return null;
    }

    if (data.role && !['employee', 'manager', 'hr_admin', 'company_admin'].includes(data.role)) {
      data.role = 'employee';
    }

    return {
      email: data.email.trim(),
      full_name: data.full_name?.trim(),
      role: (data.role || 'employee') as UserRole,
      department: data.department?.trim(),
      job_level: data.job_level?.trim(),
      job_name: data.job_name?.trim(),
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      setSuccessMessage(null);
      setProgress({ current: 0, total: 0 });

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validUsers: UserData[] = [];
      for (const row of jsonData) {
        const userData = validateUserData(row);
        if (userData) {
          validUsers.push(userData);
        }
      }

      if (validUsers.length === 0) {
        throw new Error(t('admin.users.bulkUpload.noValidUsers'));
      }

      setProgress({ current: 0, total: validUsers.length });

      for (let i = 0; i < validUsers.length; i++) {
        const user = validUsers[i];
        try {
          await inviteUser(user.email, {
            role: user.role,
            department: user.department,
            job_level: user.job_level,
            job_name: user.job_name,
            organization_id: organizationId,
          });
          setProgress(prev => ({ ...prev, current: i + 1 }));
        } catch (err) {
          console.error(`Error inviting user ${user.email}:`, err);
        }
      }

      setSuccessMessage(t('auth.bulkUpload.success'));
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 rounded-lg p-2">
            <Upload className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('admin.users.bulkUpload.title')}
          </h3>
        </div>
        <a
          href="/templates/bulk_upload_template.xlsx"
          download
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {t('admin.users.bulkUpload.downloadTemplate')}
        </a>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {t('auth.bulkUpload.instructions')}
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-sm text-gray-500">
                  {progress.total > 0
                    ? t('admin.users.bulkUpload.uploadingProgress', {
                        current: progress.current,
                        total: progress.total,
                      })
                    : t('admin.users.bulkUpload.uploading')}
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.users.bulkUpload.dropzone')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('admin.users.bulkUpload.fileTypes')}
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {t('admin.users.bulkUpload.requiredColumns')}:
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <li>email ({t('admin.users.bulkUpload.required')})</li>
          <li>full_name</li>
          <li>role (employee, manager, hr_admin, company_admin)</li>
          <li>department</li>
          <li>job_level</li>
          <li>job_name</li>
        </ul>
      </div>
    </div>
  );
}
