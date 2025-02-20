import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../Modal';
import { UserForm } from '../UserForm';
import { OrganizationForm } from '../OrganizationForm';
import { DeleteUserModal } from '../modals/DeleteUserModal';
import { AdminModal } from '../modals/AdminModal';
import { WelcomeMessageForm } from '../WelcomeMessageForm';
import type { Organization, Profile } from '../../../types/database';

interface ModalState {
  showInviteModal: boolean;
  showDeleteModal: boolean;
  showEditModal: boolean;
  showOrgModal: boolean;
  showCycleModal: boolean;
  showWelcomeModal: boolean;
  showAddAdminModal: boolean;
}

interface SelectedState {
  selectedUser: (Profile & { email: string }) | null;
  selectedOrg: Organization | null;
  selectedAdminId: string;
}

interface AdminModalsProps {
  modals: ModalState;
  selected: SelectedState;
  organizations: Organization[];
  adminCandidates: any[]; // Replace with proper type
  status: {
    saving: boolean;
    inviting: boolean;
    deleting: boolean;
  };
  onClose: (modalName: keyof ModalState) => void;
  handleCreateOrg: (e: React.FormEvent) => void;
  handleAddAdmin: (e: React.FormEvent) => void;
  handleInviteUser: (e: React.FormEvent) => void;
  handleEditUser: (e: React.FormEvent) => void;
  handleDeleteUser: () => void;
  handleUpdateWelcomeMessage: (e: React.FormEvent) => void;
}

export function AdminModals({
  modals,
  selected,
  organizations,
  adminCandidates,
  status,
  onClose,
  handleCreateOrg,
  handleAddAdmin,
  handleInviteUser,
  handleEditUser,
  handleDeleteUser,
  handleUpdateWelcomeMessage
}: AdminModalsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        isOpen={modals.showOrgModal}
        onClose={() => onClose('showOrgModal')}
        title={t('admin.organizations.new')}
      >
        <OrganizationForm
          formData={selected.selectedOrg || { name: '', slug: '', app_name: '' }}
          onChange={(field, value) => {/* Handle onChange */}}
          onSubmit={handleCreateOrg}
          onCancel={() => onClose('showOrgModal')}
          isSubmitting={status.saving}
        />
      </Modal>

      <AdminModal
        isOpen={modals.showAddAdminModal}
        onClose={() => onClose('showAddAdminModal')}
        selectedOrgName={selected.selectedOrg?.name}
        adminCandidates={adminCandidates}
        selectedAdminId={selected.selectedAdminId}
        onAdminSelect={(id) => {/* Handle admin selection */}}
        onSubmit={handleAddAdmin}
        saving={status.saving}
      />

      <Modal
        isOpen={modals.showInviteModal}
        onClose={() => onClose('showInviteModal')}
        title={t('admin.users.invite')}
      >
        <UserForm
          formData={{
            email: '',
            full_name: '',
            role: 'employee',
            status: 'active',
            department: '',
            job_level: '',
            job_name: '',
          }}
          organizations={organizations}
          onChange={(field, value) => {/* Handle onChange */}}
          onSubmit={handleInviteUser}
          onCancel={() => onClose('showInviteModal')}
          isSubmitting={status.inviting}
          submitLabel={t('admin.users.sendInvite')}
          showEmailField
        />
      </Modal>

      <Modal
        isOpen={modals.showEditModal}
        onClose={() => onClose('showEditModal')}
        title={t('admin.users.edit')}
      >
        <UserForm
          organizations={organizations}
          formData={selected.selectedUser || {
            full_name: '',
            role: 'employee',
            status: 'active',
            department: '',
            job_level: '',
            job_name: '',
          }}
          onChange={(field, value) => {/* Handle onChange */}}
          onSubmit={handleEditUser}
          onCancel={() => onClose('showEditModal')}
          isSubmitting={status.saving}
          submitLabel={t('common.saveChanges')}
        />
      </Modal>

      <DeleteUserModal
        isOpen={modals.showDeleteModal}
        onClose={() => onClose('showDeleteModal')}
        user={selected.selectedUser}
        onDelete={handleDeleteUser}
        deleting={status.deleting}
      />
    </>
  );
}
