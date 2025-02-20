import { supabase } from '../../lib/supabase';
import type { EvaluationCycle } from '../../types/database';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

export async function fetchCycles(role: string, organizationId?: string, activeOnly: boolean = false) {
  const fetchOperation = async () => {
    // Return empty array if organizationId is required but not available
    if ((role === 'company_admin' || role === 'hr_admin') && !organizationId) {
      return [];  // Return empty array if company admin has no organization
    }

    let query = supabase
      .from('evaluation_cycles')
      .select('*');

    // If only active cycles are requested
    if (activeOnly) {
      query = query.eq('status', 'active');
    }

    // Filter by organization for company admin and hr admin
    if ((role === 'company_admin' || role === 'hr_admin') && organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    // Add order by
    query = query.order('start_date', { ascending: false });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching cycles:', error);
      throw new Error('Failed to fetch evaluation cycles. Please try again.');
    }

    return data || [];
  };

  try {
    return await retryOperation(fetchOperation);
  } catch (err: any) {
    console.error('Error in fetchCycles:', err);
    throw new Error('Unable to load evaluation cycles. Please check your connection and try again.');
  }
}

export async function createCycle(data: {
  name: string;
  start_date: string;
  end_date: string;
  organization_id?: string;
  status: 'active' | 'inactive';
}) {
  const createOperation = async () => {
    const { error } = await supabase
      .from('evaluation_cycles')
      .insert([data]);

    if (error) {
      console.error('Error creating cycle:', error);
      throw new Error('Failed to create evaluation cycle. Please try again.');
    }
  };

  try {
    await retryOperation(createOperation);
  } catch (err: any) {
    console.error('Error in createCycle:', err);
    throw new Error('Unable to create evaluation cycle. Please try again.');
  }
}

export async function deleteCycle(cycleId: string) {
  const deleteOperation = async () => {
    const { error } = await supabase
      .from('evaluation_cycles')
      .delete()
      .eq('id', cycleId);

    if (error) {
      console.error('Error deleting cycle:', error);
      throw new Error('Failed to delete evaluation cycle. Please try again.');
    }
  };

  try {
    await retryOperation(deleteOperation);
  } catch (err: any) {
    console.error('Error in deleteCycle:', err);
    throw new Error('Unable to delete evaluation cycle. Please try again.');
  }
}

export async function toggleCycleStatus(cycle: EvaluationCycle) {
  const toggleOperation = async () => {
    const newStatus = cycle.status === 'active' ? 'inactive' : 'active';
    
    const { error } = await supabase
      .from('evaluation_cycles')
      .update({ status: newStatus })
      .eq('id', cycle.id);

    if (error) {
      console.error('Error updating cycle status:', error);
      throw new Error('Failed to update cycle status. Please try again.');
    }

    return newStatus;
  };

  try {
    return await retryOperation(toggleOperation);
  } catch (err: any) {
    console.error('Error in toggleCycleStatus:', err);
    throw new Error('Unable to update cycle status. Please try again.');
  }
}
