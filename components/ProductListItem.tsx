import { css, cx } from "@emotion/css"
import { Tooltip } from "@mui/material"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatUom, getUpdatedAt, splitPrice } from "../functions/products"
import { insertNbspIntoName } from "../functions/utils"
import { ProductPriceModel, ProductWithPriceModel } from "../models/Product"
import { ShopLogo } from "./Logos"
import styles from "./ProductListItem.module.css"

const ShopPriceRow: React.FC<{ price: ProductPriceModel; shopType: string; uom: string }> = (
  { price, shopType, uom },
) => {
  const isDiscount = price.price !== price.basePrice
  const [priceWhole, priceDecimal] = splitPrice(price.price)
  const { isOutdated, dateString } = getUpdatedAt(price.time)
  return (
    <div className="flex items-start flex-col text-sm font-medium">
      <ShopLogo shopType={shopType} className="h-6 w-12 mb-0.5" />
      <Tooltip
        title={dateString}
        arrow
        disableFocusListener
        enterTouchDelay={250}
        placement="right"
      >
        <span
          className={cx(
            "font-semibold leading-tight cursor-default z-10 p-0.5 -mx-0.5 rounded",
            isDiscount && !isOutdated && "bg-green-100",
            isOutdated && "text-gray-400",
          )}
        >
          <span className="">{priceWhole}</span>
          <span className="align-text-top" style={{ fontSize: "0.7em" }}>{priceDecimal}</span>
        </span>
      </Tooltip>
      {/*{isDiscount && <span className="line-through leading-tight text-gray-500">{price.basePrice}₽</span>}*/}
      {/*{price.unitPrice && (*/}
      {/*  <span className="ml-1 leading-tight text-gray-500 text-right ml-auto">*/}
      {/*    {price.unitPrice.toFixed(2)}₽/{uom}*/}
      {/*  </span>*/}
      {/*)}*/}
    </div>
  )
}

export const ProductListItem: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const uom = formatUom(product)
  return (
    <div
      className={cx(
        "flex flex-row justify-start relative items-stretch",
        css`min-height: 5rem;
          @media (min-width: 640px) {min-height: 6rem}`,
        styles.productListItem,
      )}
    >
      {product.photoUrl && (
        <div className={"relative flex-shrink-0 flex-grow-0 w-20 sm:w-24 mr-4"}>
          <img
            className={clsx(
              "absolute inset-0 max-h-full m-auto py-2",
              styles.image,
            )}
            src={product.photoUrl}
            alt="Photo"
          />
        </div>
      )}
      <div className="flex flex-col justify-center py-2 border-b border-gray-100 border-solid flex-grow">
        <h1 className="font-semibold leading-tight mb-2">
          <Link href={`/product/${product.productId}`}>
            <a className={styles.link}>
              {insertNbspIntoName(product.name)}
            </a>
          </Link>
        </h1>
        <div className="flex flex-row gap-4">
          {product.shops.map((shop) => (
            <ShopPriceRow price={shop} shopType={shop.shopType} uom={uom} key={shop.shopType} />
          ))}
        </div>
      </div>
    </div>
  )
}
