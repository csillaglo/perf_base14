import React from 'react';
import type { UserRole } from '../../types/database';

interface UserRoleSelectProps {
  currentRole: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

const roleOrder: UserRole[] = ['employee', 'manager', 'hr_admin', 'company_admin'];

const roleColors = {
  company_admin: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  hr_admin: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  manager: 'bg-green-100 text-green-800 hover:bg-green-200',
  employee: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  superadmin: 'bg-purple-100 text-purple-800'
};

export function UserRoleSelect({ currentRole, onChange, disabled = false }: UserRoleSelectProps) {
  const handleRoleClick = () => {
    if (currentRole === 'superadmin' || disabled) return;
    
    // Find all available roles based on current role
    const availableRoles = getAvailableRoles(currentRole);
    const currentIndex = availableRoles.indexOf(currentRole);
    const nextRole = availableRoles[(currentIndex + 1) % availableRoles.length];
    onChange(nextRole);
  };

  const getAvailableRoles = (role: UserRole): UserRole[] => {
    if (role === 'superadmin') return ['superadmin'];
    
    // Allow company_admin to be changed to any role except superadmin
    return roleOrder;
  };

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'company_admin':
        return 'Company Admin';
      case 'hr_admin':
        return 'HR Admin';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <button
      onClick={handleRoleClick}
      disabled={currentRole === 'superadmin' || disabled}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 ease-in-out ${
        roleColors[currentRole]
      } ${(currentRole === 'superadmin' || disabled) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      {getRoleDisplay(currentRole)}
    </button>
  );
}
