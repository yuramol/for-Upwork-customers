import { toast } from 'sonner';

import { CompanyFormFields } from '@/components/company/types';
import { InviteFormWithNewCompany } from '@/components/invites-page/invite-form/types';
import {
  ApproveInviteResponse,
  NewInviteBody
} from '@/components/invites-page/types';
import { TCompany, useCompanies } from '@/lib/api/companies/queries';
import { Profile } from '@/lib/store/auth-store';
import { createBrowserClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/providers/auth-store-provider';
import { ROLES } from '@/types/roles';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const supabase = createBrowserClient();
async function createNewCompany(
  formData: InviteFormWithNewCompany
): Promise<TCompany | null> {
  const { data, error } = await supabase
    .from('companies')
    .insert({
      name: formData[CompanyFormFields.CompanyName],
      description: formData[CompanyFormFields.CompanyDescription],
      type: formData[CompanyFormFields.CompanyType],
      prefix_name: formData[CompanyFormFields.CompanyPrefixName]
    })
    .select();

  if (error) {
    // eslint-disable-next-line
    if (
      error.message ===
      'duplicate key value violates unique constraint \"companies_prefix_name_key\"'
    ) {
      throw new Error(
        `Can't create the company as the company prefix "${formData[CompanyFormFields.CompanyPrefixName]}" is already used in another company`
      );
    } else {
      throw new Error('Was not able to create a new company. Please try again');
    }
  }

  return data?.[0];
}

const sendInviteRequest = async (
  data: InviteFormWithNewCompany,
  user: Profile | null,
  companies: TCompany[]
) => {
  let body: NewInviteBody = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    phone: data.phone
  };
  let newCompanyId;

  if (user?.role === ROLES.super_admin || user?.role === ROLES.admin) {
    if (
      data[CompanyFormFields.CompanyName] &&
      data[CompanyFormFields.CompanyPrefixName]
    ) {
      newCompanyId = (await createNewCompany(data))?.id;
    }

    body = { ...body, role: data.role };

    body = {
      ...body,
      company_id:
        newCompanyId ||
        ((data.role as ROLES) !== ROLES.super_admin &&
        (data.role as ROLES) !== ROLES.admin
          ? companies.find((c) => c.name === data.companyName)?.id
          : undefined)
    };
  }

  if (user?.role === ROLES.company_admin) {
    body = {
      ...body,
      company_id: user.companyId,
      role: [
        ROLES.company_employee as string,
        ROLES.company_admin as string
      ].includes(data.role)
        ? data.role
        : ROLES.company_employee
    };
  }

  const response = await fetch('/api/invite/create', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const result = (await response.json()) as ApproveInviteResponse;

  if (result.error) {
    const emailErrorMessage = 'email';

    throw new Error( // show all email errors. other errors - Something went wrong
      result.error.indexOf(emailErrorMessage) !== -1
        ? result.error
        : 'Something went wrong'
    );
  }
  return result;
};

export const useSendInvite = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((store) => store.profile);
  const { data: companies = [] } = useCompanies();

  return useMutation({
    mutationFn: (data: InviteFormWithNewCompany) =>
      sendInviteRequest(data, user, companies),
    onSuccess: async (result) => {
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Invite was sent');
        onSuccess();
      }

      await queryClient.invalidateQueries({ queryKey: ['invites'] });
      await queryClient.invalidateQueries({ queryKey: ['newInvitesCount'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
