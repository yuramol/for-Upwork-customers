'use client';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';
import { createBrowserClient } from '@/lib/supabase/client';
import { getUserContext } from '@/utils/get-user-context';
import { useMutation } from '@tanstack/react-query';

interface LoginProps {
  email: string;
  password: string;
}

const supabase = createBrowserClient();

export const useLogin = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    mutateAsync: login,
    isPending,
    error
  } = useMutation({
    mutationFn: async ({ email, password }: LoginProps) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async () => {
      const { role } = await getUserContext(supabase);

      toast.success(t('auth.signedInSuccessfully'));

      const isAdmin = role === 'admin' || role === 'customer_service';

      if (isAdmin) {
        router.replace(ROUTES.ORDERS_ADMIN);
      } else {
        router.replace(ROUTES.DASHBOARD);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return { login, isPending, errorMessage: error?.message };
};
