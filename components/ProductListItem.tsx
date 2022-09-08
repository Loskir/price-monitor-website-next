import { css, cx } from "@emotion/css"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatUom, splitPrice } from "../functions/products"
import { ProductPriceModel, ProductWithPriceModel, ShopType } from "../models/Product"
import styles from "./ProductListItem.module.css"
import { ShopIcon } from "./shops"

const ShopPriceRow: React.FC<{ price: ProductPriceModel; shopType: ShopType; uom: string }> = (
  { price, shopType, uom },
) => {
  const isDiscount = price.price !== price.basePrice
  const [priceWhole, priceDecimal] = splitPrice(price.price)
  return (
    <div className="flex items-baseline text-sm font-medium flex-wrap gap-x-2">
      <ShopIcon shopType={shopType} className="w-8 self-center" />
      <span className="font-bold text-xl leading-tight">
        <span className="">{priceWhole}</span>
        <span className="text-sm align-text-top">{priceDecimal}</span>
      </span>
      {isDiscount && <span className="line-through leading-tight text-gray-500">{price.basePrice}₽</span>}
      {price.unitPrice && (
        <span className="ml-1 leading-tight text-gray-500 text-right ml-auto">
          {price.unitPrice.toFixed(2)}₽/{uom}
        </span>
      )}
    </div>
  )
}

export const ProductListItem: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const uom = formatUom(product)
  return (
    <div className="flex flex-col">
      <div
        className={cx(
          "flex flex-row justify-start relative items-stretch",
          css`min-height: 5rem;
          @media (min-width: 640px) {min-height: 6rem}`,
        )}
      >
        {product.photoUrl && (
          <div className={"relative flex-shrink-0 flex-grow-0 w-20 sm:w-24 mr-4"}>
            <img
              className={clsx(
                "absolute inset-0 w-full max-h-full m-auto py-2",
                styles.image,
              )}
              src={product.photoUrl}
              alt="Photo"
            />
          </div>
        )}
        <div className="flex flex-col justify-center py-2 border-b border-gray-100 border-solid flex-grow">
          <h1 className="font-semibold leading-tight mb-1">
            <Link href={`/product/${product.productId}`}>
              <a className={styles.link}>
                {product.name}
              </a>
            </Link>
          </h1>
          {product.shops.map((shop) => (
            <ShopPriceRow price={shop} shopType={shop.shopType} uom={uom} key={shop.shopType} />
          ))}
          {product.price && <ShopPriceRow price={product.price} shopType={"globus"} uom={uom} />}
        </div>
      </div>
    </div>
  )
}
