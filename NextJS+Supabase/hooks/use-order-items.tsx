'use client';

import { QUERY_KEYS } from '@/constants/constants';
import { createBrowserClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';

const supabase = createBrowserClient();

interface UseOrderItemsProps {
  orderId: number;
}

export type OrderItemsType = NonNullable<
  ReturnType<typeof useOrderItems>['data']
>[number];

export const useOrderItems = ({ orderId }: UseOrderItemsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_ITEMS, orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_item_view')
        .select(
          'item_id,item_quantity,item_quantity_shipped,item_unit,item_price,item_price_total,product_images,product_description,product_id,product_mpn'
        )
        .eq('item_order_id', orderId)
        .eq('product_language', 'en')
        .order('product_description');

      if (error) throw new Error(error.message);

      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
  return { data: data, isLoading };
};
