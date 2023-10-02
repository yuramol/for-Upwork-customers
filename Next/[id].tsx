import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import dynamic from 'next/dynamic';
import * as fbq from '../../lib/fpixel';

import {
  CountdownTimer,
  OrderForm,
  ProductCharacteristicItem,
  ProductOptionCard,
  Reviews,
} from '@/components';
import { ComponentContainer, MainLayout } from '@/layouts';
import { DiscountLabel, Icon, IconButton, Rate } from '@/legos';

import { useProductQuery } from '@/graphql/queries/__generated__/product';

import productImage21 from '../../assets/rectangle-21.png';
import productImage from '../../assets/rectangle-25.png';
import review from '../../assets/review.png';
import { ProductEntity, UploadFile } from '@/__generated__/types';

export default function Product() {
  const { query, isReady } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useProductQuery({
    variables: {
      id: query.id as string,
    },
    skip: !isReady,
    fetchPolicy: 'network-only',
  });

  const product = data?.product?.data;

  const toggleOrderForm = () => {
    setIsOpen(isOpen => !isOpen);
  };

  useEffect(() => {
    if (data) {
      fbq.event('PageView');
    }
  }, [data]);

  const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

  if (!data) {
    return null;
  }

  return (
    <MainLayout>
      <ComponentContainer>
        <section className="relative grid md:grid-cols-2 gap-11 items-center mt-4 md:mt-20 before:w-[400px] before:740px400px] before:absolute before:-top-20 before:-left-44 before:bg-radial-gradient-purple before:opacity-10 before:-z-10 after:w-[400px] after:h-[400px] after:absolute after:-bottom-20 after:-right-44 after:bg-radial-gradient-purple after:opacity-10 after:-z-10">
          <div className="flex flex-col gap-4 md:gap-8">
            <h1 className="font-bold text-2xl md:text-5xl break-words max-w-[100%]">
              {product?.attributes?.title}
            </h1>
            <p className="text-sm md:text-lg">{product?.attributes?.description}</p>
            {product?.attributes?.imagePreview?.data?.attributes?.url && (
              <div className="relative flex md:hidden overflow-hidden rounded-2xl">
                {product?.attributes?.discount ? (
                  <DiscountLabel discount={product.attributes.discount} />
                ) : null}
                <Image
                  alt={
                    product.attributes.imagePreview.data?.attributes?.alternativeText ??
                    product.attributes.title ??
                    'Фото продукту'
                  }
                  src={
                    process.env.BASE_API_URL + product.attributes.imagePreview.data?.attributes?.url
                  }
                  width={product.attributes.imagePreview.data?.attributes?.width as number}
                  height={product.attributes.imagePreview.data?.attributes?.height as number}
                  priority
                />
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                <p className="text-[#F6543E] font-bold text-4xl">
                  🔥 {product?.attributes?.price?.toFixed(0)} грн
                </p>
                <p className="text-[#828282] line-through">
                  {product?.attributes?.priceOld?.toFixed(0)} грн
                </p>
              </div>
              <Rate rate={product?.attributes?.rating ?? 4.8} />
            </div>
            <CountdownTimer />
            <button
              onClick={toggleOrderForm}
              className="flex justify-center items-center rounded-full bg-[#7613B5] text-white text-base font-semibold p-4 w-full md:w-80"
            >
              Замовити зараз
            </button>
          </div>
          {product?.attributes?.imagePreview?.data?.attributes?.url && (
            <div className="relative hidden md:flex overflow-hidden rounded-2xl">
              {product?.attributes?.discount ? (
                <DiscountLabel discount={product.attributes.discount} />
              ) : null}
              <Image
                alt={
                  product.attributes.imagePreview.data?.attributes?.alternativeText ??
                  product.attributes.title ??
                  'Фото продукту'
                }
                src={
                  process.env.BASE_API_URL + product.attributes.imagePreview.data?.attributes?.url
                }
                width={product.attributes.imagePreview.data?.attributes?.width as number}
                height={product.attributes.imagePreview.data?.attributes?.height as number}
                priority
              />
            </div>
          )}
        </section>

        <section className="grid md:grid-cols-2 gap-8 mt-8 md:gap-11 md:mt-20">
          <div className="rounded-2xl p-6 sm:p-8 bg-[#F4F3FD] ">
            <h2 className="font-bold text-2xl md:text-5xl">Характеристики</h2>
            {!!product?.attributes?.productTableDescriptions?.length && (
              <dl className="mt-4 sm:mt-7">
                {product?.attributes?.productTableDescriptions?.map(
                  item =>
                    item?.text && (
                      <ProductCharacteristicItem
                        key={item.id}
                        title={item.text}
                        value={item.value}
                      />
                    ),
                )}
              </dl>
            )}
          </div>
          {product?.attributes?.video && (
            <div className="w-full min-h-[450px] h-full">
              <ReactPlayer url={product?.attributes?.video} controls width="100" height="100%" />
            </div>
          )}
        </section>

        <button
          onClick={toggleOrderForm}
          className="flex justify-center items-center rounded-full bg-[#7613B5] text-white text-base font-semibold p-4 w-full mt-8 md:w-80 md:hidden"
        >
          Замовити зараз
        </button>

        {product?.attributes?.productDescriptions?.map(item => (
          <section key={item?.id} className="mt-8 md:mt-12">
            <h2 className="font-bold text-2xl md:text-5xl">{item?.title}</h2>
            <div className="grid md:grid-cols-2 gap-8 pt-8 md:gap-11 md:pt-10">
              {item?.productDescriptionsPost?.map(i => (
                <ProductOptionCard
                  key={i?.id ?? ''}
                  title={i?.title ?? ''}
                  text={i?.descriptions ?? ''}
                  image={i?.image?.data?.attributes as UploadFile}
                />
              ))}
            </div>
          </section>
        ))}

        <Reviews product={product as ProductEntity} id={query.id as string} />

        <section className="mt-8 md:mt-12">
          <div className="flex flex-row flex-wrap gap-4 sm:gap-10 justify-center mt-8 md:mt-20">
            <div className="flex flex-col items-center gap-3 w-40 text-center rounded-2xl p-8 bg-[#F4F3FD]">
              <Icon icon="CalendarDate" />
              <p className="font-semibold">Доставка 1-3 дні</p>
            </div>
            <div className="flex flex-col items-center gap-3 w-40 text-center rounded-2xl p-8 bg-[#F4F3FD]">
              <Icon icon="CreditCardShield" />
              <p className="font-semibold">Оплата при отриманні</p>
            </div>
            <div className="flex flex-col items-center gap-3 w-40 text-center rounded-2xl p-8 bg-[#F4F3FD]">
              <Icon icon="Scales" />
              <p className="font-semibold">Вигідна ціна</p>
            </div>
            <div className="flex flex-col items-center gap-3 w-40 text-center rounded-2xl p-8 bg-[#F4F3FD]">
              <Icon icon="ShieldTick" />
              <p className="font-semibold">Гарантія якості</p>
            </div>
          </div>
        </section>

        <button
          onClick={toggleOrderForm}
          className="flex justify-center items-center rounded-full bg-[#7613B5] text-white text-base font-semibold p-4 w-full mx-auto my-8 md:my-20 md:w-80"
        >
          Замовити зараз
        </button>

        <OrderForm
          productData={product}
          productId={query.id as string}
          isOpen={isOpen}
          toggleForm={toggleOrderForm}
        />
      </ComponentContainer>
    </MainLayout>
  );
}
