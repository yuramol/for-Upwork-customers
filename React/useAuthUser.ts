import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';
import { ME_QUERY } from 'api';
import { Role } from 'constant/types';
import { Maybe, Scalars } from 'types/GraphqlTypes';

export const useAuthUser = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useLocalStorage('jwt', null);
  const [user, setUser] = useState({
    id: '',
    username: '',
    role: { type: Role.Public },
  });

  const [meQuery, { client }] = useLazyQuery(ME_QUERY, {
    fetchPolicy: 'cache-first',
  });

  const isAuth = user.role.type !== Role.Public;
  const isManager = user.role.type === Role.Manager;

  useEffect(() => {
    if (jwt !== null) {
      meQuery().then(({ data }) => {
        setUser(data?.me);
      });
    } else if (user?.id !== '' && jwt === null) {
      setUser({
        id: '',
        username: '',
        role: { type: Role.Public },
      });
    }
  }, [jwt]);

  const login = (jwt: Maybe<Scalars['String']>) => {
    setJwt(jwt);
    navigate('/', { replace: true });
  };

  const logout = () => {
    setJwt(null);
    client.clearStore();
    navigate('/', { replace: true });
  };

  return {
    jwt,
    user,
    isAuth,
    isManager,
    login,
    logout,
  };
};
