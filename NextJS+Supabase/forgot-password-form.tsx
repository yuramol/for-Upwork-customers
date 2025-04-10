'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { ROUTES } from '@/constants/routes';
import { useValidation } from '@/hooks/use-validation';
import { createBrowserClient } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@ui/button';
import { Field } from '@ui/field';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@ui/form';
import { Icon } from '@ui/icon';
import { NextLink } from '@ui/next-link';
import { Typography } from '@ui/typography';

import { ForgotPasswordFormFields } from './types';

interface IFormData {
  [ForgotPasswordFormFields.Email]: string;
}

const supabase = createBrowserClient();

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const { forgotPasswordValidationSchema } = useValidation();

  const [loading, startTransition] = useTransition();
  const [resetSuccess, setResetSuccess] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordValidationSchema>>({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit({
    email
  }: z.infer<typeof forgotPasswordValidationSchema>) {
    startTransition(async () => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}${ROUTES.RESET_PASSWORD}`
        });

        if (error) {
          toast.error(error?.message || 'Something went wrong');
          return;
        }

        setResetSuccess(true);
        toast.success('Check your email for further instructions');
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      }
    });
  }

  return (
    <div className='mx-auto flex w-full max-w-[537px] flex-col items-center md:m-auto'>
      <div className='mb-8 flex flex-col items-center gap-2.5 text-center'>
        <Typography variant='h2' className='font-bold text-blue'>
          Reset password
        </Typography>
        {resetSuccess ? (
          <Typography variant='body2'>
            We have sent an email to{' '}
            <span className='font-semibold text-blue'>
              {form.getValues('email') as string}
            </span>{' '}
            with instructions to reset your password.
          </Typography>
        ) : (
          <Typography variant='body2'>
            We will email you a link to reset your password.
          </Typography>
        )}
      </div>
      {!resetSuccess ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
            <FormField
              control={form.control}
              name={ForgotPasswordFormFields.Email}
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  IFormData,
                  typeof ForgotPasswordFormFields.Email
                >;
              }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Field {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={loading}
              type='submit'
              loading={loading}
              variant='primary'
              size='medium'
              fullWidth
              className='mb-8'
            >
              <Typography variant='h6'>Next</Typography>
              <Icon icon='ArrowRight' stroke='#fff' />
            </Button>

            <div className='flex items-center justify-center gap-1'>
              <Typography className='font-medium' variant='h6'>
                Don’t have an account?
              </Typography>
              <NextLink href={ROUTES.REGISTRATION}>Sign up</NextLink>
            </div>
          </form>
        </Form>
      ) : (
        <Button
          variant='primary'
          fullWidth
          size='medium'
          className='mb-8'
          onClick={() => router.push(ROUTES.SIGN_IN)}
        >
          <Typography variant='body1'>Back to Log In</Typography>
        </Button>
      )}
    </div>
  );
};
