import { supabase } from '../../lib/supabase';
import type { Organization, Profile } from '../../types/database';

export async function fetchOrganizations(role: string, userId: string, organizationId?: string) {
  try {
    let query = supabase.from('organizations').select('*');
    
    // If company admin, only fetch their organization
    if (role === 'company_admin' && organizationId) {
      query = query.eq('id', organizationId);
    }

    const { data: orgs, error: orgsError } = await query;
    if (orgsError) throw orgsError;

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('organization_id, role');

    if (profilesError) throw profilesError;

    const orgsWithStats = orgs.map(org => ({
      ...org,
      adminCount: profiles.filter(p => p.organization_id === org.id && p.role === 'company_admin').length,
      userCount: profiles.filter(p => p.organization_id === org.id).length,
    }));

    return orgsWithStats;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function createOrganization(name: string, slug: string, appName: string) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name,
        slug,
        app_name: appName || 'HR Performance',
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function deleteOrganization(orgId: string) {
  try {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', orgId);

    if (error) throw error;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function addAdminToOrganization(userId: string, organizationId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'company_admin',
        organization_id: organizationId,
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (err: any) {
    throw new Error(err.message);
  }
}
