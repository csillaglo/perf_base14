import { useState, useMemo } from 'react';
import type { Profile, Organization, UserRole } from '../../types/database';

interface Filters {
  organization: string;
  role: string;
  manager: string;
  searchTerm: string;
}

export function useAdminFilters(
  users: (Profile & { email: string })[],
  organizations: Organization[],
  currentUserRole: string,
  currentUserOrgId?: string
) {
  const [filters, setFilters] = useState<Filters>({
    organization: currentUserRole === 'company_admin' ? (currentUserOrgId || '') : '',
    role: '',
    manager: '',
    searchTerm: '',
  });

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // For company admin, always filter by their organization
    if (currentUserRole === 'company_admin' && currentUserOrgId) {
      result = result.filter(u => u.organization_id === currentUserOrgId);
    } else {
      // For other roles, apply organization filter if selected
      if (filters.organization) {
        result = result.filter(u => u.organization_id === filters.organization);
      }
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter(u => u.role === filters.role);
    }

    // Apply manager filter
    if (filters.manager) {
      result = result.filter(u => u.manager_id === filters.manager);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(u => 
        u.full_name?.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.department?.toLowerCase().includes(searchLower) ||
        u.job_name?.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [users, filters, currentUserRole, currentUserOrgId]);

  const managers = useMemo(() => 
    users.filter(user => user.role === 'manager'),
    [users]
  );

  const clearFilters = () => {
    if (currentUserRole === 'company_admin' && currentUserOrgId) {
      // Company admin can only clear role and manager filters
      setFilters(prev => ({
        ...prev,
        role: '',
        manager: '',
        searchTerm: '',
        organization: currentUserOrgId // Keep organization filter
      }));
    } else {
      // Other roles can clear all filters
      setFilters({
        organization: '',
        role: '',
        manager: '',
        searchTerm: '',
      });
    }
  };

  const updateFilter = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const availableRoles = useMemo(() => {
    const roles: UserRole[] = ['employee', 'manager', 'hr_admin', 'company_admin'];
    if (currentUserRole === 'superadmin') {
      roles.push('superadmin');
    }
    return roles;
  }, [currentUserRole]);

  return {
    filters,
    filteredUsers,
    managers,
    availableRoles,
    updateFilter,
    clearFilters,
  };
}
