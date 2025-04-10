'use client';

import * as z from 'zod';

import { CompanyFormFields } from '@/components/company/types';
import { ForgotPasswordFormFields } from '@/components/forgot-password-form/types';
import { InviteFormFields } from '@/components/invites-page/invite-form/types';
import { LoginFormFields } from '@/components/login-form/types';
import { EPasswordFormFields } from '@/components/reset-password-form/types';
import { SignUpFormFields } from '@/components/signup-form/types';
import { ACCEPTED_DOCUMENT_TYPES } from '@/constants/documents';
import { TYPE_OF_BUSINESS } from '@/types/auth';
import { ROLES } from '@/types/roles';
import { getPhoneFromMask } from '@/utils/mask';

export const businessNameValidation = z
  .string({ message: 'Business name is required' })
  .min(1, { message: 'Client business name is required' });
export const clientNameValidation = z
  .string({ message: 'Client name is required' })
  .trim()
  .min(1, { message: 'Client name is required' });
export const teamValidation = z
  .string()
  .array()
  .min(1, 'Team are required at least one team');
export const phoneValidation = z
  .string()
  .min(1, 'Phone number is required') // Ensures the field is not empty
  .refine((value) => /^\d{10}$/.test(getPhoneFromMask(value)), {
    message: 'Phone number is not valid'
  });
export const phoneOptionalValidation = z.string().optional();
// TODO: uncomment this when we have phone validation
// .refine((value) => !value || /^\d{10}$/.test(getPhoneFromMask(value)), {
//   message: 'Phone number is not valid'
// });
export const deliverySpeedValidation = z
  .string()
  .min(1, { message: 'Please select the following options' });
export const pickupDateTypeValidation = z
  .string()
  .min(1, { message: 'Please select the following options' });
export const deliveryDateTypeValidation = z
  .string()
  .min(1, { message: 'Please select the following options' });
export const totalPriceValidation = z
  .string({
    message: 'Please enter total price'
  })
  .min(1, { message: 'Please enter amount' })
  .nullable()
  .optional();

export const carrierPriceValidation = z
  .string({
    message: 'Please enter carrier price'
  })
  .nullable()
  .optional();
export const brokerFeeValidation = z.string({
  message: 'Please enter broker fee'
});

export const untilValidation = z
  .date({
    message: 'Please pick an available date'
  })
  .nullable();

export const availableDateValidation = z
  .date({
    message: 'Please pick an available date'
  })
  .nullable()
  .optional();
export const availableAsStringDateValidation = z
  .union([
    z.date({ message: 'Please pick an available date' }),
    z.string({ message: 'Please pick an available date' })
  ])
  .nullable()
  .optional();

export const vehicleVinNumberValidation = z
  .string()
  .optional()
  .refine((val) => !val || val.length >= 17, {
    message: 'VIN number must have 17 symbols'
  });
export const pickupDateValidation = z
  .date({
    message: 'Please pick an available pick up date'
  })
  .optional();
export const deliveryDateValidation = z
  .date({
    message: 'Please pick an available delivery date'
  })
  .optional();
export const vehicleYearValidation = z.string();
export const vehicleMakeValidation = z.string();
export const vehicleModelValidation = z.string();

export const instructionValidation = z.string().optional();

const DOCUMENT_SCHEMA = z.instanceof(File);
export const documentsValidation = z
  .array(DOCUMENT_SCHEMA)
  .refine(
    (files) =>
      !files.find((file) => !ACCEPTED_DOCUMENT_TYPES.includes(file?.type)),
    {
      message: 'Invalid document file type'
    }
  );

export const routeOriginValidation = z
  .string({ message: 'Route origin is required' })
  .min(1);
export const routeDestinationValidation = z
  .string({ message: 'Route destination is required' })
  .min(1);
export const dispatchersValidation = z
  .string()
  .array()
  .min(1, 'Dispatchers are required at least one');
export const locationCoordinates = z.number().optional();
export const routeDistance = z.string().min(1);
export const requestValidation = z
  .string({ message: 'Request field is required' })
  .min(1);

/* route validations */
export const isTerminalValidation = z.boolean().optional();
export const terminalValidation = z.string().optional();
export const companyNameValidation = z
  .string()
  .min(3, { message: 'Business name must be 3+ characters.' });

export const typeOfBusinessValidation = z
  .string()
  .min(1, { message: 'Type of business is required' });
export const zipValidation = z
  .string()
  .min(5, 'ZIP code must be 5+ characters.')
  .max(10, 'ZIP code must be less than 10 characters')
  .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format');
export const addressValidation = z.string().min(1, 'Address is required');
export const cityValidation = z.string().min(1, 'City is required');
export const stateValidation = z.string().min(1, 'State is required');
export const geoValidation = z.string().optional();

