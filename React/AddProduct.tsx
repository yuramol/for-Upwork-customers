import { FC, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';

import { DiscountLabel, Modal, TextField } from '@/legos';
import { AddProductFields, Props } from './types';
import { TextArea } from '@/legos/TextArea';
import { AddEditImage } from '../AddEditImage';

import { ProductsDocument } from '@/graphql/queries/__generated__/products';
import { useCreateProductMutation } from '@/graphql/mutations/__generated__/createProduct';
import { useUpdateProductMutation } from '@/graphql/mutations/__generated__/updateProduct';

export const AddProductForm: FC<Props> = ({ isOpen, toggleForm, product }) => {
  const { query, push } = useRouter();
  const [createProductMutation] = useCreateProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();

  const initialValues = {
    [AddProductFields.SKU]: product?.attributes?.sku ?? '',
    [AddProductFields.Title]: product?.attributes?.title ?? '',
    [AddProductFields.Description]: product?.attributes?.description ?? '',
    [AddProductFields.Discount]: product?.attributes?.discount ?? 0,
    [AddProductFields.PriceOld]: product?.attributes?.priceOld ?? 0,
    [AddProductFields.Price]: product?.attributes?.price ?? 0,
    [AddProductFields.Rating]: product?.attributes?.rating ?? 0,
    [AddProductFields.ImagePreview]: product?.attributes?.imagePreview?.data?.id ?? undefined,
  };

  const validationSchema = yup.object({
    [AddProductFields.SKU]: yup.string().required('Будь ласка, заповніть дане поле'),
    [AddProductFields.Title]: yup.string().required('Будь ласка, заповніть дане поле'),
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: values => {
      if (query.id) {
        updateProductMutation({
          variables: {
            id: query.id as string,
            data: { ...values },
          },
        }).then(() => toggleForm());
      } else {
        createProductMutation({
          variables: {
            ...values,
            productDescriptions: [{ title: 'Варіанти користування' }],
          },
          refetchQueries: [ProductsDocument],
        }).then(({ data }) => {
          setTimeout(() => {
            push(`admin/product/${data?.createProduct?.data?.id}`);
          }, 100);
        });
      }
    },
  });

  const handleToggleForm = () => {
    resetForm();
    toggleForm();
  };

  const setImagePreviewId = (id?: string | null) => {
    setFieldValue(AddProductFields.ImagePreview, id);
  };

  return (
    <Modal isOpen={isOpen} toggleModal={handleToggleForm}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="font-bold text-xl mt-3 sm:mt-0 md:text-3xl ">Додати/редагувати продукт:</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex shrink-0 w-[198px] h-[254px]">
            <AddEditImage
              currentImageID={values[AddProductFields.ImagePreview]}
              handleSetUploadImageId={setImagePreviewId}
            />
            {!!values[AddProductFields.Discount] && (
              <DiscountLabel smallSize discount={values[AddProductFields.Discount]} />
            )}
          </div>
          <div className="flex flex-col gap-5 w-full">
            <TextField
              label="Назва продукту"
              name={AddProductFields.Title}
              value={values[AddProductFields.Title]}
              placeholder="Продукт"
              onChange={handleChange}
              onBlur={handleBlur}
              isError={
                !!errors[AddProductFields.Title] && (touched[AddProductFields.Title] as boolean)
              }
              errorText={errors[AddProductFields.Title] as string}
            />
            <TextField
              label="Артикул продукту"
              name={AddProductFields.SKU}
              value={values[AddProductFields.SKU]}
              placeholder="Артикул"
              onChange={handleChange}
              onBlur={handleBlur}
              isError={!!errors[AddProductFields.SKU] && (touched[AddProductFields.SKU] as boolean)}
              errorText={errors[AddProductFields.SKU] as string}
            />
            <TextField
              label="Ціна"
              type="number"
              name={AddProductFields.PriceOld}
              value={values[AddProductFields.PriceOld]}
              min={0}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              label="Ціна із знижкою"
              type="number"
              name={AddProductFields.Price}
              value={values[AddProductFields.Price]}
              min={0}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <TextField
            label="Знижка"
            type="number"
            name={AddProductFields.Discount}
            value={values[AddProductFields.Discount]}
            min={0}
            max={100}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <TextField
            label="Рейтинг"
            type="number"
            name={AddProductFields.Rating}
            value={values[AddProductFields.Rating]}
            step={0.1}
            min={0}
            max={5}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <TextArea
          label="Опис"
          rows={5}
          name={AddProductFields.Description}
          value={values[AddProductFields.Description]}
          placeholder="Чому це дуже файний продукт"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="flex mt-2 gap-4">
          <button
            type="button"
            onClick={handleToggleForm}
            className="rounded-full border border-[#7613B5] text-base font-semibold p-4 w-full"
          >
            Відмінити
          </button>
          <button
            type="submit"
            className="rounded-full bg-[#7613B5] text-white text-base font-semibold p-4 w-full"
          >
            Додати
          </button>
        </div>
      </form>
    </Modal>
  );
};
