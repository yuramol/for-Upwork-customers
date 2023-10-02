import { View } from 'react-native';
import { FC, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../Text';
import { CheckBox } from '../CheckBox';
import { FieldError } from '../FieldError';
import { Button } from './../button/Button';
import { CustomInput } from '../CustomInput';
import { GoBackButton } from '../GoBackButton';
import { ShowPassword } from '../ShowPassword';
import { Fields, validationSchema } from './helpers';
import { RootStackListProps, Screens } from '../../navigation/types';

export const LoginForm: FC = () => {
  const navigation = useNavigation<RootStackListProps>();
  const [isCheck, setIsCheck] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleGoToForgotPassword = () => {
    navigation.navigate(Screens.ForgotPassword);
  };

  const onGoBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data: Fields) => {
    console.log(data);
  };

  return (
    <View className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <View className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Text tailwindClassName="block text-sm font-medium text-gray-700">
          Email address
        </Text>
        <View className="mt-1">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                onChangeText={val => onChange(val)}
                onBlur={onBlur}
                value={value}
              />
            )}
            name="email"
            rules={{ required: true }}
          />
          <FieldError error={errors?.email?.message} />
        </View>
        <View className="mt-8">
          <Text tailwindClassName="block text-sm font-medium text-gray-700">
            Password
          </Text>
          <View className="mt-1 relative">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  value={value}
                  onBlur={onBlur}
                  autoCorrect={false}
                  textContentType="password"
                  onChangeText={val => onChange(val)}
                  secureTextEntry={isPasswordVisible ? false : true}
                />
              )}
              name="password"
              rules={{ required: true }}
            />
            <FieldError error={errors?.password?.message} />
            <ShowPassword
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
          </View>
        </View>
        <View className="flex mt-8 items-center justify-between flex-row">
          <View className="flex items-center">
            <CheckBox
              onChange={() => setIsCheck(!isCheck)}
              isCheck={isCheck}
              label="Remember me"
            />
          </View>
          <Button
            type="textButton"
            label="Forgot your password?"
            onPress={handleGoToForgotPassword}
          />
        </View>
        <View className="mt-8">
          <Button
            onPress={handleSubmit(onSubmit)}
            type="textBackgroundButton"
            label="Sign in"
          />
        </View>
        <GoBackButton onPress={onGoBackPress} />
      </View>
    </View>
  );
};
