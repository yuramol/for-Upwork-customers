import { FC, useState, useRef, useCallback } from 'react';

import { ListRenderItem, I18nManager } from 'react-native';
import {
  Box,
  Icon,
  Text,
  Select,
  SearchBar,
  Pressable,
  IconButton,
  FlatList,
  Loader,
  EmptyListNotice,
} from '../../legos';
import { ordersType, ShopScreenProps, useMedicineListQuery } from './helpers';
import { isAndroid, isIOS, theme, useBackHeader } from '../../utils';
import { useCartNotEmpty, useCartMutation } from '../../utils/useCart';
import { useCartModal } from '../../components/cartModal';
import { ShopItem } from '../../components/shopItem';
import { ShopItemData } from '../../components/shopItem/helpers';
import { CartActionsProvider } from '../../components/cartModal/helpers';
import { useMedicineDetails } from '../../components/medicineDetails/useMedicineDetails';
import { useCheckoutAddressUpdate } from '../../legos/AddressSelect/helpers';

export const Shop: FC<ShopScreenProps> = ({ route }) => {
  const pharmacyId = route?.params?.pharmacyId;
  const pharmacyName = route?.params?.pharmacyName;
  const addressId = route?.params?.addressId;
  const [searchText, setSearchText] = useState('');
  const [isSearchingModeOn, setIsSearchingModeOn] = useState(false);
  const [currentOrderType, setCurrentOrderType] = useState(ordersType[0]);

  const {
    medicinesData,
    loading,
    fetchMore,
    refetch,
    refreshing,
  } = useMedicineListQuery(pharmacyId, searchText, currentOrderType);

  const {
    addToCartMethod,
    increaseQuantityMethod,
    decreaseQuantityMethod,
    loading: cartLoading,
  } = useCartMutation(pharmacyId);

  const cartNotEmpty = useCartNotEmpty();

  const { openCartModal, renderCartModal } = useCartModal();

  useCheckoutAddressUpdate(id => openCartModal(id), addressId);

  const openCartMemoized = useCallback(() => {
    openCartModal();
  }, []);

  const {
    openMedicineDetails,
    renderMedicineDetailsModal,
  } = useMedicineDetails();

  const selectRef = useRef();

  const keyExtractor = (item: ShopItemData) => `${item.id}`;

  const renderItem: ListRenderItem<ShopItemData> = ({
    item: { id, title, price, imgUrl, prescriptionRequired },
  }) => (
    <ShopItem
      id={id}
      title={title}
      price={price}
      imgUrl={imgUrl}
      pharmacyId={pharmacyId}
      onPress={openMedicineDetails}
      prescriptionRequired={prescriptionRequired}
    />
  );

  const renderEmptyState = () => (
    <EmptyListNotice
      message="Sorry, we couldn't find items matching your criteria. Refine what you are looking for or update filters"
      iconName="medicineEmpty"
    />
  );

  useBackHeader({
    headerTitle: () => (
      <>
        {!isSearchingModeOn && (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Text
              numberOfLines={1}
              fontWeight={600}
              color="mainBlack"
              fontSize={isAndroid() ? 20 : 17}
              lineHeight={isAndroid() ? 32 : 22}
            >
              {pharmacyName}
            </Text>
          </Box>
        )}
        {isSearchingModeOn && (
          <Box>
            <SearchBar
              value={searchText}
              placeholder="Search"
              onChangeText={setSearchText}
            />
          </Box>
        )}
      </>
    ),
    headerRight: () => (
      <>
        {!isSearchingModeOn && (
          <Box
            paddingRight={16}
            flexDirection="row"
            justifyContent="space-around"
          >
            {isAndroid() && (
              <IconButton
                iconName="androidSearch"
                iconColor="main"
                onPress={() => setIsSearchingModeOn(true)}
              />
            )}
            <IconButton
              iconName={cartNotEmpty ? 'cartFilled' : 'cartEmpty'}
              iconColor="main"
              onPress={openCartMemoized}
            />
          </Box>
        )}
        {isSearchingModeOn && (
          <Box
            paddingRight={16}
            flexDirection="row"
            justifyContent="space-around"
          >
            <IconButton
              iconName="close"
              size={14}
              iconColor="greyLight"
              onPress={() => setIsSearchingModeOn(false)}
            />
          </Box>
        )}
      </>
    ),
  });
  const getIcon = () => {
    if (!isIOS() && !I18nManager.isRTL) {
      return 'androidArrowRight';
    }
    if (!isIOS() && I18nManager.isRTL) {
      return 'androidHeaderArrowLeft';
    }
    if (isIOS() && !I18nManager.isRTL) {
      return 'arrowRight';
    }
    return 'arrowLeft';
  };

  const getSizeIcon = () => {
    if (!isIOS() && I18nManager.isRTL) {
      return 16;
    }
    if (isIOS()) {
      return 40;
    }
    return 24;
  };

  return (
    <CartActionsProvider
      value={{
        addToCart: addToCartMethod,
        increaseQuantity: increaseQuantityMethod,
        decreaseQuantity: decreaseQuantityMethod,
        loading: cartLoading,
      }}
    >
      <Box flex={1} backgroundColor="white">
        {isIOS() && (
          <>
            <Box
              marginTop={6}
              marginLeft={16}
              marginRight={16}
              marginBottom={10}
            >
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search medicine"
              />
            </Box>
            <Box
              opacity={0.3}
              marginBottom={10}
              borderBottomWidth={1}
              borderColor="greyLight"
            />
          </>
        )}
        <Box
          height={36}
          paddingLeft={18}
          paddingRight={6}
          flexDirection="row"
          alignItems="center"
          backgroundColor="white"
          justifyContent="space-between"
        >
          <Box flexDirection="row" alignItems="center">
            <Icon iconName="sort" color="mainBlack" />
            <Box paddingLeft={8}>
              <Text>Sort_by</Text>
            </Box>
          </Box>
          <Box>
            <Pressable
              android_ripple={{ borderless: false }}
              // @ts-ignore
              onPress={() => selectRef?.current?.showSelect()}
            >
              <Box
                height={36}
                paddingLeft={8}
                paddingRight={8}
                alignItems="center"
                flexDirection="row"
              >
                <Box marginRight={isIOS() ? undefined : 8}>
                  <Text
                    fontWeight={600}
                    color="greyDark"
                    fontSize={isAndroid() ? 14 : 15}
                    lineHeight={isAndroid() ? 24 : 15}
                  >
                    {currentOrderType.val}
                  </Text>
                </Box>
                <Icon
                  size={getSizeIcon()}
                  color={isIOS() ? 'greyLight' : 'greyDark'}
                  iconName={getIcon()}
                />
              </Box>
            </Pressable>
          </Box>
        </Box>
        <Box flex={1} backgroundColor="greyBackground">
          {loading && !refreshing ? (
            <Loader />
          ) : (
            <FlatList
              data={medicinesData}
              onRefresh={refetch}
              onEndReached={fetchMore}
              refreshing={refreshing}
              renderItem={renderItem}
              onEndReachedThreshold={0.85}
              keyExtractor={keyExtractor}
              ListEmptyComponent={renderEmptyState}
              initialNumToRender={30}
              contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
            />
          )}
        </Box>
      </Box>
      <Select
        hideInput
        ref={selectRef}
        title="Sort_by"
        items={ordersType}
        iconName="filterOff"
        modalTitle="Sort_by"
        value={currentOrderType}
        componentType="OutLinedButton"
        iconColor={theme.colors.mainBlack}
        borderColor={theme.colors.greyLight}
        type={isIOS() ? 'radio-with-reset' : 'radio'}
        onValueChange={data => setCurrentOrderType(data)}
      />
      {renderCartModal()}
      {renderMedicineDetailsModal()}
    </CartActionsProvider>
  );
};
