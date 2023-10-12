import { FC, useCallback } from 'react';
import { OrdersList } from './OrdersList';
import { Avatar, Box, SafeAreaView, Text } from '../../legos';
import { useOrderDetails } from '../../components/orderDetails';
import { isIOS, useTabs, isAndroid, useMe } from '../../utils';
import { useNotificationReceiver } from '../../utils/useNotifications/useNotificationReceiver';
import { OrdersProps, OrdersType } from './helpers';

export const Orders: FC<OrdersProps> = ({ route }) => {
  const { me } = useMe();
  const { openOrderDetailsModal, renderOrderDetailsModal } = useOrderDetails();

  useNotificationReceiver(
    route?.params?.orderId,
    route?.params?.messageId,
    notificationTrigger,
  );

  const { renderTabView } = useTabs(
    [
      {
        title: 'Active',
        component: () => (
          <OrdersList
            type={OrdersType.ACTIVE}
            openOrderDetails={openOrderDetailsModal}
          />
        ),
      },
      {
        title: 'Archived',
        component: () => (
          <OrdersList
            type={OrdersType.ARCHIVED}
            openOrderDetails={openOrderDetailsModal}
          />
        ),
      },
    ],
    {
      tabBarMarginLeft: isIOS() ? 16 : 0,
      tabBarMarginRight: isIOS() ? 16 : 0,
    },
  );

  return (
    <>
      <SafeAreaView backgroundColor="white" />
      <Box flex={1} backgroundColor="white">
        <Box paddingLeft={16} paddingRight={16} paddingBottom={14}>
          <Box
            paddingTop={16}
            flexDirection="row"
            alignItems="center"
            height={isIOS() ? 32 : 56}
          >
            {isAndroid() && (
              <>
                <Box marginRight={24}>
                  <Avatar size={32} src={me?.patient.avatar} disabledChange />
                </Box>
                <Text
                  fontSize={20}
                  lineHeight={28}
                  fontWeight={500}
                  color="mainBlack"
                >
                  Orders
                </Text>
              </>
            )}
          </Box>
          {isIOS() && (
            <Text
              fontSize={31}
              lineHeight={41}
              fontWeight={700}
              color="mainBlack"
            >
              Orders
            </Text>
          )}
        </Box>
        {renderTabView()}
        {renderOrderDetailsModal()}
      </Box>
    </>
  );
};
