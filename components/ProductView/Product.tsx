import { cx } from "@emotion/css"
import { Tooltip } from "@mui/material"
import clsx from "clsx"
import { DateTime } from "luxon"
import React from "react"
import styles from "../../components/ProductView/Product.module.css"
import { formatPrice, formatUom, getUpdatedAt, splitPrice } from "../../functions/products"
import { insertNbspIntoName } from "../../functions/utils"
import { PriceHistoryModel, ProductPriceModel, ProductWithPriceModel, ShopType } from "../../models/Product"
import { ShopLogo } from "../Logos"
import { getShopName } from "../shops"
import { ProductHistoryGraph } from "./ProductHistoryGraph"

const locale = "ru"

const ProductImage: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="h-48 w-64 mx-auto flex justify-center items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="max-w-full max-h-full" src={url} alt="Photo" />
    </div>
  )
}
const BigPrice: React.FC<{ isMulti: boolean; price: number }> = ({ isMulti, price }) => {
  const [priceWhole, priceDecimal] = splitPrice(price)
  return (
    <span>
      {isMulti && "от "}
      <span className="text-2xl">
        {priceWhole}
        <span className="text-xs align-super ml-0.5">
          {priceDecimal}
        </span>
      </span>
    </span>
  )
}

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-xl mt-4 mb-2">{children}</h2>
}

const ProductPrice: React.FC<{
  price: ProductPriceModel
  shopType: ShopType
  uom: string
}> = ({ price, shopType, uom }) => {
  if (!price) {
    return <></>
  }
  const isDiscount = price.price !== price.basePrice
  const {
    isOutdated,
    dateString,
  } = getUpdatedAt(price.time)
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
        {isDiscount
          && (
            <span className={cx(styles.priceSecondary, "text-secondary")}>
              {price.offerValidUntil && (
                <span>
                  по {DateTime.fromISO(price.offerValidUntil).setLocale(locale).toFormat("d MMM")} • {" "}
                </span>
              )}
              <span className="line-through">{Number(price.basePrice).toFixed(2)}₽</span>
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

type PriceHistoryProps = { isLoading: boolean; history: PriceHistoryModel | null }

const ProductHistory: React.FC<PriceHistoryProps> = ({ isLoading, history }) => {
  if (isLoading || !history) {
    return <div>Загрузка…</div>
  }
  return <ProductHistoryGraph history={history} />
}

export const Product: React.FC<{ product: ProductWithPriceModel; priceHistory: PriceHistoryProps }> = (
  { product, priceHistory },
) => {
  const uom = formatUom(product)
  return (
    <div>
      {product.photoUrl && <ProductImage url={product.photoUrl} />}
      <div className="mb-12">
        <h1 className={clsx("mt-4 text-2xl mb-2 leading-7")}>
          {insertNbspIntoName(product.name)}
        </h1>
        {product.ean && <p className="text-secondary">Арт. {product.ean}</p>}
      </div>

      <Subtitle>Цены в магазинах</Subtitle>
      <div className={clsx(styles.prices)}>
        {product.shops.map((price, index) => (
          <ProductPrice key={index} price={price} shopType={price.shopType} uom={uom} />
        ))}
      </div>
      <Subtitle>История цен</Subtitle>
      <ProductHistory isLoading={priceHistory.isLoading} history={priceHistory.history} />
    </div>
  )
}
