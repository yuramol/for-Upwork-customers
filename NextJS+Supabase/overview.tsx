'use client';

import { useEffect, useState } from 'react';

import PageContainer from '@/components/layout/page-container';
import { createBrowserClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/providers/auth-store-provider';
import { Database } from '@/types/database.types';
import { ROLES } from '@/types/roles';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { Typography } from '@ui/typography';

import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { RecentSales } from './recent-sales';

const supabase = createBrowserClient();

type TUserRole = Database['public']['Tables']['users_role']['Row'];
type TUser = Database['public']['Tables']['users']['Row'];

interface IUserWithCompany extends Omit<TUserRole, 'user'> {
  company_id:
    | Database['public']['Tables']['users_role']['Row']['company_id']
    | null;
  user_id: Database['public']['Tables']['users_role']['Row']['user_id'];
  users: TUser[];
}

type TCompanyLabel = {
  id: Database['public']['Tables']['companies']['Row']['id'];
  name: Database['public']['Tables']['companies']['Row']['name'];
};

// const getCompanyUsers = async(companyId: string) => {
//   const { data, error } = await await supabase
//     .from('users_role')
//     .select('user_id, users!inner(id, first_name, last_name, logo_url, email)')
//     .eq('company_id', companyId);
//
//   if (data) {
//     return data;
//   }
// }

const getMembersForAdmin = async (): Promise<TUser[] | null> => {
  const { data } = await supabase.from('users_role').select('users!inner(*)');

  if (!data) {
    return null;
  }

  const users: TUser[] | null = data?.flatMap((item) => item.users) || [];

  if (!users?.length) {
    return null;
  }

  return users;
};

const getCompanies = async (): Promise<TCompanyLabel[] | null> => {
  const { data } = await supabase.from('companies').select('id, name');

  if (data) {
    return data;
  }

  return null;
};

// const inviteNewMemberToCompany = async(companyId: string, adminId: string) => {
const inviteNewMemberToCompany = async () => {
  const response = await fetch('/api/invite/create', {
    method: 'POST',
    // todo data from fields
    body: JSON.stringify({
      email: 'company_member5@gmail.com',
      first_name: 'company_member5',
      last_name: 'company_member5',
      phone: '555555'
    })
  });
  const result = await response.json();
};

// const getFunc = async() => {
//   const { data, error } = await supabase.rpc('auth.uid')
//   console.log(data);
//   if (data) {
//     return data;
//   }
// }

export default function OverViewPage() {
  const user = useAuthStore((store) => store.profile);
  // const { data: quotes } = useQuotes();
  const [members, setMembers] = useState<TUser[] | null>(null);
  const [companies, setCompanies] = useState<TCompanyLabel[] | []>([]);
  const getCompanyUsers = async (userCompanyId: string) => {
    // @ts-ignore
    const { data }: { data: IUserWithCompany[] | null } = await supabase
      .from('users_role')
      .select('user_id, company_id, users!inner(*)')
      .eq('company_id', userCompanyId)
      .throwOnError();

    if (data?.length) {
      const users: TUser[] | null = data?.flatMap((item) => item.users) || [];

      setMembers(users);
    }
  };

  const getAdminState = async () => {
    const [companies, members]: [TCompanyLabel[] | null, TUser[] | null] =
      await Promise.all([getCompanies(), getMembersForAdmin()]);

    if (companies) {
      setCompanies(companies);
    }

    if (members) {
      setMembers(members);
    }
  };

  useEffect(() => {
    if (user) {
      if (user?.role && [ROLES.super_admin, ROLES.admin].includes(user?.role)) {
        getAdminState().then();
      } else if (user?.companyId) {
        getCompanyUsers(user?.companyId).then();
      }
    }
    // getFunc().then()
  }, [user]);

  return (
    <PageContainer scrollable>
      <div className='space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <Typography variant='h5' className='font-bold tracking-tight'>
            Hi, Welcome back 👋
          </Typography>
          <Button variant='text' onClick={inviteNewMemberToCompany}>
            invite new company member
          </Button>
          <div className='hidden items-center space-x-2 md:flex'>
            <Button variant='default' size='large'>
              Download
            </Button>
          </div>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics' disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='font-medium'>Total Revenue</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground size-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <Typography
                    variant='caption'
                    className='text-muted-foreground'
                  >
                    +20.1% from last month
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='font-medium'>Subscriptions</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground size-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <Typography
                    variant='caption'
                    className='text-muted-foreground'
                  >
                    +180.1% from last month
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='font-medium'>Sales</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground size-4'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <Typography
                    variant='caption'
                    className='text-muted-foreground'
                  >
                    +19% from last month
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='font-medium'>Active Now</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground size-4'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <Typography
                    variant='caption'
                    className='text-muted-foreground'
                  >
                    +201 since last hour
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <BarGraph />
              </div>
              <Card className='col-span-4 md:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
              <div className='col-span-4'>
                <AreaGraph />
              </div>
              <div className='col-span-4 md:col-span-3'>
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
