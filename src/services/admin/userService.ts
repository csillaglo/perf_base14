import { supabase } from '../../lib/supabase';
import { inviteUser, deleteUser, updateUserProfile } from '../../lib/auth';
import type { Profile, UserRole } from '../../types/database';

export async function fetchUsers(role: string, organizationId?: string) {
  try {
    // Return empty array if organizationId is required but not available
    if ((role === 'company_admin' || role === 'hr_admin') && !organizationId) {
      return [];
    }

    let query = supabase.from('profiles').select('*');
    
    // Filter by organization for company admin and hr admin
    if ((role === 'company_admin' || role === 'hr_admin') && organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data: profiles, error: profilesError } = await query;
    if (profilesError) throw profilesError;

    const { data: emailData, error: emailsError } = await supabase
      .rpc('get_user_emails');

    if (emailsError) throw emailsError;

    const emailMap = new Map(emailData.map((item: any) => [item.id, item.email]));

    return profiles?.map(profile => ({
      ...profile,
      email: emailMap.get(profile.id) || 'No email'
    })) || [];
  } catch (err: any) {
    throw new Error(err.message);
  }
}


export async function inviteNewUser(email: string, data: {
  role?: UserRole;
  department?: string;
  job_level?: string;
  job_name?: string;
}) {
  try {
    return await inviteUser(email, data);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function updateUser(userId: string, data: {
  full_name?: string;
  role?: UserRole;
  organization_id?: string | null;
  status?: string;
  department?: string;
  job_level?: string;
  job_name?: string;
}) {
  try {
    // Validate role change
    if (data.role) {
      const { data: currentUser, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Only prevent changes to superadmin role
      if (currentUser.role === 'superadmin') {
        throw new Error('Cannot change superadmin role');
      }
    }

    // Proceed with update
    const { error: updateError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (updateError) throw updateError;

  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function removeUser(userId: string) {
  try {
    await deleteUser(userId);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  try {
    // Validate role change
    const { data: currentUser, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Only prevent changes to superadmin role
    if (currentUser.role === 'superadmin') {
      throw new Error('Cannot change superadmin role');
    }

    // Proceed with role update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (updateError) throw updateError;

  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function updateUserManager(userId: string, managerId: string | null) {
  try {
    await updateUserProfile(userId, { manager_id: managerId });
  } catch (err: any) {
    throw new Error(err.message);
  }
}
