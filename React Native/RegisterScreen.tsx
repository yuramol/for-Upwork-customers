import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { RegistationForm, Button, Text } from '../../legos';
import { RootStackListProps, Screens } from '../../navigation/types';

export const RegisterScreen = () => {
  const navigation = useNavigation<RootStackListProps>();

  const handleGoToLogin = () => {
    navigation.navigate(Screens.Login);
  };

  return (
    <View className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <View className="sm:mx-auto sm:w-full sm:max-w-md ">
        <Text tailwindClassName="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </Text>
        <View className="mt-2 text-center justify-center flex-row text-sm text-gray-600">
          <Text>Or&#32;</Text>
          <Button type="textButton" label="log in" onPress={handleGoToLogin} />
          <Text>&#32;if you already have an account</Text>
        </View>
        <RegistationForm />
      </View>
    </View>
  );
};
