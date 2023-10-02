import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { Modal } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

import {
  Box,
  Text,
  Pressable,
  TextButton,
  FilledButton,
  SafeAreaView,
} from '../../legos';
import { isAndroid, isIOS, theme } from '../../utils';
import { CalendarModalProps } from './helpers';

const maxNextMonths = 1;

export const CalendarModal: FC<CalendarModalProps> = ({
  onDone,
  onClose,
  isVisible,
  selectedDate,
  availableDates,
}) => {
  const [innerSelectedDate, setInnerSelectedDate] = useState(selectedDate);

  useEffect(() => {
    setInnerSelectedDate(selectedDate);
  }, [selectedDate, isVisible]);

  const customDayHeaderStylesCallback = () => ({
    textStyle: {
      fontSize: 16,
      color: 'black',
      lineHeight: 19,
    },
  });

  return (
    <Modal
      transparent
      visible={isVisible}
      statusBarTranslucent
      animationType={isIOS() ? 'slide' : 'fade'}
      presentationStyle="overFullScreen"
    >
      <Box
        flex={1}
        justifyContent="center"
        paddingLeft={isAndroid() ? 16 : 0}
        paddingRight={isAndroid() ? 16 : 0}
        backgroundColor={isAndroid() ? 'rgba(0,0,0,0.4)' : 'transparent'}
      >
        {isIOS() && (
          <Pressable
            onPress={onClose}
            removeClippedSubviews
            android_ripple={{
              borderless: false,
              radius: 0,
            }}
          />
        )}

        <Box
          zIndex={2}
          height={380}
          flexDirection="column"
          backgroundColor="white"
          justifyContent="flex-start"
        >
          <Box backgroundColor="white">
            {isIOS() ? (
              <Box
                height={50}
                paddingTop={9}
                paddingBottom={9}
                paddingRight={13}
                borderTopWidth={1}
                flexDirection="row"
                alignItems="center"
                borderBottomWidth={1}
                justifyContent="flex-end"
                borderColor={theme.colors.greyBackground5}
              >
                <FilledButton
                  width={80}
                  height={32}
                  label="Done"
                  onPress={() => onDone(innerSelectedDate)}
                />
              </Box>
            ) : (
              <Box
                height={52}
                paddingTop={9}
                paddingBottom={9}
                paddingRight={13}
                flexDirection="row"
                alignItems="center"
                // borderBottomWidth={1}
                justifyContent="center"
                borderColor={theme.colors.greyBackground5}
              >
                <Text
                  fontSize={20}
                  lineHeight={28}
                  fontWeight={500}
                  color={theme.colors.mainBlack}
                >
                  Choose a date of appointment
                </Text>
              </Box>
            )}
            <CalendarPicker
              minDate={moment()}
              restrictMonthNavigation
              initialDate={innerSelectedDate}
              onDateChange={setInnerSelectedDate}
              selectedStartDate={innerSelectedDate}
              maxDate={moment().add(maxNextMonths, 'month').endOf('month')}
              scaleFactor={isIOS() ? 375 : 420}
              selectedDayStyle={{
                backgroundColor: theme.colors.main,
                color: 'red',
              }}
              selectedDayTextColor="white"
              selectedDayTextStyle={{
                fontWeight: 'bold',
              }}
              customDayHeaderStyles={customDayHeaderStylesCallback}
              dayLabelsWrapper={{
                borderColor: 'transparent',
              }}
              headerWrapperStyle={{
                height: 50,
                borderColor: isIOS()
                  ? theme.colors.greyBackground5
                  : 'transparent',
                alignItems: 'center',
                borderBottomWidth: 1,
                paddingLeft: isIOS() ? 16 : 32,
                paddingRight: isIOS() ? 16 : 32,
              }}
              monthTitleStyle={{
                fontSize: 16,
                lineHeight: 19,
                fontWeight: '600',
                color: theme.colors.mainBlack,
              }}
              yearTitleStyle={{
                fontSize: 16,
                lineHeight: 19,
                fontWeight: '600',
                color: theme.colors.mainBlack,
              }}
              nextTitleStile={{
                fontSize: 16,
                lineHeight: 19,
                fontWeight: '600',
                color: theme.colors.mainBlack,
              }}
              previousTitleStyle={{
                lineHeight: 19,
                fontWeight: '600',
                fontSize: isIOS() ? 16 : 22,
                color: theme.colors.mainBlack,
              }}
              todayBackgroundColor="transparent"
              todayTextStyle={{ fontWeight: 'bold' }}
              // showDayStragglers
              previousTitle="<"
              nextTitle=">"
              disabledDates={date =>
                !availableDates.some(ad => ad.isSame(date, 'day'))
              }
            />
          </Box>
        </Box>
        {isAndroid() && (
          <Box
            height={50}
            paddingTop={9}
            paddingBottom={9}
            paddingRight={13}
            flexDirection="row"
            alignItems="center"
            backgroundColor="white"
            justifyContent="flex-end"
            borderColor={theme.colors.greyBackground5}
            borderTopWidth={1}
          >
            <TextButton
              width={80}
              height={32}
              label="Cancel"
              onPress={onClose}
              labelFontSize={14}
              labelLineHeight={17}
              labelFontWeight={500}
              labelColor={theme.colors.textDimmed}
            />
            <TextButton
              width={80}
              height={32}
              label="APPLY"
              labelFontSize={14}
              labelLineHeight={17}
              labelFontWeight={500}
              onPress={() => onDone(innerSelectedDate)}
            />
          </Box>
        )}
        <SafeAreaView />
      </Box>
    </Modal>
  );
};
