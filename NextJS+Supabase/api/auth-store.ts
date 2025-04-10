import { createStore } from 'zustand';

import { fetchProfile } from '@/lib/fetch-profile';
import { createBrowserClient } from '@/lib/supabase/client';
import { ROLES } from '@/types/roles';

export type Profile = {
  id: string;
  companyId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: ROLES;
};

export type AuthState = {
  profile: Profile | null;
  logout: () => Promise<void>;
};

export type AuthActions = {
  initProfile: (profile: Profile | null) => void;
  refreshProfile: () => Promise<boolean>;
};

export type AuthStore = AuthState & AuthActions;

export const createAuthStore = (initProfile: Profile | null) =>
  createStore<AuthState & AuthActions>()((set, get) => ({
    profile: initProfile,
    initProfile(profile) {
      set({
        profile
      });
    },

    async refreshProfile() {
      const supabase = createBrowserClient();
      const profileData: Profile | null = await fetchProfile(supabase);
      if (!profileData) {
        set({
          profile: null
        });
        return false;
      }

      set({
        profile: {
          ...profileData
        }
      });
      return true;
    },

    async logout() {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      set({ profile: null });
    }
  }));
