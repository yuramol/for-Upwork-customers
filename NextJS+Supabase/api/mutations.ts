import { toast } from 'sonner';

import { ClientFormFields } from '@/components/client-form/types';
import { CarrierInfoFields } from '@/components/create-order-form/components/carrier-info-form/components/types';
import { OrderRouteFormFields } from '@/components/create-order-form/components/order-route-form/types';
import {
  CreateOrderFormData,
  EditOrderFormData,
  OrderFormFields
} from '@/components/create-order-form/types';
import { PaymentFormFields } from '@/components/payment-form/types';
import { ShippingScheduleFormFields } from '@/components/shipping-schedule-form/types';
import {
  IVehicleParams,
  VehicleFormData,
  VehiclesFormFields
} from '@/components/vehicle-form/types';
import { createBrowserClient } from '@/lib/supabase/client';
import {
  getFormattedDateToString,
  getFormattedUserIds,
  getFormattedVehicles
} from '@/lib/utils';
import { Enums } from '@/types/database.types';
import { ORDER_STATUSES } from '@/types/orders';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const supabase = createBrowserClient();

export type OrderLocationInput = {
  type: 'from' | 'to';
  business_name?: string;
  location_type?: string;
  zip?: string;
  address?: string;
  city?: string;
  state?: string;
  contact_name?: string;
  contact_type?: string;
  contact_phone?: string;
  contact_second_phone?: string;
  lat?: number;
  lng?: number;
  is_terminal?: boolean;
  is_default_terminal?: boolean;
};

// Hook to upload a file to a specified bucket and file path
type UploadFileParams = {
  bucketName: string;
  filePath: string;
  file: File;
};

type FileOperationsParams = {
  bucketName: string;
  filePath: string;
};

const createOrderFromQuote = async (quoteId: number): Promise<string> => {
  const result = await supabase
    .rpc('create_order_from_quote', { p_quote_id: quoteId })
    .maybeSingle();
  if (result.error) {
    console.error('Error creating order from quote:', result.error);
    throw new Error(result.error.message);
  }

  const orderId: string | undefined = result.data?.order_id;
  if (!orderId) {
    throw new Error('No order ID returned from create_order_from_quote');
  }

  return orderId;
};

export const useCreateOrderFromQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: number) => createOrderFromQuote(quoteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
    }
  });
};

const createOrderLocation = async (
  input: OrderLocationInput
): Promise<number> => {
  const { data, error } = await supabase
    .from('order_locations')
    .insert([input])
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Error inserting order location:', error);
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error('No ID returned from order_locations insert');
  }

  return data.id;
};

export const useCreateOrderLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: OrderLocationInput) => createOrderLocation(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['order_locations'] });
    }
  });
};

type CreateOrderAndVehiclesInput = {
  user_ids?: string[];
  client_phone?: string;
  to_address?: string;
  from_address?: string;
  from_lng?: number;
  from_lat?: number;
  to_lng?: number;
  to_lat?: number;
  delivery_speed?: string;
  ship_date?: string;
  delivery_instructions?: string;
  pickup_instructions?: string;
  distance?: string;
  company_id?: string;
  vehicles?: IVehicleParams[];
  pickup_from_id?: number;
  deliver_to_id?: number;
  pickup_from_json?: Record<string, any>;
  deliver_to_json?: Record<string, any>;
  valid_till?: string;
  readable_id?: string;
  pickup_date_type?: string;
  delivery_date_type?: string;
  pickup_date?: string;
  delivery_date?: string;
  broker_fee?: string;
  payment_valid_until?: string;
  dispatcher_name?: string;
  dispatcher_phone?: string;
  dispatcher_show_to_client?: boolean;
  driver_name?: string;
  driver_phone?: string;
  driver_show_to_client?: boolean;
  carrier_name?: string;
  carrier_phone?: string;
  carrier_show_to_client?: boolean;
  client_special_instructions?: string;
  vehicles_special_instructions?: string;
  pickup_from_special_instructions?: string;
  deliver_to_special_instructions?: string;
  schedule_special_instructions?: string;
  driver_special_instructions?: string;
  carrier_special_instructions?: string;
  status?: ORDER_STATUSES;
};

type CreateUpdateOrderResponse = {
  order_id?: number | string;
  order_readable_id?: string;
} | null;

