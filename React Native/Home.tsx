import { useQuery } from '@apollo/client';
import { Platform, NativeModules } from 'react-native';
import { FC, useEffect, useState, useCallback } from 'react';

import { Box, Text, Loader, ScrollView, IconButton } from '../../legos';
import { FindDoctor } from './FindDoctor';
import { HomeScreenProps } from './helpers';
import { isIOS } from '../../utils';
import { LangManager } from '../../components';
import { OrderMedicine } from './OrderMedicine';
import { GET_ME_QUERY } from '../profile/helpers';
import { useCartNotEmpty } from '../../utils/useCart';
import { useCartModal } from '../../components/cartModal';
import { RequestATestBlock } from '../../components/requestATestBlock';
import { useCheckoutAddressUpdate } from '../../legos/AddressSelect/helpers';

const { StatusBarManager } = NativeModules;
interface StatusBarManagerType {
  height: number;
}

export const Home: FC<HomeScreenProps> = ({ route }) => {
  const [imageUri, setImageUri] = useState<string>('');
  const [name, setName] = useState<string>('');
  const addressId = route?.params?.addressId;
  const [statusBarHeight, setStatusBarHeight] = useState<number>(
    StatusBarManager.HEIGHT,
  );
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({ height }: StatusBarManagerType) => {
        setStatusBarHeight(height);
      });
    }
  }, []);
  const { data, loading: loadingName } = useQuery(GET_ME_QUERY, {
    onCompleted: res => {
      setName(`${res.me?.patient?.firstName}`);
    },
    onError: err => console.log('error', JSON.stringify(err)),
  });

  const cartNotEmpty = useCartNotEmpty();

  const { openCartModal, renderCartModal } = useCartModal();

  useCheckoutAddressUpdate(id => openCartModal(id), addressId);

  const openCartMemoized = useCallback(() => {
    openCartModal();
  }, []);

  return (
    <ScrollView backgroundColor="greyBackground">
      <Box flex={1} backgroundColor="main">
        <Box
          flex={1}
          justifyContent="space-between"
          marginTop={statusBarHeight}
          backgroundColor="main"
        >
          <Box padding={16} flexDirection="row" justifyContent="flex-end">
            <Box
              marginLeft={5}
              justifyContent="space-between"
              flexDirection={isIOS() ? 'row-reverse' : 'row'}
            >
              <LangManager color="white" />
            </Box>
            <Box marginLeft={5}>
              <IconButton
                iconName={cartNotEmpty ? 'cartFilled' : 'cartEmpty'}
                onPress={openCartMemoized}
                iconColor="greyBackground"
              />
            </Box>
          </Box>
          <Box flex={1} justifyContent="center" margin={16}>
            {loadingName ? (
              <Box height={40}>
                <Loader size="small" color="white" backgroundColor="main" />
              </Box>
            ) : (
              <Text
                color="white"
                fontSize={34}
                lineHeight={41}
                fontWeight={700}
                letterSpacing={0.41}
                i18nProps={{ name: `${name}` }}
              >
                hello_name
              </Text>
            )}
            <Text
              fontSize={13}
              fontWeight={400}
              letterSpacing={-0.08}
              lineHeight={18}
              color="white"
            >
              Select the type of service suitable for you
            </Text>
          </Box>
        </Box>
        <Box
          flex={3}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          backgroundColor="greyBackground"
        >
          <FindDoctor />
          <OrderMedicine />
          <RequestATestBlock />
        </Box>
        {renderCartModal()}
      </Box>
    </ScrollView>
  );
};
