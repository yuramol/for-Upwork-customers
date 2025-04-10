'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { useTransition } from 'react';

import { mulishFont } from '@/assets/fonts/fonts';
import { ComponentContainer } from '@/components/layout/component-container';
import { QuickOrderAutocomplete } from '@/components/quick-order-autocomplete';
import { HEADER_NAV } from '@/constants/data';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/hooks/use-cart';
import { useFullName } from '@/hooks/use-full-name';
import { cn } from '@/lib/utils';
import { useMeStore } from '@/store/me/meProvider';
import { Button } from '@ui/button';
import { Icon } from '@ui/icon';
import { Typography } from '@ui/typography';

import { DropdownMenu } from '../dropdown-menu';
import { UserDropdownMenu } from '../user-dropdown-menu';

interface HeaderProps {
  customerLayout?: boolean;
}

export default function Header({ customerLayout }: HeaderProps) {
  const { t } = useTranslation();
  const userName = useFullName();
  const { totalItems } = useCart();
  const { me, logout } = useMeStore((state) => state);
  const [logoutLoading, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  const isNotification = true;

  return (
    <header>
      <div className="flex h-20 flex-row items-center bg-white py-[13px]">
        <ComponentContainer className="flex flex-row items-center justify-between">
          <Link
            href={
              me?.role === 'admin' || me?.role === 'customer_service'
                ? ROUTES.ORDERS_ADMIN
                : ROUTES.DASHBOARD
            }
            className="flex flex-row items-center gap-2.5"
          >
            <div className="size-10 rounded-full bg-primary" />
            <Typography
              variant="h3"
              className={cn(
                mulishFont.className,
                'whitespace-nowrap font-bold'
              )}
            >
              Alliedmedical-Lenmax
            </Typography>
          </Link>
          {(me?.role === 'customer_admin' ||
            me?.role === 'customer_manager') && (
            <nav className="flex flex-row items-center gap-10">
              {HEADER_NAV.map(({ id, title, href }) => (
                <Link
                  key={id}
                  href={href}
                  className="text-h4 font-medium hover:text-[#334a83]"
                >
                  {t(title)}
                </Link>
              ))}
            </nav>
          )}
          {me ? (
            <div className="hidden flex-row items-center gap-2.5 sm:flex">
              <Button
                variant="icon"
                size="icon"
                className="relative border border-[#003DA680] bg-[#EBF3FF] hover:bg-secondary"
              >
                <Icon icon="Notification" />
                {isNotification ? (
                  <div className="absolute right-[18.5px] top-[17px] size-2.5 rounded-full bg-error" />
                ) : null}
              </Button>
              <UserDropdownMenu
                userName={userName}
                handleLogout={handleLogout}
                loading={logoutLoading}
              />
            </div>
          ) : (
            <Link href={ROUTES.LOGIN}>
              <Button
                variant="outline"
                className="h-[60px] w-[200px] min-w-max rounded-[10px] border-none bg-primary text-lg font-semibold text-white hover:bg-primary-hover focus-visible:bg-primary-hover"
              >
                {t('auth.login')}
              </Button>
            </Link>
          )}
        </ComponentContainer>
      </div>
      {customerLayout &&
        me?.role !== 'admin' &&
        me?.role !== 'customer_service' && (
          <div className="bg-secondary py-2.5">
            <ComponentContainer className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-[7px]">
                <DropdownMenu />
                {me && <QuickOrderAutocomplete />}
              </div>
              {me && (
                <Link
                  href={ROUTES.CART}
                  className="border- flex h-[60px] flex-row items-center gap-1.5 rounded-[10px] border border-primary bg-white px-[30px] hover:bg-[#ffffffab]"
                >
                  <Icon icon="ShoppingCart" />
                  {`${totalItems === 1 ? t('header.item', { count: 1 }) : totalItems > 1 ? t('header.items', { count: totalItems }) : ''}`}
                </Link>
              )}
            </ComponentContainer>
          </div>
        )}
    </header>
  );
}
