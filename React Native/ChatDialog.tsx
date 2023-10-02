import moment from 'moment';
import RNFS from 'react-native-fs';
import { FC, useState, useEffect } from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import BufferLib from 'buffer/';

import {
  isIOS,
  theme,
  useActionSheet,
  useKeyboard,
  useMe,
  IMe,
} from '../../utils';
import { ChatList } from './ChatList';
import { ChatDialogProps } from './helpers';
import { Box, IconButton, SafeAreaView, Text, TextInput } from '../../legos';

export const ChatDialog: FC<ChatDialogProps> = ({
  isVisible,
  onClose,
  chatChannel,
  getMessages,
}) => {
  const { me } = useMe();
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<boolean>(false);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);

  const showActionSheet = useActionSheet();
  const { dismiss, isKeyBoardVisible, height } = useKeyboard();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!isVisible) {
      setFullScreen(false);
    }
  }, [isVisible]);

  const sendMessage = () => {
    if (!message) {
      return;
    }

    setLoadingText(!!chatChannel);
    chatChannel
      ?.sendMessage(message, {
        userId: me?.id,
      })
      .catch(err => console.log('debug > err===', err))
      .finally(() => setLoadingText(false));

    setMessage('');
    dismiss();
  };

  const uploadFile = () => {
    const uploadFileAction = (uri, name, type) => {
      setLoadingMedia(true);
      RNFS.readFile(uri, 'base64')
        .then(data => {
          return chatChannel?.sendMessage(
            {
              contentType: type,
              // @ts-ignore
              media: BufferLib.Buffer.from(data, 'base64'),
            },
            { userId: (me as IMe).id, fileName: name },
          );
        })
        .catch(err => console.log('debug > err===', err))
        .finally(() => setLoadingMedia(false));
    };

    showActionSheet({
      type: 'chatUploadFile',
      cb: buttonIndex => {
        if (buttonIndex === 0 || buttonIndex === 1) {
          const pickerMode = buttonIndex === 0 ? 'openCamera' : 'openPicker';
          ImagePicker[pickerMode]({
            mediaType: 'photo',
          })
            .then(image => {
              uploadFileAction(
                image.path,
                image.filename ??
                  `image-${moment().format('YYYY_MM_DD_hh_mm_ss')}`,
                image.mime,
              );
            })
            .catch(error => {
              console.log('ImagePicker', error);
            });
        } else if (buttonIndex === 2) {
          DocumentPicker.pick({
            type: [
              DocumentPicker.types.images,
              DocumentPicker.types.pdf,
              DocumentPicker.types.xls,
              DocumentPicker.types.xlsx,
              DocumentPicker.types.doc,
              DocumentPicker.types.docx,
              DocumentPicker.types.csv,
            ],
          })
            .then(res =>
              uploadFileAction(
                res.uri,
                res.name ?? `file-${moment().format('YYYY_MM_DD_hh_mm_ss')}`,
                res.type,
              ),
            )
            .catch(error => {
              console.log(error);
            });
        }
      },
    });
  };

  const renderInputContainer = () => (
    <Box
      paddingTop={8}
      paddingLeft={12}
      paddingRight={12}
      borderTopWidth={2}
      flexDirection="row"
      alignItems="center"
      backgroundColor="white"
      borderColor="greyBackground"
      paddingBottom={isKeyBoardVisible && isIOS() ? height : 24}
    >
      <Box marginBottom={isIOS() ? 12 : 0} width={40} alignItems="center">
        {loadingMedia ? (
          <ActivityIndicator color={theme.colors.main} size="small" />
        ) : (
          <IconButton
            iconName="binder"
            onPressIn={dismiss}
            onPress={uploadFile}
            iconColor="greyLight"
          />
        )}
      </Box>

      <Box flex={1}>
        <TextInput
          multiline
          value={message}
          maxLength={2000}
          numberOfLines={2}
          onChangeText={setMessage}
          onFocus={() => setFullScreen(true)}
          placeholder="Type a message here..."
          renderRightAccessory={() => (
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              {loadingText ? (
                <ActivityIndicator color={theme.colors.main} size="small" />
              ) : (
                <IconButton
                  iconName="send"
                  isDisabled={!message}
                  onPress={sendMessage}
                  iconColor="main"
                />
              )}
            </Box>
          )}
        />
      </Box>
    </Box>
  );

  return (
    <SafeAreaView>
      <Modal
        transparent
        visible={isVisible}
        onRequestClose={onClose}
        presentationStyle="formSheet"
      >
        <Box flex={1} flexDirection="column" justifyContent="flex-end">
          <Box
            height={56}
            flexDirection="row"
            alignItems="center"
            borderBottomWidth={1}
            backgroundColor="white"
            justifyContent="flex-start"
            borderColor="greyBackground"
            borderTopLeftRadius={isIOS() ? 8 : 0}
            borderTopRightRadius={isIOS() ? 8 : 0}
          >
            <Box width={40} alignItems="center">
              <IconButton
                size={14}
                iconName="close"
                onPress={onClose}
                iconColor="greyDark"
              />
            </Box>
            <Box
              flex={1}
              flexDirection="row"
              justifyContent={isIOS() ? 'center' : 'flex-start'}
            >
              <Text
                lineHeight={22}
                fontSize={isIOS() ? 17 : 20}
                color="mainBlack"
                fontWeight={isIOS() ? 600 : 500}
              >
                Chat
              </Text>
            </Box>
            <Box width={40} />
          </Box>
          <Box
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(fullScreen ? { flex: 1 } : { height: '50%' })}
            backgroundColor="white"
            paddingLeft={12}
            paddingRight={12}
          >
            <ChatList
              isVisible={isVisible}
              chatChannel={chatChannel}
              getMessages={getMessages}
            />
          </Box>
          {renderInputContainer()}
        </Box>
      </Modal>
    </SafeAreaView>
  );
};
