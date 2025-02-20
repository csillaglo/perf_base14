import { supabase } from '../../lib/supabase';

export async function fetchWelcomeMessage(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from('welcome_messages')
      .select('content')
      .eq('organization_id', organizationId)
      .single();

    if (error) {
      // If no message exists, return empty string
      if (error.code === 'PGRST116') {
        return '';
      }
      throw error;
    }

    return data?.content || '';
  } catch (err: any) {
    console.error('Error fetching welcome message:', err);
    return '';
  }
}

export async function updateWelcomeMessage(organizationId: string, content: string) {
  try {
    const { error } = await supabase
      .from('welcome_messages')
      .upsert(
        {
          organization_id: organizationId,
          content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'organization_id'
        }
      );

    if (error) throw error;
  } catch (err: any) {
    console.error('Error updating welcome message:', err);
    throw new Error(err.message);
  }
}
