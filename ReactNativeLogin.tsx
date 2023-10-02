import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { LoginForm, Button, Text, VersionNumber } from '../../legos';
import { Screens, RootStackListProps } from '../../navigation/types';

export const LoginScreen = () => {
  const navigation = useNavigation<RootStackListProps>();
  const handleGoToRegister = () => {
    navigation.navigate(Screens.Register);
  };
  return (
    <View className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <View className="sm:mx-auto sm:w-full sm:max-w-md ">
        <Text tailwindClassName="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Login
        </Text>
        <View className="mt-2 text-center justify-center flex-row text-sm text-gray-600">
          <Text>Or&#32;</Text>
          <Button
            type="textButton"
            label="register"
            onPress={handleGoToRegister}
          />
          <Text>&#32;if you don&apos;t have an account</Text>
        </View>
        <LoginForm />
      </View>
      <VersionNumber />
    </View>
  );
};
