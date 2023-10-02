import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { useFormik, FormikContext } from 'formik';
import * as yup from 'yup';

import { CalendarPickerFormik, MultipleSelect, Select } from 'legos';
import { formikPropsErrors, getFormattedDate } from 'helpers';
import { CREATE_USER_MUTATION } from 'api';
import { CreateUserFields, UserProps } from './types';
import { useNotification, useRoles } from 'hooks';
import { employeePositionChoices, Role } from 'constant';

export const NewUser: React.FC<UserProps> = ({ onToggleForm }) => {
  const { roles, rolesChoices } = useRoles();
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const showNotification = useNotification();

  const initialValues = {
    [CreateUserFields.Role]: '',
    [CreateUserFields.FirstName]: '',
    [CreateUserFields.LastName]: '',
    [CreateUserFields.Email]: '',
    [CreateUserFields.DateEmployment]: new Date(),
    [CreateUserFields.Positions]: [],
    [CreateUserFields.Phone]: '',
    [CreateUserFields.Password]: '',
    [CreateUserFields.UserName]: '',
    [CreateUserFields.Confirmed]: true,
  };

  const validationSchema = yup.object({
    [CreateUserFields.FirstName]: yup.string().required('Should not be empty'),
    [CreateUserFields.LastName]: yup.string().required('Should not be empty'),
    [CreateUserFields.UserName]: yup.string().required('Should not be empty'),
    [CreateUserFields.Password]: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Should not be empty'),
    [CreateUserFields.Positions]: yup.array().min(1, 'Minimum one employee'),
    [CreateUserFields.Role]: yup.string().required('Should not be empty'),
    [CreateUserFields.Phone]: yup
      .string()
      .required('Should not be empty')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Phone must be at least 10 characters'),
    [CreateUserFields.Email]: yup
      .string()
      .email('Please enter a valid e-mail address')
      .required('Should not be empty'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        [CreateUserFields.DateEmployment]: getFormattedDate(
          values[CreateUserFields.DateEmployment]
        ),
      };

      createUser({ variables: { data } })
        .then(() => {
          showNotification({
            message: 'User created!',
            variant: 'success',
          });
          onToggleForm();
        })
        .catch((error) => {
          showNotification({ error });
        });
    },
  });

  const { values, setFieldValue, handleChange, handleSubmit } = formik;

  useEffect(() => {
    setFieldValue(
      CreateUserFields.Role,
      (roles?.find(({ attributes }) => attributes?.type === Role.Employee)
        ?.id as string) ?? ''
    );
  }, [roles]);

  return (
    <FormikContext.Provider value={formik}>
      <Stack component="form" onSubmit={handleSubmit} gap={4}>
        <Typography variant="h3" mb={3}>
          Add new user
        </Typography>
        <Stack direction="row" gap={3}>
          <TextField
            fullWidth
            label="User name"
            name={CreateUserFields.UserName}
            value={values[CreateUserFields.UserName]}
            {...formikPropsErrors(CreateUserFields.UserName, formik)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name={CreateUserFields.Password}
            value={values[CreateUserFields.Password]}
            {...formikPropsErrors(CreateUserFields.Password, formik)}
            onChange={handleChange}
          />
        </Stack>
        <Stack direction="row" gap={3}>
          <TextField
            fullWidth
            label="First name"
            name={CreateUserFields.FirstName}
            value={values[CreateUserFields.FirstName]}
            {...formikPropsErrors(CreateUserFields.FirstName, formik)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Last name"
            name={CreateUserFields.LastName}
            value={values[CreateUserFields.LastName]}
            {...formikPropsErrors(CreateUserFields.LastName, formik)}
            onChange={handleChange}
          />
        </Stack>
        <Stack direction="row" gap={3}>
          <TextField
            fullWidth
            label="Email"
            name={CreateUserFields.Email}
            value={values[CreateUserFields.Email]}
            {...formikPropsErrors(CreateUserFields.Email, formik)}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Phone"
            name={CreateUserFields.Phone}
            value={values[CreateUserFields.Phone]}
            {...formikPropsErrors(CreateUserFields.Phone, formik)}
            onChange={handleChange}
          />
        </Stack>
        <Stack direction="row" gap={3}>
          <Select
            label="Role"
            items={rolesChoices}
            value={values[CreateUserFields.Role]}
            name={CreateUserFields.Role}
            {...formikPropsErrors(CreateUserFields.Role, formik)}
            variant="outlined"
            onChange={handleChange}
          />
          <MultipleSelect
            label="Position"
            variant="outlined"
            items={employeePositionChoices}
            name={CreateUserFields.Positions}
            handleClear={() => {
              setFieldValue(`${CreateUserFields.Positions}`, []);
            }}
            handleClearItem={(item: string) =>
              setFieldValue(
                `${CreateUserFields.Positions}`,
                values[CreateUserFields.Positions].filter(
                  (value) => value !== item
                )
              )
            }
            value={values[CreateUserFields.Positions]}
            onChange={handleChange}
            {...formikPropsErrors(CreateUserFields.Positions, formik)}
          />
          <CalendarPickerFormik
            label="Date Employment"
            field={CreateUserFields.DateEmployment}
            disableFuture
            views={['day']}
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-end" gap={2} mt={1}>
          <Button variant="outlined" onClick={onToggleForm}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Stack>
      </Stack>
    </FormikContext.Provider>
  );
};
