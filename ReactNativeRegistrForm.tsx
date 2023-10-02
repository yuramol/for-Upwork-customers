import { View } from 'react-native';
import { FC, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

import { Text } from '../Text';
import { Button } from '../button/Button';
import { FieldError } from '../FieldError';
import { CustomInput } from '../CustomInput';
import { GoBackButton } from '../GoBackButton';
import { ShowPassword } from '../ShowPassword';
import { Fields, validationSchema } from './helpers';
import { RootStackListProps } from '../../navigation/types';

export const RegistationForm: FC = () => {
  const navigation = useNavigation<RootStackListProps>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({ resolver: yupResolver(validationSchema) });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const onGoBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = (data: Fields) => {
    console.log(data);
  };

  return (
    <View className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <View className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <Text tailwindClassName="block text-sm font-medium text-gray-700">
          Username
        </Text>
        <Text tailwindClassName="text-xs text-gray-500">
          If you post to this site, this is what will show.
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
            name="name"
            rules={{ required: true }}
          />
          <FieldError error={errors?.name?.message} />
        </View>
        <View className="mt-1">
          <Text tailwindClassName="block text-sm font-medium text-gray-700">
            Email address
          </Text>
          <View className="mt-2">
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
        </View>

        <View className="mt-1">
          <Text tailwindClassName="block text-sm font-medium text-gray-700">
            <Text>Password</Text>
          </Text>
          <Text tailwindClassName="text-xs text-gray-500">
            Must be at least 8 characters.
          </Text>
          <View className="relative mt-2">
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
        <View className="mt-1">
          <Text tailwindClassName="block text-sm font-medium text-gray-700">
            <Text>Password Confirmation</Text>
          </Text>

          <View className="relative mt-2">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  value={value}
                  onBlur={onBlur}
                  autoCorrect={false}
                  textContentType="password"
                  onChangeText={val => onChange(val)}
                  secureTextEntry={isConfirmPasswordVisible ? false : true}
                />
              )}
              name="password_confirmation"
              rules={{ required: true }}
            />
            <FieldError error={errors?.password_confirmation?.message} />
            <ShowPassword
              isPasswordVisible={isConfirmPasswordVisible}
              setIsPasswordVisible={setIsConfirmPasswordVisible}
            />
          </View>
        </View>
        <View className="mt-8">
          <Button
            onPress={handleSubmit(onSubmit)}
            type="textBackgroundButton"
            label="Sign up"
          />
        </View>
        <GoBackButton onPress={onGoBackPress} />
      </View>
    </View>
  );
};