export const useValidation = () => {
  const emailValidation = z.string().email({ message: 'Email is not valid' });
  const passwordValidation = z
    .string()
    .trim()
    .min(8, { message: 'Password must be 8+ characters.' });
  const showPasswordValidation = z.boolean();

  const firstNameValidation = z
    .string()
    .trim()
    .min(1, { message: 'First name must be 1+ characters.' });

  const lastNameValidation = z
    .string()
    .trim()
    .min(1, { message: 'Last name must be 1+ characters.' });

  const roleValidation = z.string().min(1, { message: 'Role is required' });
  const companyNameValidation = z
    .string()
    .min(3, { message: 'Business name must be 3+ characters.' });

  const inviteCompanyValidation = z.string().optional();

  const typeOfBusinessValidation = z
    .string()
    .min(1, { message: 'Type of business is required' });
  const descriptionValidation = z.string().optional();

  const loginValidationSchema = z.object({
    [LoginFormFields.Email]: emailValidation,
    [LoginFormFields.Password]: passwordValidation,
    [LoginFormFields.ShowPassword]: showPasswordValidation
  });

  const signUpValidationSchema = z
    .object({
      [SignUpFormFields.FirstName]: firstNameValidation,
      [SignUpFormFields.LastName]: lastNameValidation,
      [SignUpFormFields.Email]: emailValidation,
      [SignUpFormFields.Phone]: phoneValidation,
      [SignUpFormFields.BusinessName]: companyNameValidation,
      [SignUpFormFields.TypeOfBusiness]: typeOfBusinessValidation,
      [SignUpFormFields.Description]: descriptionValidation
    })
    .refine(
      (data) =>
        !(
          data[SignUpFormFields.TypeOfBusiness] ===
            (TYPE_OF_BUSINESS.OTHER as string) &&
          data[SignUpFormFields.Description]?.length === 0
        ),
      {
        message: 'This field is required',
        path: [SignUpFormFields.Description]
      }
    );

  const forgotPasswordValidationSchema = z.object({
    [ForgotPasswordFormFields.Email]: emailValidation
  });

  const createPasswordValidationSchema = z
    .object({
      [EPasswordFormFields.Password]: passwordValidation,
      [EPasswordFormFields.ConfirmPassword]: z.string(),
      [EPasswordFormFields.ShowPassword]: showPasswordValidation
    })
    .refine(
      (data) =>
        data[EPasswordFormFields.Password] ===
        data[EPasswordFormFields.ConfirmPassword],
      {
        message: 'Passwords must match',
        path: [EPasswordFormFields.ConfirmPassword]
      }
    );

  const resetPasswordValidationSchema = z
    .object({
      [EPasswordFormFields.Password]: passwordValidation,
      [EPasswordFormFields.ConfirmPassword]: z.string(),
      [EPasswordFormFields.ShowPassword]: showPasswordValidation,
      [EPasswordFormFields.Code]: z.string()
    })
    .refine(
      (data) =>
        data[EPasswordFormFields.Password] ===
        data[EPasswordFormFields.ConfirmPassword],
      {
        message: 'Passwords must match',
        path: [EPasswordFormFields.ConfirmPassword]
      }
    );

  const inviteValidationSchema = z
    .object({
      [InviteFormFields.Email]: emailValidation,
      [InviteFormFields.Phone]: phoneValidation,
      [InviteFormFields.FirstName]: firstNameValidation,
      [InviteFormFields.LastName]: lastNameValidation,
      [InviteFormFields.CompanyName]: inviteCompanyValidation,
      [InviteFormFields.Role]: roleValidation
    })
    .refine(
      (data) =>
        (data[InviteFormFields.Role] &&
          data[InviteFormFields.CompanyName]?.length !== 0) ||
        data[InviteFormFields.Role] === (ROLES.super_admin as string) ||
        data[InviteFormFields.Role] === (ROLES.admin as string),
      {
        message: 'Company name is required',
        path: [InviteFormFields.CompanyName]
      }
    );

  const inviteValidationSchemaWithNewCompany = z.object({
    [InviteFormFields.Email]: emailValidation,
    [InviteFormFields.Phone]: phoneValidation,
    [InviteFormFields.FirstName]: firstNameValidation,
    [InviteFormFields.LastName]: lastNameValidation,
    [InviteFormFields.Role]: roleValidation,
    [CompanyFormFields.CompanyName]: z
      .string()
      .min(3, 'Company name is required'),
    [CompanyFormFields.CompanyDescription]: z.string().optional(),
    [CompanyFormFields.CompanyType]: z.string().min(2, 'Type is required'),
    [CompanyFormFields.CompanyPrefixName]: z
      .string()
      .min(2, 'Prefix must be 2-4 characters')
      .max(4, 'Prefix must be 2-4 characters')
      .regex(/^[a-zA-Z]+$/, 'Prefix must contain only alphabet characters')
  });

  return {
    forgotPasswordValidationSchema,
    createPasswordValidationSchema,
    resetPasswordValidationSchema,
    loginValidationSchema,
    signUpValidationSchema,
    inviteValidationSchema,
    inviteValidationSchemaWithNewCompany,
    emailValidation,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
    phoneValidation,
    companyNameValidation,
    typeOfBusinessValidation,
    descriptionValidation
  };
};
