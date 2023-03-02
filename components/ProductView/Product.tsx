import { cx } from "@emotion/css"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { Tooltip } from "@mui/material"
import clsx from "clsx"
import { DateTime } from "luxon"
import Carousel from "nuka-carousel"
import React from "react"
import styles from "../../components/ProductView/Product.module.css"
import { formatPrice, formatUom, getUpdatedAt, splitPrice } from "../../functions/products"
import { getShopName } from "../../functions/shops"
import { insertNbspIntoName } from "../../functions/utils"
import { PriceHistoryModel, ProductPriceModel, ProductWithPriceModel } from "../../models/Product"
import { ShopLogo } from "../Logos"
import { ProductItemPriceHistorySkeleton } from "../Skeletons/ProductItemSkeleton"
import { ProductHistoryGraph } from "./ProductHistoryGraph"

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
  if (product.photoUrls) {
    return <ProductImageCarousel urls={product.photoUrls} />
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

const BigPrice: React.FC<{ isMulti: boolean; price: number }> = ({
  isMulti,
  price,
}) => {
  const [priceWhole, priceDecimal] = splitPrice(price)
  return (
    <span>
      {isMulti && "от "}
      <span className="text-2xl">
        {priceWhole}
        <span className="text-xs align-super ml-0.5">{priceDecimal}</span>
      </span>
    </span>
  )
}

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-xl mt-4 mb-2">{children}</h2>
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
    <div className="flex flex-row items-center py-4 flex-wrap">
      <ShopLogo shopType={shopType} className={styles.shopIcon} />
      <div className="flex flex-col mr-4">
        <span className={styles.shopName}>{getShopName(shopType)}</span>
        {/*<span className={clsx(styles.shopSubtitle, styles.decreasedLineHeight)}>10 часов назад</span>*/}
        {price.unitPrice && (
          <span className={cx(styles.shopSubtitle, "text-secondary")}>
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
      <ProductPhotos product={product} />
      <div className="mb-12">
        <h1 className={clsx("mt-4 text-2xl mb-2 leading-7")}>
          {insertNbspIntoName(product.name)}
        </h1>
        {product.eans && product.eans.length > 0 && <p className="text-secondary">Арт. {product.eans.join(", ")}</p>}
      </div>

      <Subtitle>Цены в магазинах</Subtitle>
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
      <Subtitle>История цен</Subtitle>
      <ProductHistory
        isLoading={priceHistory.isLoading}
        history={priceHistory.history}
      />
    </div>
  )
}
