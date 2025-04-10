'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useStore } from 'zustand';

import { AuthStore, createAuthStore, Profile } from '@/lib/store/auth-store';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined
);

export type AuthStoreProviderProps = {
  children: ReactNode;
  initProfile?: Profile;
};

export const AuthStoreProvider = ({
  children,
  initProfile
}: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProfileFetched, setIsProfileFetched] = useState(false);

  if (!storeRef.current) {
    storeRef.current = createAuthStore(initProfile ?? null);
  }

  const refresh = async () => {
    await storeRef.current?.getState().refreshProfile();
  };

  useEffect(() => {
    if (loading || isProfileFetched) {
      return;
    }

    setLoading(true);

    if (initProfile) {
      storeRef.current?.getState().initProfile(initProfile);
    } else {
      refresh()
        .then()
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setIsProfileFetched(true);
        });
    }
  }, [loading, initProfile]);

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error('useAuthStore must be used within authStoreContext');
  }

  return useStore(authStoreContext, selector);
};
