import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { hideMessage } from 'react-native-flash-message';
import { useSafeArea } from 'react-native-safe-area-context';

import { theme } from 'utils';

const colors = {
  success: theme.palette.highlight,
  info: theme.palette.warning.main,
  error: theme.palette.error.main,
};

const iconColors = {
  success: theme.palette.highlight,
  info: theme.palette.warning.main,
  error: theme.palette.error.main,
};

const iconNames = {
  success: 'check-circle',
  info: 'information',
  error: 'alert',
};

const Container = styled.View`
  position: relative;
  width: 100%;
  height: ${({ hasNotch }) => (hasNotch ? 120 : 70)}px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Bg = styled.View`
  position: absolute;
  left: 37%;
  top: 0;
  background: white;
  width: 25%;
  height: ${({ hasNotch }) => (hasNotch ? 120 : 70)}px;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  transform: scaleX(4.5);
`;

const IconContainer = styled.View`
  margin-right: 7px;
`;

const Message = styled.Text`
  font-size: 16px;
  max-width: 80%;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${({ type }) => colors[type] || 'black'};
`;

const ContainerRectangular = styled(LinearGradient)`
  position: relative;
  width: 100%;
  height: ${({ hasNotch }) => (hasNotch ? 81 : 51)}px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: row;
  ${({ hasNotch }) => (hasNotch ? 'padding-bottom: 10px' : '')};
`;

const MessageRectangular = styled.Text`
  font-size: 14px;
  font-family: Roboto-Medium;
  line-height: 16px;
  color: white;
`;

export const Notification = ({
  message: { message, description, type = '' },
}) => {
  const { top } = useSafeArea();
  const hasNotch = !!top;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        hideMessage();
      }}>
      {type.includes('Rectangular') ? (
        <ContainerRectangular
          hasNotch={hasNotch}
          useAngle
          angle={270}
          angleCenter={{ x: 0.5, y: 0.5 }}
          locations={[0, 104.24]}
          colors={['#6EBF4C', '#78CC54']}>
          <MessageRectangular>{message}</MessageRectangular>
        </ContainerRectangular>
      ) : (
        <Container hasNotch={hasNotch}>
          <Bg hasNotch={hasNotch} type={type} />
          <IconContainer>
            <Icons name={iconNames[type]} size={30} color={iconColors[type]} />
          </IconContainer>
          <Message>{message}</Message>
          {description && <Description type={type}>{description}</Description>}
        </Container>
      )}
    </TouchableWithoutFeedback>
  );
};
