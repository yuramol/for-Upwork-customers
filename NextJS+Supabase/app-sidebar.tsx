'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useTransition } from 'react';
import { NavItem } from 'types';

import { SIDEBAR_NAV } from '@/constants/data';
import { cn } from '@/lib/utils';
import { useMeStore } from '@/store/me/meProvider';
import { Button } from '@ui/button';
import { Icon } from '@ui/icon';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@ui/sidebar';
import { Typography } from '@ui/typography';

export default function AppSidebar() {
  const pathname: string = usePathname();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const logout = useMeStore((state) => state.logout);
  const [logoutLoading, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="mt-5 overflow-x-hidden">
        <SidebarGroup>
          <SidebarMenu
            className={cn(
              state === 'collapsed' && !isMobile
                ? 'flex w-[75px] flex-col items-center gap-2'
                : ''
            )}
          >
            {SIDEBAR_NAV.map((item: NavItem) => {
              return (
                <React.Fragment key={item.title}>
                  {state === 'expanded' || isMobile ? (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={pathname === item.url}
                        onClick={isMobile ? toggleSidebar : undefined}
                      >
                        <Link href={item.url} className="flex flex-row">
                          <div className="bg-backing flex size-9 items-center justify-center rounded-[10px]">
                            <Icon
                              icon={item.icon ?? 'logo'}
                              className={
                                pathname === item.url
                                  ? item.iconHoverStyle
                                  : item.iconStyle
                              }
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <Link href={item.url} className="flex flex-row">
                        <div
                          className={cn(
                            'flex size-[60px] items-center justify-center rounded-full',
                            pathname === item.url
                              ? 'bg-primary'
                              : 'bg-white hover:bg-secondary'
                          )}
                        >
                          <Icon
                            icon={item.icon ?? 'logo'}
                            className={
                              pathname === item.url
                                ? item.iconHoverStyle
                                : item.iconStyle
                            }
                          />
                        </div>
                      </Link>
                    </SidebarMenuItem>
                  )}
                </React.Fragment>
              );
            })}
            {state === 'collapsed' && !isMobile && (
              <SidebarMenuItem>
                <div
                  className={cn(
                    'flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-error hover:bg-[#bd3b1e]'
                  )}
                  onClick={handleLogout}
                >
                  <Icon icon="Logout" color="var(--white)" />
                </div>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={cn(state === 'collapsed' && !isMobile ? 'items-center' : '')}
      >
        {(state !== 'collapsed' || isMobile) && (
          <Button
            disabled={logoutLoading}
            loading={logoutLoading}
            className="mb-[40px] h-12 gap-2"
            onClick={handleLogout}
          >
            <Icon icon="Logout" />
            <Typography variant="body2">Log Out</Typography>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
