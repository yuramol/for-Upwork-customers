import { useQuery } from '@apollo/client';

import { USERS_QUERY } from 'api';
import { Role } from 'constant/types';
import {
  Maybe,
  Scalars,
  UsersPermissionsUser,
  UsersPermissionsUserEntity,
  UsersPermissionsUserEntityResponseCollection,
  UsersPermissionsUserFiltersInput,
} from 'types/GraphqlTypes';

type Choices = {
  label: string;
  value: Maybe<Scalars['ID']> | undefined;
};

const getUserData = (
  id: Maybe<Scalars['ID']> | undefined,
  attributes: Maybe<UsersPermissionsUser>
) => ({ id, attributes });

const getUserChoicesData = (
  id: Maybe<Scalars['ID']> | undefined,
  attributes: Maybe<UsersPermissionsUser> | undefined
) => ({
  label: `${attributes?.firstName} ${attributes?.lastName}`,
  value: id,
});

export const useNormalizedUsers = (
  filters?: UsersPermissionsUserFiltersInput
) => {
  const { data, loading, refetch } = useQuery<{
    usersPermissionsUsers: UsersPermissionsUserEntityResponseCollection;
  }>(USERS_QUERY, {
    ...(filters ? { variables: { filters } } : {}),
    fetchPolicy: 'cache-first',
  });

  const users = data?.usersPermissionsUsers.data;
  const managers: UsersPermissionsUserEntity[] = [];
  const employees: UsersPermissionsUserEntity[] = [];
  const usersChoices: Choices[] = [];
  const managersChoices: Choices[] = [];
  const employeesChoices: Choices[] = [];

  users?.forEach(({ id, attributes }) => {
    usersChoices.push(getUserChoicesData(id, attributes));

    if (attributes?.role?.data?.attributes?.type === Role.Manager) {
      managers.push(getUserData(id, attributes));
      managersChoices.push(getUserChoicesData(id, attributes));
    }

    if (
      attributes?.role?.data?.attributes?.type === Role.Employee ||
      attributes?.role?.data?.attributes?.type === Role.Manager
    ) {
      employees.push({ id, attributes });
      employeesChoices.push(getUserChoicesData(id, attributes));
    }
  });

  return {
    users,
    managers,
    employees,
    usersChoices,
    managersChoices,
    employeesChoices,
    loading,
    refetch,
  };
};
