import { cx } from "@emotion/css"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Tooltip } from "@mui/material"
import clsx from "clsx"
import { DateTime } from "luxon"
import Carousel from "nuka-carousel"
import React from "react"
import styles from "../../components/ProductView/Product.module.css"
import { formatPrice, formatUom, getUpdatedAt } from "../../functions/products"
import { getShopName } from "../../functions/shops"
import { createArray, insertNbspIntoName } from "../../functions/utils"
import { PriceHistoryModel, ProductPriceModel, ProductWithPriceModel } from "../../models/Product"
import { BigPrice } from "../BigPrice/BigPrice"
import { H1 } from "../Header/Header"
import { Island } from "../Island/Island"
import { ShopLogo } from "../ShopLogo/ShopLogo"
import { BaseSkeleton } from "../Skeletons/BaseSkeleton"
import { ProductHistoryGraph, ProductItemPriceHistorySkeleton } from "./ProductHistoryGraph"

const locale = "ru"

const ProductImageCarousel: React.FC<{ urls: string[] }> = ({ urls }) => {
  return (
    <Carousel
      wrapAround
      dragging
      defaultControlsConfig={{
        pagingDotsClassName: "mx-1",
      }}
      renderCenterLeftControls={({ previousSlide }) => <ArrowBackIosIcon onClick={previousSlide} />}
      renderCenterRightControls={({ nextSlide }) => <ArrowForwardIosIcon onClick={nextSlide} />}
      className={cx(styles.carousel)}
    >
      {urls.map((url, index) => (
        <img
          className="m-auto h-full pb-8"
          src={url}
          alt={`Photo-${index + 1}`}
          key={url}
        />
      ))}
    </Carousel>
  )
}

const ProductPhotos: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  if (product.photoUrls && product.photoUrls.length > 1) {
    return <ProductImageCarousel urls={product.photoUrls} />
  }
  if (product.photoUrls && product.photoUrls.length > 0) {
    return (
      <div className={"h-64 w-64 mx-auto flex justify-center items-center"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="max-w-full max-h-full" src={product.photoUrls[0]} alt="Photo" />
      </div>
    )
  }
  if (product.photoUrl) {
    return (
      <div className={"h-64 w-64 mx-auto flex justify-center items-center"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="max-w-full max-h-full" src={product.photoUrl} alt="Photo" />
      </div>
    )
  }
  return <></>
}

const ProductPrice: React.FC<{
  price: ProductPriceModel
  shopType: string
  uom: string
}> = ({ price, shopType, uom }) => {
  if (!price) {
    return <></>
  }
  const isDiscount = price.price !== price.basePrice
  const { isOutdated, dateString } = getUpdatedAt(price.time)
  return (
    <div className="flex flex-row items-center py-4 flex-wrap gap-4">
      <ShopLogo shopType={shopType} className={styles.shopIcon} />
      <div className="flex flex-col mr-4">
        <span className={styles.shopName}>{getShopName(shopType)}</span>
        {/*<span className={clsx(styles.shopSubtitle, styles.decreasedLineHeight)}>10 часов назад</span>*/}
        {price.unitPrice && (
          <span className={"text-xs text-secondary"}>
            {formatPrice(price.unitPrice)} ₽ за {uom}
          </span>
        )}
      </div>
      <div className="flex flex-col ml-auto items-end">
        {isDiscount && (
          <span className={cx(styles.priceSecondary, "text-secondary")}>
            {price.offerValidUntil && (
              <span>
                по {DateTime.fromISO(price.offerValidUntil)
                  .setLocale(locale)
                  .toFormat("d MMM")} •{" "}
              </span>
            )}
            <span className="line-through">
              {Number(price.basePrice).toFixed(2)}₽
            </span>
          </span>
        )}
        <Tooltip
          title={dateString}
          arrow
          disableFocusListener
          enterTouchDelay={250}
          placement="left"
        >
          <span>
            <BigPrice isMulti={false} price={price.price} />
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

type PriceHistoryProps = {
  isLoading: boolean
  history: PriceHistoryModel | null
}

const ProductHistory: React.FC<PriceHistoryProps> = ({
  isLoading,
  history,
}) => {
  if (isLoading || !history) {
    return <ProductItemPriceHistorySkeleton />
  }
  return <ProductHistoryGraph history={history} />
}

export const Product: React.FC<{
  product: ProductWithPriceModel
  priceHistory: PriceHistoryProps
}> = ({ product, priceHistory }) => {
  const uom = formatUom(product)
  return (
    <div>
      <Island className={"py-4 mb-4"}>
        <ProductPhotos product={product} />
        <div>
          <h1 className={clsx("mt-4 text-xl mb-2 leading-6 font-medium")}>
            {insertNbspIntoName(product.name)}
          </h1>
          {product.eans && product.eans.length > 0 && (
            <p className="text-secondary text-sm">Арт. {product.eans.join(", ")}</p>
          )}
        </div>
      </Island>

      <Island className={"pt-4 mb-4"}>
        <H1>Цены в магазинах</H1>
        <div className={clsx(styles.prices)}>
          {product.shops.map((price, index) => (
            <ProductPrice
              key={index}
              price={price}
              shopType={price.shopType}
              uom={uom}
            />
          ))}
        </div>
      </Island>
      <Island className={"py-4"}>
        <H1>История цен</H1>
        <ProductHistory
          isLoading={priceHistory.isLoading}
          history={priceHistory.history}
        />
      </Island>
    </div>
  )
}

export const ProductSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Island className={"py-4 mb-4"}>
        <div className="h-64 w-64 mx-auto flex justify-center items-center">
          <BaseSkeleton className="w-full h-full" />
        </div>
        <div>
          <BaseSkeleton className="mt-4 h-7 mb-1 w-full" />
          <BaseSkeleton className="h-5 w-40" />
        </div>
      </Island>

      <Island className={"pt-4 mb-4"}>
        <H1>Цены в магазинах</H1>
        <div>
          {createArray(4).map((_, index) => (
            <div
              className="h-[71px] flex flex-row items-center py-4 flex-wrap border-b border-solid border-gray-100 last:border-none"
              key={index}
            >
              <BaseSkeleton className="h-8 mr-4 w-14 sm:w-16" />
              <div className="flex flex-col mr-4 w-1/2">
                <BaseSkeleton className={"h-4 w-16 mb-1"} />
                <BaseSkeleton className={"h-4 w-24"} />
              </div>
              <div className="flex flex-col ml-auto items-end w-12">
                <BaseSkeleton className={"h-8 w-full"} />
              </div>
            </div>
          ))}
        </div>
      </Island>
      <Island className={"py-4"}>
        <H1>История цен</H1>
        <ProductItemPriceHistorySkeleton />
      </Island>
    </div>
  )
}
