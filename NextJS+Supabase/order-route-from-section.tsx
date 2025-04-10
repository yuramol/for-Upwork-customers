import { DetailAccordionCard } from '@/components/detail-card';
import { DistanceView } from '@/components/distance-view';
import { FormWrapperBlock } from '@/components/ui/form';
import { TOrder } from '@/types/orders';

import RouteInfoViewWithSpecialInstructions from './components/route-info-view';

function OrderRouteView({ order }: { order: TOrder }) {
  return (
    <DetailAccordionCard
      title={'Route'}
      startIcon={'Route'}
      variant={'secondary'}
      variantContent={'primary'}
      contentClassName='flex-col'
    >
      <DistanceView
        fromAddress={order.picked_up?.address ?? order.from_address ?? ''}
        toAddress={order.deliver_to?.address ?? order.to_address ?? ''}
        distance={order.distance ?? ''}
        hideTitle
      />
      <div className='grid grid-cols-1 items-start gap-5 lg:grid-cols-2'>
        {order.picked_up && (
          <FormWrapperBlock>
            <RouteInfoViewWithSpecialInstructions
              value={order.pickup_from_special_instructions ?? ''}
              hideAddButton
              startLabel='Pickup Instructions:'
              handleChange={() => {}}
              businessName={`${order.picked_up?.business_name} (${order.picked_up?.location_type})`}
              address={order.picked_up?.address ?? ''}
              city={order.picked_up?.city ?? ''}
              state={order.picked_up?.state ?? ''}
              zip={order.picked_up?.zip ?? ''}
              contactName={order.picked_up?.contact_name ?? ''}
              contactType={order.picked_up?.contact_type ?? ''}
              contactPhone={order.picked_up?.contact_phone ?? ''}
              contactSecondPhone={order.picked_up?.contact_second_phone ?? ''}
            />
          </FormWrapperBlock>
        )}
        {order.deliver_to && (
          <FormWrapperBlock>
            <RouteInfoViewWithSpecialInstructions
              value={order.deliver_to_special_instructions ?? ''}
              hideAddButton
              startLabel='Delivery Instructions:'
              handleChange={() => {}}
              isDeliveryTo
              businessName={`${order.deliver_to?.business_name} (${order.deliver_to?.location_type})`}
              address={order.deliver_to?.address ?? ''}
              city={order.deliver_to?.city ?? ''}
              state={order.deliver_to?.state ?? ''}
              zip={order.deliver_to?.zip ?? ''}
              contactName={order.deliver_to?.contact_name ?? ''}
              contactType={order.deliver_to?.contact_type ?? ''}
              contactPhone={order.deliver_to?.contact_phone ?? ''}
              contactSecondPhone={order.deliver_to?.contact_second_phone ?? ''}
            />
          </FormWrapperBlock>
        )}
      </div>
    </DetailAccordionCard>
  );
}

export default OrderRouteView;
