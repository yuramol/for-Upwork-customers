import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { getBusinesses } from './helpers';
import { colors, isIOS } from '../../utils';
import { Business } from '../../types/businesses';
import { BusinessCard } from '../../legos/BusinessCard';
import { InfiniteScrollLoader, NoContentNotice } from '../../legos';

export const BusinessesScreen = () => {
  const { data, isFetchingNextPage, isLoading, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ['businesses'],
      queryFn: ({ pageParam = 1 }) => getBusinesses({ page: pageParam }),
      getNextPageParam: ({ meta }) => {
        const { currentPage, lastPage } = meta;
        if (currentPage === lastPage) {
          return undefined;
        } else {
          return currentPage + 1;
        }
      },
      getPreviousPageParam: ({ meta }) => {
        const { currentPage } = meta;
        if (currentPage === 1) {
          return undefined;
        } else {
          return currentPage + 1;
        }
      },
    });

  const listOfBusinesses = useMemo(
    () =>
      data?.pages.reduce(
        (accumulator, currentValue) => [...currentValue.data, ...accumulator],
        [],
      ),
    [data],
  );

  return (
    <>
      {isLoading && !listOfBusinesses ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator
            size="small"
            color={isIOS() ? undefined : colors['blue-600']}
          />
        </View>
      ) : (
        <FlatList<Business>
          onRefresh={refetch}
          data={listOfBusinesses}
          refreshing={isLoading}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.85}
          ListFooterComponent={
            <InfiniteScrollLoader isShown={isFetchingNextPage} />
          }
          className="px-4 bg-slate-100"
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item }) => <BusinessCard key={item.id} {...item} />}
          ListEmptyComponent={<NoContentNotice message="No businesses found" />}
        />
      )}
    </>
  );
};
