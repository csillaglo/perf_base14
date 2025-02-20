import { useState } from 'react';
import type { Organization, Profile } from '../../types/database';

interface ModalsState {
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

export function useAdminModals() {
  const [modals, setModals] = useState<ModalsState>({
    showInviteModal: false,
    showDeleteModal: false,
    showEditModal: false,
    showOrgModal: false,
    showCycleModal: false,
    showWelcomeModal: false,
    showAddAdminModal: false,
  });

  const [selected, setSelected] = useState<SelectedState>({
    selectedUser: null,
    selectedOrg: null,
    selectedAdminId: '',
  });

  const openModal = (modalName: keyof ModalsState) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof ModalsState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    // Clear selected items when closing modals
    if (modalName === 'showEditModal' || modalName === 'showDeleteModal') {
      setSelected(prev => ({ ...prev, selectedUser: null }));
    }
    if (modalName === 'showAddAdminModal') {
      setSelected(prev => ({ 
        ...prev, 
        selectedOrg: null,
        selectedAdminId: '',
      }));
    }
  };

  const selectUser = (user: Profile & { email: string }) => {
    setSelected(prev => ({ ...prev, selectedUser: user }));
  };

  const selectOrg = (org: Organization) => {
    setSelected(prev => ({ ...prev, selectedOrg: org }));
  };

  const selectAdmin = (adminId: string) => {
    setSelected(prev => ({ ...prev, selectedAdminId: adminId }));
  };

  return {
    modals,
    selected,
    openModal,
    closeModal,
    selectUser,
    selectOrg,
    selectAdmin,
  };
}
