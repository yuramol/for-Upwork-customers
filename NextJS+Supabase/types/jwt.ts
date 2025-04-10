import { Enums } from '@/types/database.types';

export interface IDecodedToken {
  sub: string;
  email?: string;
  phone?: string;
  app_metadata?: {
    user_context?: {
      company_id?: string;
      role?: Enums<'member_role'>;
      phone?: string;
    };
  };
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
}
