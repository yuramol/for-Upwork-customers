import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, Stack, Typography } from '@mui/material';
import { FormikContext, useFormik } from 'formik';

import { UPDATE_USER_MUTATION } from 'api';
import { AvatarUpload } from 'components';
import { useAuthUser, useNotification, useUser } from 'hooks';
import {
  Button,
  CalendarPickerFormik,
  Icon,
  Input,
  MultipleSelect,
  Select,
} from 'legos';
import {
  formatUserFullName,
  formikPropsErrors,
  getFormattedDate,
} from 'helpers';
import { validationSchema } from './helpers';
import { ProfileFields, ProfileInitialValues } from './types';
import { useChangeAvatar } from './useChangeAvatar';
import { employeePositionChoices, UserPosition } from 'constant';
import { Scalars } from 'types/GraphqlTypes';

type Props = {
  id: Scalars['ID'];
  enableEdit?: boolean;
};

export const ProfileEditView = ({ id, enableEdit }: Props) => {
  const { userData } = useUser(id);
  const { user, isManager } = useAuthUser();
  const [isEdit, setIsEdit] = useState(false);
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const showNotification = useNotification();
  const handleChangeAvatar = useChangeAvatar();

  useEffect(() => {
    setIsEdit(enableEdit ?? false);
  }, [enableEdit]);

  const initialValues: ProfileInitialValues = {
    [ProfileFields.UserName]: userData?.username ?? '',
    [ProfileFields.FirstName]: userData?.firstName ?? '',
    [ProfileFields.LastName]: userData?.lastName ?? '',
    [ProfileFields.Positions]: userData?.positions ?? [UserPosition.Developer],
    [ProfileFields.Email]: userData?.email ?? '',
    [ProfileFields.LinkedIn]: userData?.linkedIn ?? '',
    [ProfileFields.UpWork]: userData?.upwork ?? '',
    [ProfileFields.Phone]: userData?.phone ?? '',
    [ProfileFields.DateEmployment]: new Date(
      userData?.dateEmployment ?? getFormattedDate(new Date())
    ),
    [ProfileFields.SalaryInfo]: userData?.salaryInfo ?? '',
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        [ProfileFields.DateEmployment]: getFormattedDate(
          values[ProfileFields.DateEmployment]
        ),
      };

      updateUserMutation({ variables: { id, data } })
        .then(() => {
          showNotification({
            message: 'Changes are saved!',
            variant: 'success',
          });

          setIsEdit(!isEdit);
        })
        .catch((error) => {
          showNotification({ error });
        });
    },
  });

  const canEdit = id === user.id || isManager;
  const isDisabled = isManager ? !isEdit : !isManager;
  const {
    values,
    errors,
    touched,
    resetForm,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  return (
    <FormikContext.Provider value={formik}>
      <Stack component="form" gap={10} onSubmit={handleSubmit}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h1">
            {formatUserFullName(userData?.firstName, userData?.lastName)}
          </Typography>
          {canEdit && (
            <Stack direction="row" gap={2}>
              {!isEdit && (
                <Button
                  title="Edit"
                  variant="outlined"
                  type="button"
                  onClick={() => setIsEdit(!isEdit)}
                  icon="edit"
                />
              )}
              {isEdit && (
                <>
                  <Button
                    title="cancel"
                    variant="outlined"
                    type="button"
                    onClick={() => {
                      setIsEdit(!isEdit);
                      resetForm();
                    }}
                  />
                  <Button title="Save" variant="contained" type="submit" />
                </>
              )}
            </Stack>
          )}
        </Stack>
        <Stack flexDirection="row" gap={8}>
          <AvatarUpload
            canEdit={canEdit}
            firstName={values[ProfileFields.FirstName]}
            lastName={values[ProfileFields.LastName]}
            avatar={userData?.avatar?.data?.attributes?.url}
            onChange={(event) =>
              handleChangeAvatar({
                event,
                userId: id,
                avatarId: userData?.avatar?.data?.id,
                updateUserMutation,
              })
            }
          />
          <Stack gap={4}>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="person" />
              <Stack flexGrow="1">
                <Input
                  variant="standard"
                  placeholder="First name"
                  label={isEdit ? 'First name' : null}
                  name={ProfileFields.FirstName}
                  value={values[ProfileFields.FirstName]}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                  helperText={
                    touched[ProfileFields.FirstName] &&
                    errors[ProfileFields.FirstName]
                  }
                  error={
                    !!(
                      touched[ProfileFields.FirstName] &&
                      errors[ProfileFields.FirstName]
                    )
                  }
                />
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="personOutline" />
              <Stack flexGrow="1">
                <Input
                  variant="standard"
                  placeholder="Last name"
                  label={isEdit ? 'Last name' : null}
                  name={ProfileFields.LastName}
                  value={values[ProfileFields.LastName]}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                  helperText={
                    touched[ProfileFields.LastName] &&
                    errors[ProfileFields.LastName]
                  }
                  error={
                    !!(
                      touched[ProfileFields.LastName] &&
                      errors[ProfileFields.LastName]
                    )
                  }
                />
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="work" />
              <Stack flexGrow="1">
                {isEdit ? (
                  <MultipleSelect
                    label="Position"
                    variant="outlined"
                    disabled={isDisabled}
                    readOnly={isDisabled}
                    items={employeePositionChoices}
                    name={ProfileFields.Positions}
                    handleClear={() => {
                      setFieldValue(`${ProfileFields.Positions}`, []);
                    }}
                    handleClearItem={(item: string) =>
                      setFieldValue(
                        `${ProfileFields.Positions}`,
                        values[ProfileFields.Positions].filter(
                          (value) => value !== item
                        )
                      )
                    }
                    value={values[ProfileFields.Positions]}
                    onChange={handleChange}
                    {...formikPropsErrors(ProfileFields.Positions, formik)}
                  />
                ) : (
                  <Select
                    label={null}
                    name={ProfileFields.Positions}
                    value={values[ProfileFields.Positions]}
                    items={employeePositionChoices}
                    multiple
                    IconComponent={() => null}
                    disabled={isDisabled}
                    readOnly={isDisabled}
                    disableUnderline={isDisabled}
                    onChange={handleChange}
                  />
                )}
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="email" />
              <Stack flexGrow="1">
                {!isEdit && !!values[ProfileFields.Email] ? (
                  <Link
                    href={`mailto: ${values[ProfileFields.Email]}`}
                    underline="none"
                  >
                    Send Email ({values[ProfileFields.Email]})
                  </Link>
                ) : (
                  <Input
                    variant="standard"
                    type="email"
                    placeholder="Email"
                    label={isEdit ? 'Email' : null}
                    name={ProfileFields.Email}
                    value={values[ProfileFields.Email]}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: !isEdit,
                      disableUnderline: !isEdit,
                    }}
                    helperText={
                      touched[ProfileFields.Email] &&
                      errors[ProfileFields.Email]
                    }
                    error={
                      !!(
                        touched[ProfileFields.Email] &&
                        errors[ProfileFields.Email]
                      )
                    }
                  />
                )}
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="link" />
              <Stack flexGrow="1">
                {!isEdit && !!values[ProfileFields.LinkedIn] ? (
                  <Link
                    href={values[ProfileFields.LinkedIn]}
                    underline="none"
                    target="_blank"
                  >
                    View profile LinkedIn
                  </Link>
                ) : (
                  <Input
                    variant="standard"
                    placeholder="LinkedIn"
                    label={isEdit ? 'LinkedIn' : null}
                    name={ProfileFields.LinkedIn}
                    value={values[ProfileFields.LinkedIn]}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: !isEdit,
                      disableUnderline: !isEdit,
                    }}
                    helperText={
                      touched[ProfileFields.LinkedIn] &&
                      errors[ProfileFields.LinkedIn]
                    }
                    error={
                      !!(
                        touched[ProfileFields.LinkedIn] &&
                        errors[ProfileFields.LinkedIn]
                      )
                    }
                  />
                )}
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="upWork" />
              <Stack flexGrow="1">
                {!isEdit && !!values[ProfileFields.UpWork] ? (
                  <Link
                    href={values[ProfileFields.UpWork]}
                    underline="none"
                    target="_blank"
                  >
                    View profile UpWork
                  </Link>
                ) : (
                  <Input
                    variant="standard"
                    placeholder="UpWork"
                    label={isEdit ? 'UpWork' : null}
                    name={ProfileFields.UpWork}
                    value={values[ProfileFields.UpWork]}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: !isEdit,
                      disableUnderline: !isEdit,
                    }}
                    helperText={
                      touched[ProfileFields.UpWork] &&
                      errors[ProfileFields.UpWork]
                    }
                    error={
                      !!(
                        touched[ProfileFields.UpWork] &&
                        errors[ProfileFields.UpWork]
                      )
                    }
                  />
                )}
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="phone" />
              <Stack flexGrow="1">
                {!isEdit && !!values[ProfileFields.Phone] ? (
                  <Link
                    href={`tel: ${values[ProfileFields.Phone]}`}
                    underline="none"
                  >
                    Call ({values[ProfileFields.Phone]})
                  </Link>
                ) : (
                  <Input
                    variant="standard"
                    placeholder="Phone"
                    label={isEdit ? 'Phone' : null}
                    name={ProfileFields.Phone}
                    value={values[ProfileFields.Phone]}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: !isEdit,
                      disableUnderline: !isEdit,
                    }}
                    helperText={
                      touched[ProfileFields.Phone] &&
                      errors[ProfileFields.Phone]
                    }
                    error={
                      !!(
                        touched[ProfileFields.Phone] &&
                        errors[ProfileFields.Phone]
                      )
                    }
                  />
                )}
              </Stack>
            </Stack>
            <Stack flexDirection="row" alignItems="center" gap={3}>
              <Icon icon="calendarMonth" />
              <Stack flexGrow="1">
                <CalendarPickerFormik
                  label={isEdit ? 'Date of employment' : null}
                  variant="standard"
                  field={ProfileFields.DateEmployment}
                  readOnly={!isEdit}
                  InputProps={{
                    disableUnderline: !isEdit,
                  }}
                />
              </Stack>
            </Stack>
            {canEdit && (
              <Stack flexDirection="row" alignItems="center" gap={3}>
                <Icon icon="money" />
                <Stack flexGrow="1">
                  <Input
                    variant="standard"
                    placeholder="Salary Info"
                    label={isEdit ? 'Salary Info' : null}
                    name={ProfileFields.SalaryInfo}
                    value={values[ProfileFields.SalaryInfo]}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: isDisabled,
                      disableUnderline: isDisabled,
                    }}
                    helperText={
                      touched[ProfileFields.SalaryInfo] &&
                      errors[ProfileFields.SalaryInfo]
                    }
                    error={
                      !!(
                        touched[ProfileFields.SalaryInfo] &&
                        errors[ProfileFields.SalaryInfo]
                      )
                    }
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormikContext.Provider>
  );
};
