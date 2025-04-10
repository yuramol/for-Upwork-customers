import { createBrowserClient } from '@/lib/supabase/client';
import { TOrder } from '@/types/orders';
import { TUser } from '@/types/users';
import { useQuery } from '@tanstack/react-query';

interface UseOrdersArgsType {
  isArchive: TOrder['is_archive'];
  enabled?: boolean;
  status?: TOrder['status'];
  userId?: TUser['user_id'];
  companyId?: TOrder['company_id'];
}

const SELECT_ORDER_QUERY =
  '*, order_vehicles(vehicle_id, vehicles(*)), order_users!inner(id, users!inner(id, first_name, last_name, email, phone, users_role(role, companies(name, id)))), picked_up:pickup_from_id(*), deliver_to:deliver_to_id(*)';

const supabase = createBrowserClient();

const fetchOrders = async (
  isArchive: TOrder['is_archive'],
  status?: TOrder['status'],
  userId?: TUser['user_id'],
  companyId?: TOrder['company_id']
): Promise<TOrder[]> => {
  const $q = supabase
    .from('orders')
    .select(SELECT_ORDER_QUERY)
    .or(`is_archive.is.${isArchive}`)
    .order('created_at', { ascending: false });

  if (companyId) {
    $q.eq('company_id', companyId);
  }

  if (userId) {
    $q.eq(`order_users.users.id`, userId);
  }

  if (status) {
    $q.eq('status', status);
  }

  const { data, error } = await $q;

  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(error.message);
  }

  const normalizedData = data?.map((order) => ({
    ...order,
    order_vehicles: order.order_vehicles?.map((vehicle) => ({
      ...vehicle.vehicles,
      id: vehicle.vehicle_id
    })),
    order_users: order.order_users?.map((user) => ({
      ...user.users,
      ...user.users?.users_role
    }))
  }));
  //@ts-ignore TODO: properly type Order
  return normalizedData;
};

export const useOrders = ({
  isArchive,
  enabled,
  status,
  userId,
  companyId
}: UseOrdersArgsType) => {
  return useQuery({
    queryKey: ['orders', isArchive, userId, companyId, status],
    queryFn: (): Promise<TOrder[]> =>
      fetchOrders(isArchive, status, userId, companyId),
    enabled
  });
};

const fetchOrderLocations = async () => {
  const { data, error } = await supabase.from('order_locations').select('*');

  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useOrderLocations = () => {
  return useQuery({
    queryKey: ['order_locations'],
    queryFn: fetchOrderLocations,
    initialData: [],
    staleTime: 0
  });
};

const fetchTerminals = async (createdBy: string) => {
  const { data, error } = await supabase
    .from('order_locations')
    .select('*')
    .eq('created_by', createdBy)
    .eq('is_terminal', true);

  if (error) {
    console.error('Error fetching quotes:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useTerminals = ({
  createdBy,
  enabled
}: {
  createdBy?: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ['terminals', { createdBy }],
    queryFn: () => fetchTerminals(createdBy as string),
    initialData: [],
    enabled: enabled && !!createdBy,
    staleTime: 0
  });
};

export const useOrderFilesList = (readable_id: string) => {
  return useQuery({
    queryKey: ['order-files-bucket', readable_id],
    queryFn: async () => {
      const bucket = await supabase.storage.getBucket(readable_id);
      const files = await supabase.storage.from(readable_id).list();

      return {
        files,
        bucket
      };
    }
  });
};

const fetchOrderById = async (readableId: string): Promise<TOrder> => {
  const errorMessage = `Failed to get quote with id: ${readableId}`;

  const { data, error } = await supabase
    .from('orders')
    .select(SELECT_ORDER_QUERY)
    .eq('readable_id', readableId)
    .single();

  if (error) throw new Error(errorMessage);
  const normalizedData = {
    ...data,
    order_vehicles: data.order_vehicles?.map((vehicle) => ({
      ...vehicle.vehicles,
      id: vehicle.vehicle_id
    })),
    order_users: data.order_users?.map((user) => ({
      ...user.users,
      ...user.users?.users_role
    }))
  };
  // @ts-ignore
  return normalizedData;
};

export const useGetOrderById = (readableId: string) => {
  return useQuery({
    queryKey: ['order', readableId],
    queryFn: () => fetchOrderById(readableId),
    enabled: !!readableId
  });
};
