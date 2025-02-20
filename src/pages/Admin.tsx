import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useAdminData } from '../hooks/admin/useAdminData';
import { useAdminModals } from '../hooks/admin/useAdminModals';
import { useAdminActions } from '../hooks/admin/useAdminActions';
import { useAdminFilters } from '../hooks/admin/useAdminFilters';
import { supabase } from '../lib/supabase';

// Komponens importok
import { AdminHeader } from '../components/admin/sections/AdminHeader';
import { AdminActions } from '../components/admin/sections/AdminActions';
import { AdminStats } from '../components/admin/sections/AdminStats';
import { AdminModals } from '../components/admin/sections/AdminModals';
import { OrganizationsSection } from '../components/admin/sections/OrganizationsSection';
import { EvaluationCyclesSection } from '../components/admin/sections/EvaluationCyclesSection';
import { UserManagementSection } from '../components/admin/sections/UserManagementSection';
import { WelcomeMessageSection } from '../components/admin/sections/WelcomeMessageSection';
import { DownloadResultsSection } from '../components/admin/sections/DownloadResultsSection';

// Típus importok
import type { 
  AdminCandidate, 
  Organization, 
  Profile,
  UserRole,
  EvaluationCycle 
} from '../types/database';

export function Admin() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const [adminCandidates, setAdminCandidates] = React.useState<AdminCandidate[]>([]);
  const [viewMode, setViewMode] = React.useState<'list' | 'chart'>('list');

  // Custom hooks
  const { 
    data: { users, organizations, cycles, welcomeMessage },
    loading,
    error,
    refresh,
    setUsers,
    setWelcomeMessage
  } = useAdminData();

  const {
    modals,
    selected,
    openModal,
    closeModal,
    selectUser,
    selectOrg,
    selectAdmin
  } = useAdminModals();

  const {
    message,
    status,
    actions
  } = useAdminActions(refresh, setUsers, users);

  const {
    filters,
    filteredUsers,
    managers,
    availableRoles,
    updateFilter,
    clearFilters
  } = useAdminFilters(users, organizations, role, user?.organization_id);

  // Event Handlers
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.createOrganization(
      selected.selectedOrg?.name || '',
      selected.selectedOrg?.slug || '',
      selected.selectedOrg?.app_name || ''
    );
    if (success) {
      closeModal('showOrgModal');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.selectedOrg || !selected.selectedAdminId) return;

    const success = await actions.updateUserRole(
      selected.selectedAdminId,
      'company_admin'
    );
    if (success) {
      closeModal('showAddAdminModal');
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.inviteUser(selected.selectedUser?.email || '', {
      role: selected.selectedUser?.role,
      department: selected.selectedUser?.department,
      job_level: selected.selectedUser?.job_level,
      job_name: selected.selectedUser?.job_name,
    });
    if (success) {
      closeModal('showInviteModal');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.selectedUser) return;

    const success = await actions.updateUser(selected.selectedUser.id, {
      full_name: selected.selectedUser.full_name,
      role: selected.selectedUser.role,
      organization_id: selected.selectedUser.organization_id,
      department: selected.selectedUser.department,
      job_level: selected.selectedUser.job_level,
      job_name: selected.selectedUser.job_name,
    });
    if (success) {
      closeModal('showEditModal');
    }
  };

  const handleDeleteUser = async () => {
    if (!selected.selectedUser) return;
    
    const success = await actions.deleteUser(selected.selectedUser.id);
    if (success) {
      closeModal('showDeleteModal');
    }
  };

  const handleUpdateWelcomeMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organization_id) return;

    const success = await actions.updateWelcomeMessage(
      user.organization_id,
      welcomeMessage
    );
    if (success) {
      closeModal('showWelcomeModal');
    }
  };

  const handleDeleteCycle = async (cycle: EvaluationCycle) => {
    if (!confirm(t('admin.cycles.deleteConfirmation'))) {
      return;
    }

    const success = await actions.deleteCycle(cycle.id);
    if (success) {
      await refresh();
    }
  };

  const handleToggleCycleStatus = async (cycle: EvaluationCycle) => {
    const success = await actions.toggleCycleStatus(cycle);
    if (success) {
      await refresh();
    }
  };

  // Fetch admin candidates when organization is selected
  useEffect(() => {
    if (selected.selectedOrg) {
      fetchAdminCandidates(selected.selectedOrg.id);
    }
  }, [selected.selectedOrg]);

  const fetchAdminCandidates = async (orgId: string) => {
    try {
      const { data: candidates, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('organization_id', orgId)
        .eq('role', 'company_admin');

      if (error) throw error;

      const { data: emailData, error: emailError } = await supabase
        .rpc('get_user_emails');

      if (emailError) throw emailError;

      const emailMap = new Map(emailData.map((item: any) => [item.id, item.email]));
      const candidatesWithEmail = candidates.map(candidate => ({
        ...candidate,
        email: emailMap.get(candidate.id) || 'No email'
      }));

      setAdminCandidates(candidatesWithEmail);
    } catch (err: any) {
      console.error('Error fetching admin candidates:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-4">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {t('common.error')}: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organizations Section (only for superadmin) */}
      {role === 'superadmin' && (
        <OrganizationsSection
          organizations={organizations}
          onAddAdmin={(org) => {
            selectOrg(org);
            openModal('showAddAdminModal');
          }}
          onDelete={(org) => actions.deleteOrganization(org.id)}
          onCreateNew={() => openModal('showOrgModal')}
        />
      )}

      {/* Evaluation Cycles Section (for company admins and superadmins) */}
      {role === 'company_admin' && (
        <EvaluationCyclesSection
          cycles={cycles}
          onCreateNew={() => openModal('showCycleModal')}
          onEdit={(cycle) => {
            selectUser(cycle);
            openModal('showCycleModal');
          }}
          onDelete={handleDeleteCycle}
          onToggleStatus={handleToggleCycleStatus}
        />
      )}

      {/* Welcome Message Section (for company admins) */}
      {role === 'company_admin' && (
        <WelcomeMessageSection
          message={welcomeMessage}
          onEdit={() => openModal('showWelcomeModal')}
          isEditing={modals.showWelcomeModal}
          onClose={() => closeModal('showWelcomeModal')}
          onSave={handleUpdateWelcomeMessage}
          onChange={setWelcomeMessage}
          isSaving={status.saving}
        />
      )}

      {/* User Management Section */}
      <UserManagementSection
        users={filteredUsers}
        organizations={organizations}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onInviteUser={() => openModal('showInviteModal')}
        onRoleChange={actions.updateUserRole}
        onEditClick={(user) => {
          selectUser(user);
          openModal('showEditModal');
        }}
        onDeleteClick={(user) => {
          selectUser(user);
          openModal('showDeleteModal');
        }}
        onManagerChange={actions.updateUserManager}
        updateMessage={message}
        onRefresh={refresh}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        availableRoles={availableRoles}
        managers={managers}
      />

      {/* Download Results Section */}
      <DownloadResultsSection organizationId={user?.organization_id} />

      {/* Modals */}
      <AdminModals
        modals={{
          showInviteModal: modals.showInviteModal,
          showDeleteModal: modals.showDeleteModal,
          showEditModal: modals.showEditModal,
          showOrgModal: modals.showOrgModal,
          showCycleModal: modals.showCycleModal,
          showWelcomeModal: modals.showWelcomeModal,
          showAddAdminModal: modals.showAddAdminModal,
        }}
        selected={{
          selectedUser: selected.selectedUser,
          selectedOrg: selected.selectedOrg,
          selectedAdminId: selected.selectedAdminId,
        }}
        organizations={organizations}
        adminCandidates={adminCandidates}
        status={status}
        onClose={closeModal}
        handleCreateOrg={handleCreateOrg}
        handleAddAdmin={handleAddAdmin}
        handleInviteUser={handleInviteUser}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        handleUpdateWelcomeMessage={handleUpdateWelcomeMessage}
      />
    </div>
  );
}
