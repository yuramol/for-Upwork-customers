import { NextRequest, NextResponse } from 'next/server';

import { AUTH_ROUTES, PUBLIC_ROUTES, ROUTES } from '@/constants/routes';
import { Database } from '@/lib/supabase/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

import { routeStartPath } from './checkRoute';

interface AuthMiddlewareParams {
  request: NextRequest;
  supabase: SupabaseClient<Database, 'public'>;
}

export const checkAuthMiddleware = async ({
  request,
  supabase
}: AuthMiddlewareParams) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    if (
      !PUBLIC_ROUTES.some((route) =>
        routeStartPath(route, request.nextUrl.pathname)
      ) &&
      !AUTH_ROUTES.some((route) =>
        routeStartPath(route, request.nextUrl.pathname)
      )
    ) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.LOGIN;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return null;
};
