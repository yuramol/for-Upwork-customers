import { jwtDecode } from 'jwt-decode';

import { Database, Enums } from '@/lib/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

type AccessTokenPayload = {
  app_metadata?: {
    user_context?: {
      customer_external_id?: string;
      customer_id?: string;
      role?: string;
      signup_completed?: boolean;
    };
  };
};

export const getUserContext = async (
  supabase: SupabaseClient<Database, 'public'>
) => {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  let accessTokenPayload: AccessTokenPayload | null = null;
  try {
    accessTokenPayload = jwtDecode(accessToken || '');
  } catch (err) {
    /* empty */
  }

  const customerId =
    accessTokenPayload?.app_metadata?.user_context?.customer_id;
  const role = (accessTokenPayload?.app_metadata?.user_context?.role ??
    'guest') as Enums<'member_role'>;
  const isSignupComplete =
    accessTokenPayload?.app_metadata?.user_context?.signup_completed ?? false;

  return { customerId, role, isSignupComplete };
};
