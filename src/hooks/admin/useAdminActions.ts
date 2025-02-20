import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Organization, Profile, UserRole, EvaluationCycle } from '../../types/database';
import * as organizationService from '../../services/admin/organizationService';
import * as userService from '../../services/admin/userService';
import * as cycleService from '../../services/admin/cycleService';
import * as welcomeMessageService from '../../services/admin/welcomeMessageService';

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

interface ActionState {
  inviting: boolean;
  deleting: boolean;
  saving: boolean;
}

export function useAdminActions(
  refresh: () => Promise<void>,
  setUsers: (users: (Profile & { email: string })[]) => void,
  users: (Profile & { email: string })[],
) {
  const { t } = useTranslation();
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [status, setStatus] = useState<ActionState>({
    inviting: false,
    deleting: false,
    saving: false,
  });

  const createOrganization = async (name: string, slug: string, appName: string) => {
    setStatus(prev => ({ ...prev, saving: true }));
    setMessage({ type: '', text: '' });

    try {
      await organizationService.createOrganization(name, slug, appName);
      await refresh();
      setMessage({ type: 'success', text: t('admin.organizations.createSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    } finally {
      setStatus(prev => ({ ...prev, saving: false }));
    }
  };

  const deleteOrganization = async (orgId: string) => {
    try {
      await organizationService.deleteOrganization(orgId);
      await refresh();
      setMessage({ type: 'success', text: t('admin.organizations.deleteSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  const inviteUser = async (email: string, userData: {
    role?: UserRole;
    department?: string;
    job_level?: string;
    job_name?: string;
  }) => {
    setStatus(prev => ({ ...prev, inviting: true }));
    setMessage({ type: '', text: '' });

    try {
      await userService.inviteNewUser(email, userData);
      await refresh();
      setMessage({ 
        type: 'success', 
        text: t('admin.users.invitationSent', { email }) 
      });
      return true;
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || t('admin.users.invitationFailed')
      });
      return false;
    } finally {
      setStatus(prev => ({ ...prev, inviting: false }));
    }
  };

  const updateUser = async (userId: string, userData: Partial<Profile>) => {
    setStatus(prev => ({ ...prev, saving: true }));
    setMessage({ type: '', text: '' });

    try {
      await userService.updateUser(userId, userData);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      ));
      setMessage({ type: 'success', text: t('admin.users.updateSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    } finally {
      setStatus(prev => ({ ...prev, saving: false }));
    }
  };

  const deleteUser = async (userId: string) => {
    setStatus(prev => ({ ...prev, deleting: true }));
    setMessage({ type: '', text: '' });

    try {
      await userService.removeUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setMessage({ type: 'success', text: t('admin.users.deleteSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    } finally {
      setStatus(prev => ({ ...prev, deleting: false }));
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setMessage({ type: 'success', text: t('admin.users.updateSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  const updateUserManager = async (userId: string, managerId: string | null) => {
    try {
      await userService.updateUserManager(userId, managerId);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, manager_id: managerId } : user
      ));
      setMessage({ type: 'success', text: t('admin.users.updateSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  const updateWelcomeMessage = async (organizationId: string, content: string) => {
    try {
      await welcomeMessageService.updateWelcomeMessage(organizationId, content);
      setMessage({ type: 'success', text: t('admin.welcomeMessage.updateSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  const deleteCycle = async (cycleId: string) => {
    try {
      await cycleService.deleteCycle(cycleId);
      await refresh();
      setMessage({ type: 'success', text: t('admin.cycles.deleteSuccess') });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  const toggleCycleStatus = async (cycle: EvaluationCycle) => {
    try {
      const newStatus = await cycleService.toggleCycleStatus(cycle);
      await refresh();
      setMessage({ 
        type: 'success', 
        text: t('admin.cycles.statusUpdateSuccess', { 
          name: cycle.name, 
          status: newStatus === 'active' ? t('admin.cycles.activated') : t('admin.cycles.deactivated') 
        })
      });
      return true;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
      return false;
    }
  };

  return {
    message,
    status,
    actions: {
      createOrganization,
      deleteOrganization,
      inviteUser,
      updateUser,
      deleteUser,
      updateUserRole,
      updateUserManager,
      updateWelcomeMessage,
      deleteCycle,
      toggleCycleStatus,
    },
  };
}
