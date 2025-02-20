import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import { Modal } from '../Modal';
import { WelcomeMessageForm } from '../WelcomeMessageForm';

interface WelcomeMessageSectionProps {
  message: string;
  onEdit: () => void;
  isEditing: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onChange: (content: string) => void;
  isSaving: boolean;
}

export function WelcomeMessageSection({
  message,
  onEdit,
  isEditing,
  onClose,
  onSave,
  onChange,
  isSaving
}: WelcomeMessageSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 dark:bg-indigo-900 rounded-lg p-2">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('admin.welcomeMessage.title')}
            </h2>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('admin.welcomeMessage.edit')}
          </button>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          {message || t('admin.welcomeMessage.noMessage')}
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={onClose}
        title={t('admin.welcomeMessage.edit')}
      >
        <WelcomeMessageForm
          content={message}
          onChange={onChange}
          onSubmit={onSave}
          onCancel={onClose}
          isSubmitting={isSaving}
        />
      </Modal>
    </div>
  );
}
