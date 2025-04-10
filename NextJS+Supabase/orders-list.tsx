'use client';

import { OrderCard } from '@/components/order-card/order-card';
import { Loader } from '@/components/ui/loader';
import { Typography } from '@/components/ui/typography';
import { useOrders } from '@/lib/api/orders/queries';
import { useAuthStore } from '@/providers/auth-store-provider';
import { TOrder } from '@/types/orders';
import { ROLES } from '@/types/roles';

interface OrdersListProps {
  isArchive?: TOrder['is_archive'];
  status?: TOrder['status'];
}

function OrdersList({ isArchive = false, status }: OrdersListProps) {
  const user = useAuthStore((state) => state.profile);

  const { data: orders, isLoading } = useOrders({
    isArchive,
    enabled: !!user?.role,
    status: status,
    userId: user?.role === ROLES.company_employee ? user.id : undefined,
    companyId: user?.role === ROLES.company_admin ? user.companyId : undefined
  });

  if (!isLoading && orders?.length === 0)
    return (
      <Typography variant='body1' className='flex justify-center py-5'>
        Orders List is empty
      </Typography>
    );

  return (
    <>
      {isLoading ? (
        <div className='flex justify-center py-5'>
          <Loader />
        </div>
      ) : (
        orders?.map((order) => (
          <OrderCard order={order} key={order?.readable_id} />
        ))
      )}
    </>
  );
}

export default OrdersList;
