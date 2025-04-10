import { STATUSES_VARIANTS } from '@/components/ui/badge-status';
import { INVITE_STATUSES } from '@/types/invites';
import { ORDER_STATUSES } from '@/types/orders';
import { QUOTE_STATUSES } from '@/types/quotes';

export const getStatusVariantLabel = (
  value: QUOTE_STATUSES | INVITE_STATUSES | ORDER_STATUSES | null
) => (value ? STATUSES_VARIANTS[value] : null);