const createUpdateOrderMutation = async (
  data: CreateOrderFormData | EditOrderFormData
): Promise<CreateUpdateOrderResponse> => {
  const dataVehicles: VehicleFormData[] | [] =
    data[VehiclesFormFields.Vehicles];

  const vehicles = getFormattedVehicles(dataVehicles);

  const user_ids: string[] | undefined = getFormattedUserIds(data) ?? [];

  const ship_date: string = getFormattedDateToString(
    data[ShippingScheduleFormFields.AvailableDate]
  );
  const delivery_date: string = getFormattedDateToString(
    data[ShippingScheduleFormFields.DeliveryDate]
  );
  const pickup_date: string = getFormattedDateToString(
    data[ShippingScheduleFormFields.PickupDate]
  );

  const valid_till = (data as EditOrderFormData)[PaymentFormFields.Until]
    ? getFormattedDateToString(
        (data as EditOrderFormData)[PaymentFormFields.Until] as Date
      )
    : null;

  const body: CreateOrderAndVehiclesInput = {
    // CLIENT
    company_id: data[ClientFormFields.BusinessName],
    user_ids,
    client_phone: data[ClientFormFields.Phone],
    client_special_instructions: data[ClientFormFields.Instruction],

    // VEHICLES
    vehicles,

    // ROUTE FROM
    pickup_from_id: data[OrderRouteFormFields.FromTerminalId],
    pickup_from_json: {
      business_name: data[OrderRouteFormFields.FromBusinessName],
      location_type: data[OrderRouteFormFields.FromBusinessType],
      zip: data[OrderRouteFormFields.FromZip],
      address: data[OrderRouteFormFields.FromAddress],
      city: data[OrderRouteFormFields.FromCity],
      state: data[OrderRouteFormFields.FromState],
      contact_type: data[OrderRouteFormFields.FromType],
      contact_name: data[OrderRouteFormFields.FromName],
      contact_phone: data[OrderRouteFormFields.FromPhone],
      contact_second_phone: data[OrderRouteFormFields.FromSecondPhone],

      lat: data[OrderRouteFormFields.FromLat],
      lng: data[OrderRouteFormFields.FromLng],
      geo: data[OrderRouteFormFields.FromGeo],

      is_terminal: data[OrderRouteFormFields.FromIsItTerminal] || false,
      is_default_terminal: false
    },

    // ROUTE TO
    deliver_to_id: data[OrderRouteFormFields.ToTerminalId],
    deliver_to_json: {
      business_name: data[OrderRouteFormFields.ToBusinessName],
      location_type: data[OrderRouteFormFields.ToBusinessType],
      zip: data[OrderRouteFormFields.ToZip],
      address: data[OrderRouteFormFields.ToAddress],
      city: data[OrderRouteFormFields.ToCity],
      state: data[OrderRouteFormFields.ToState],
      contact_type: data[OrderRouteFormFields.ToType],
      contact_name: data[OrderRouteFormFields.ToName],
      contact_phone: data[OrderRouteFormFields.ToPhone],
      contact_second_phone: data[OrderRouteFormFields.ToSecondPhone],

      lat: data[OrderRouteFormFields.ToLat],
      lng: data[OrderRouteFormFields.ToLng],
      geo: data[OrderRouteFormFields.ToGeo],

      is_terminal: data[OrderRouteFormFields.ToIsItTerminal] || false,
      is_default_terminal: false
    },

    // SHIPPING SCHEDULE
    delivery_date,
    delivery_date_type: data[ShippingScheduleFormFields.DeliveryDateType],
    delivery_speed: data[ShippingScheduleFormFields.DeliverySpeed],
    distance: data[OrderRouteFormFields.Distance],

    pickup_date,
    pickup_date_type: data[ShippingScheduleFormFields.PickupDateType],
    schedule_special_instructions: data[ShippingScheduleFormFields.Instruction],

    pickup_from_special_instructions:
      data[OrderRouteFormFields.FromInstruction],
    deliver_to_special_instructions: data[OrderRouteFormFields.ToInstruction],
    ship_date
  };
  if ((data as EditOrderFormData)[OrderFormFields.OrderId]) {
    if (!body.deliver_to_id && body.deliver_to_json) {
      delete body.deliver_to_json?.lat;
      delete body.deliver_to_json?.lng;
      try {
        const res = await supabase
          .from('order_locations')
          .insert({
            ...body.deliver_to_json
          })
          .select('*');

        body.deliver_to_id = res.data?.[0].id;
      } catch (err) {
        console.error('Error inserting deliver to location:', err);
      }
    }

    if (!body.pickup_from_id && body.pickup_from_json) {
      delete body.pickup_from_json?.lat;
      delete body.pickup_from_json?.lng;
      try {
        const res = await supabase
          .from('order_locations')
          .insert({
            ...body.pickup_from_json
          })
          .select('*');

        body.pickup_from_id = res.data?.[0].id;
      } catch (err) {
        console.error('Error inserting pickup from location:', err);
      }
    }

    delete body.deliver_to_json;
    delete body.pickup_from_json;
    delete body.user_ids;
    delete body.vehicles;

    const editOrderBody = {
      ...body,
      status: (data as EditOrderFormData)[
        OrderFormFields.Status
      ] as ORDER_STATUSES,

      // PAYMENT
      carrier_price: (data as EditOrderFormData)[
        PaymentFormFields.CarrierPrice
      ],
      broker_fee: (data as EditOrderFormData)[PaymentFormFields.BrokerFee],
      valid_till,

      // DISPATCHER
      dispatcher_name: (data as EditOrderFormData)[
        CarrierInfoFields.DispatcherName
      ],
      dispatcher_phone: (data as EditOrderFormData)[
        CarrierInfoFields.DispatcherPhone
      ],
      dispatcher_show_to_client: (data as EditOrderFormData)[
        CarrierInfoFields.DispatcherIsShowPhone
      ],

      // DRIVER
      driver_name: (data as EditOrderFormData)[CarrierInfoFields.DriverName],
      driver_phone: (data as EditOrderFormData)[CarrierInfoFields.DriverPhone],
      driver_show_to_client: (data as EditOrderFormData)[
        CarrierInfoFields.DriverIsShowPhone
      ],
      driver_special_instructions: (data as EditOrderFormData)[
        CarrierInfoFields.DriverInstruction
      ],

      // CARRIER
      carrier_name: (data as EditOrderFormData)[CarrierInfoFields.CarrierName],
      carrier_phone: (data as EditOrderFormData)[
        CarrierInfoFields.CarrierPhone
      ],
      carrier_show_to_client: (data as EditOrderFormData)[
        CarrierInfoFields.CarrierIsShowPhone
      ],
      carrier_special_instructions: (data as EditOrderFormData)[
        CarrierInfoFields.CarrierInstruction
      ]
    };

    const { error } = await supabase
      .from('orders')
      .update(editOrderBody)
      .eq(
        'readable_id',
        `${(data as EditOrderFormData)[OrderFormFields.OrderId]}`
      );

    if (error) {
      console.error('Error updaing order:', error);
      throw new Error(error.message);
    }

    return (data as EditOrderFormData)[OrderFormFields.OrderId]
      ? {
          order_readable_id: (data as EditOrderFormData)[
            OrderFormFields.OrderId
          ]
        }
      : null;
  } else {
    const { data: result, error } = await supabase.rpc(
      'create_order_and_vehicles',
      //@ts-ignore
      body
    );
    if (error) {
      console.error('Error creating order and vehicles:', error);
      throw new Error(error.message);
    }

    if (!result) {
      throw new Error('No data returned from create_order_and_vehicles');
    }

    return result[0] as CreateUpdateOrderResponse;
  }
};

