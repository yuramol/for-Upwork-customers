import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthUser, useLocalStorage } from 'hooks';
import { Loader, Layout } from 'components';
import { NotFoundPage } from 'pages';
import { pages, Role } from 'constant';
import { LiveTracker } from 'modules';
import { PageTitle } from 'components/Layout';

export const AppRouter = () => {
  const [jwt] = useLocalStorage('jwt');
  const { user, isAuth } = useAuthUser();

  if (jwt !== null && !isAuth) return <Loader />;
  const currentPages =
    jwt !== null
      ? pages.filter(({ role }) => role.includes(user.role.type))
      : pages.filter(({ role }) => role.includes(Role.Public));

  return (
    <Routes>
      <Route element={<Layout pages={currentPages} />}>
        <Route
          path="*"
          element={
            isAuth && jwt !== null ? (
              <NotFoundPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {isAuth && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}
        {currentPages.map(({ index, name, href, Component }) => (
          <Route
            index={index}
            key={name}
            path={href}
            element={
              <Suspense fallback={<div />}>
                <PageTitle title={name}>
                  <div>
                    <Component title={name} />
                    {isAuth && <LiveTracker />}
                  </div>
                </PageTitle>
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};
