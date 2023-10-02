import { MainLayout, ComponentContainer } from '@/layouts';
import { Button } from '@/legos';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCsrfToken, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().required('Email is required').email('Email must be a valid email'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage({ csrfToken }: { csrfToken: string }) {
  const router = useRouter();
  const onSubmit = async (data: any) => {
    await signIn('credentials', { ...data, csrfToken, redirect: false }).then(res => {
      if (res?.ok) {
        router.push('/admin');
      } else {
        formik.setFieldError('password', 'Invalid email or password');
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <MainLayout>
      <ComponentContainer>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col justify-center items-center gap-6 h-[55vh] ">
            <div className="relative flex flex-col">
              <input
                type="text"
                name="email"
                className="rounded-full w-[300px] px-4 pt-4 pb-[12px] border-[1px] border-gray focus:border-gray focus:outline-none"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div>
                  <div className="text-red-500 absolute text-xs ml-4 mt-1">
                    {formik.errors.email}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                name="password"
                className="rounded-full w-[300px] px-4 pt-4 pb-[12px] border-[1px] border-gray focus:border-gray focus:outline-none"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 absolute text-xs ml-4 mt-1">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <Button
              title="Login"
              color="#404969"
              height="40px"
              width="300px"
              type="submit"
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
      </ComponentContainer>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};