export const useCreateUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderFormData | EditOrderFormData) =>
      createUpdateOrderMutation(input),
    onSuccess: async (response: CreateUpdateOrderResponse) => {
      if (response?.order_readable_id) {
        await queryClient.refetchQueries({
          queryKey: ['order', response.order_readable_id]
        });
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    },
    onError: async (error) => {
      toast.error(error.message);
    }
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bucketName,
      filePath = Date.now().toString(),
      file
    }: UploadFileParams) => {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-files-bucket'] });
    }
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bucketName, filePath }: FileOperationsParams) => {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['order-files-bucket'] });
    }
  });
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: async ({ bucketName, filePath }: FileOperationsParams) => {
      // we create temp link and open it in a blank tab
      const { error, data } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 20);

      if (data) {
        window.open(data.signedUrl, '_blank');
      }

      if (error) {
        console.error('Error downloading the file:', error);
        throw new Error(error.message);
      }

      return { success: true };
    }
  });
};

const updateOrderStatus = async ({
  readable_id,
  status
}: {
  readable_id: string;
  status: ORDER_STATUSES;
}): Promise<string> => {
  await supabase
    .from('orders')
    .update({ status })
    .eq('readable_id', readable_id);

  return readable_id;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { readable_id: string; status: ORDER_STATUSES }) =>
      updateOrderStatus(params),
    onSuccess: async (readable_id) => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['order', readable_id] });
    }
  });
};

interface IAssignUsersToOrderParams {
  users: string[];
  orderId: number;
  companyId: string;
  readable_id: string;
}

const assignUserToOrder = async (
  params: IAssignUsersToOrderParams
): Promise<string> => {
  const data = params.users.map((userId: string) => {
    return {
      user_id: userId,
      order_id: params.orderId
      // company_id: params.companyId
    };
  });

  await supabase.from('order_users').insert(data).throwOnError();

  return params.readable_id;
};

export const useAssignUsersToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IAssignUsersToOrderParams) =>
      assignUserToOrder(params),
    onSuccess: async (readable_id: string) => {
      await queryClient.invalidateQueries({
        queryKey: ['orders']
      });
      await queryClient.refetchQueries({
        queryKey: ['order', readable_id]
      });
    }
  });
};

interface ICancelOrderParams {
  readable_id: string;
  cancel_reason: Enums<'order_cancel_reason'>;
}

const cancelOrder = async ({
  readable_id,
  cancel_reason
}: ICancelOrderParams): Promise<string> => {
  await supabase
    .from('orders')
    .update({ status: 'cancelled', cancel_reason })
    .eq('readable_id', readable_id);

  return readable_id;
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ICancelOrderParams) => cancelOrder(params),
    onSuccess: async (readable_id: string) => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.refetchQueries({
        queryKey: ['order', readable_id]
      });
    }
  });
};
