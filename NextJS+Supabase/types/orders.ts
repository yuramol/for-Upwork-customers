import { Tables } from './database.types';
import { TUser } from './users';
import { TVehicle } from './vehicles';

export enum ORDER_STATUSES {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  AWAITING_SHIPMENT = 'awaiting_shipment',
  SCHEDULED = 'scheduled',
  PICKED_UP = 'picked_up',
  DELIVERED = 'delivered',
  ON_HOLD = 'on_hold',
  CANCELED = 'cancelled',
  CLAIM = 'claim'
}

export type TOrder = Tables<'orders'> & {
  order_vehicles: TVehicle[];
  order_users: TUser[];
  picked_up: {
    business_name: string | null;
    location_type: string | null;
    zip: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    contact_name: string | null;
    contact_type: string | null;
    contact_phone: string | null;
    contact_second_phone: string | null;
    is_terminal: boolean;
    id: number | null;
  } | null;
  deliver_to: {
    business_name: string | null;
    location_type: string | null;
    zip: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    contact_name: string | null;
    contact_type: string | null;
    contact_phone: string | null;
    contact_second_phone: string | null;
    is_terminal: boolean;
    id: number | null;
  } | null;
};
