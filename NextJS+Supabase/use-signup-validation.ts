'use client';

import { useTranslation } from 'next-i18next';
import * as z from 'zod';

import { NAME_REGEX } from '@/constants/constants';
import { getPhoneFromMask } from '@/utils/mask';

import { ESignupFormFields } from '../types';

export const useSignupValidation = () => {
  const { t } = useTranslation();

  const orgNameValidation = z
    .string()
    .min(1, { message: t('errors.organizationNameRequired') })
    .regex(NAME_REGEX, { message: t('errors.organizationNameInvalid') });

  const orgTypeValidation = z
    .string()
    .min(1, { message: t('errors.organizationTypeRequired') });

  const emailValidation = z
    .string()
    .email({ message: t('errors.emailNotValid') });
  const firstNameValidation = z
    .string()
    .min(1, { message: t('errors.firstNameOneCharacter') })
    .regex(NAME_REGEX, { message: t('errors.firstNameInvalid') });

  const lastNameValidation = z
    .string()
    .min(1, { message: t('errors.lastNameOneCharacter') })
    .regex(NAME_REGEX, { message: t('errors.lastNameInvalid') });
  const phoneValidation = z
    .string()
    .optional()
    .refine((value) => !value || /^\d{10}$/.test(getPhoneFromMask(value)), {
      message: t('errors.phoneNotValid')
    });

  const signupValidationSchema = z.object({
    [ESignupFormFields.OrganizationName]: orgNameValidation,
    [ESignupFormFields.OrganizationType]: orgTypeValidation,
    [ESignupFormFields.Email]: emailValidation,
    [ESignupFormFields.FirstName]: firstNameValidation,
    [ESignupFormFields.LastName]: lastNameValidation,
    [ESignupFormFields.Phone]: phoneValidation
  });

  return {
    signupValidationSchema
  };
};
