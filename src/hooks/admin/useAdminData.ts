import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as organizationService from '../../services/admin/organizationService';
import * as cycleService from '../../services/admin/cycleService';
import * as userService from '../../services/admin/userService';
import * as welcomeMessageService from '../../services/admin/welcomeMessageService';
import type { Organization, Profile, EvaluationCycle } from '../../types/database';

export function useAdminData() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState<(Profile & { email: string })[]>([]);
  const [organizations, setOrganizations] = useState<(Organization & { adminCount: number; userCount: number })[]>([]);
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user?.organization_id, role]); // Add dependencies to re-fetch when organization or role changes

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchOrganizations(),
        fetchCycles(),
        user?.organization_id && fetchWelcomeMessage(),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Always pass organization_id for company_admin role
      const data = await userService.fetchUsers(
        role,
        role === 'company_admin' ? user?.organization_id : undefined
      );
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const data = await organizationService.fetchOrganizations(role, user?.id, user?.organization_id);
      setOrganizations(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchCycles = async () => {
    try {
      const data = await cycleService.fetchCycles(role, user?.organization_id);
      setCycles(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchWelcomeMessage = async () => {
    if (!user?.organization_id) return;
    try {
      const message = await welcomeMessageService.fetchWelcomeMessage(user.organization_id);
      setWelcomeMessage(message);
    } catch (err: any) {
      console.error('Error fetching welcome message:', err);
    }
  };

  return {
    data: {
      users,
      organizations,
      cycles,
      welcomeMessage,
    },
    loading,
    error,
    refresh: fetchData,
    setUsers,
    setOrganizations,
    setCycles,
    setWelcomeMessage,
  };
}
