import React, { useState } from 'react';
import { Book, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const { t, i18n } = useTranslation();
  const { role } = useAuth();
  const [activeSection, setActiveSection] = useState('general');

  const documentationSections = {
    employee: [
      { id: 'goals', title: t('docs.employee.goals.title') },
      { id: 'performance', title: t('docs.employee.performance.title') },
      { id: 'profile', title: t('docs.employee.profile.title') }
    ],
    manager: [
      { id: 'team_management', title: t('docs.manager.teamManagement.title') },
      { id: 'evaluations', title: t('docs.manager.evaluations.title') },
      { id: 'goal_setting', title: t('docs.manager.goalSetting.title') }
    ],
    company_admin: [
      { id: 'user_management', title: t('docs.companyAdmin.userManagement.title') },
      { id: 'organization', title: t('docs.companyAdmin.organization.title') },
      { id: 'reporting', title: t('docs.companyAdmin.reporting.title') }
    ],
    hr_admin: [
      { id: 'hr_processes', title: t('docs.hrAdmin.processes.title') },
      { id: 'performance_tracking', title: t('docs.hrAdmin.performanceTracking.title') },
      { id: 'compliance', title: t('docs.hrAdmin.compliance.title') }
    ]
  };

  const renderDocumentationContent = () => {
    const content = {
      employee: {
        goals: t('docs.employee.goals.content'),
        performance: t('docs.employee.performance.content'),
        profile: t('docs.employee.profile.content')
      },
      manager: {
        team_management: t('docs.manager.teamManagement.content'),
        evaluations: t('docs.manager.evaluations.content'),
        goal_setting: t('docs.manager.goalSetting.content')
      },
      company_admin: {
        user_management: t('docs.companyAdmin.userManagement.content'),
        organization: t('docs.companyAdmin.organization.content'),
        reporting: t('docs.companyAdmin.reporting.content')
      },
      hr_admin: {
        hr_processes: t('docs.hrAdmin.processes.content'),
        performance_tracking: t('docs.hrAdmin.performanceTracking.content'),
        compliance: t('docs.hrAdmin.compliance.content')
      }
    };

    const sections = documentationSections[role as keyof typeof documentationSections] || documentationSections.employee;
    const currentContent = content[role as keyof typeof content] || content.employee;

    return (
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{t('docs.sections')}</h3>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded ${
                activeSection === section.id 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
        <div className="col-span-3 bg-white dark:bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {currentContent[activeSection as keyof typeof currentContent]}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-5/6 h-5/6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        {renderDocumentationContent()}
      </div>
    </div>
  );
}
