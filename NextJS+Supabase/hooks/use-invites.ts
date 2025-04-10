import { createBrowserClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database.types';
import { useQuery } from '@tanstack/react-query';

export type InviteWithCompany = Tables<'invites'> & {
  companies: Pick<Tables<'companies'>, 'name' | 'id'> | null;
};

const supabase = createBrowserClient();

const fetchInvites = async (): Promise<InviteWithCompany[]> => {
  const { data, error } = await supabase
    .from('invites')
    .select('*, companies(id,name)')
    .order('created_at', { ascending: false }); // desc sorting

  if (error) {
    console.error('Error fetching invites:', error);
    throw new Error(error.message);
  }

  return data ?? [];
};

export const useInvites = () => {
  return useQuery({
    queryKey: ['invites'],
    queryFn: (): Promise<InviteWithCompany[]> => fetchInvites(),
    initialData: [],
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};
