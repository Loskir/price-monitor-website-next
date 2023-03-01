import { cx } from "@emotion/css"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatPrice, formatUom, splitPrice } from "../functions/products"
import { insertNbspIntoName } from "../functions/utils"
import { ProductWithPriceModel } from "../models/Product"
import { ShopLogo } from "./Logos"
import styles from "./ProductListItemNew.module.css"

const BigPrice: React.FC<{ isMulti?: boolean; price: number }> = ({ isMulti = false, price }) => {
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

export const ProductListItemNew: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  const uom = formatUom(product)
  return (
    <div className={cx("pl-4 pt-4 relative", styles.productListItem)}>
      <div className="flex mb-4">
        <div className="mr-4 rounded-2xl w-16 h-16 shrink-0 relative">
          {product.photoUrl && (
            <img
              className={clsx(
                "absolute inset-0 max-h-full m-auto",
                styles.image,
              )}
              src={product.photoUrl}
              alt="Photo"
            />
          )}
        </div>
        <div className="grow min-h-16">
          <div className="mr-4">
            <Link href={`/product/${product.productId}`}>
              <a className={cx("inline-block", styles.title, styles.link)}>{insertNbspIntoName(product.name)}</a>
            </Link>
            {/*<div className="mt-3">*/}
            {/*  {product.shops.map((price) => (*/}
            {/*    <div className="mt-3" key={price.shopType}>*/}
            {/*      <div className="flex">*/}
            {/*        <div className="">*/}
            {/*          <BigPrice price={price.price} />*/}
            {/*          <div className="mt-1 flex flex-wrap justify-end text-secondary text-xs">*/}
            {/*            {price.unitPrice && (*/}
            {/*              <span>*/}
            {/*                {formatPrice(price.unitPrice)} ₽ за {uom}*/}
            {/*              </span>*/}
            {/*            )}*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*        <div className="grow" />*/}
            {/*        <ShopLogo shopType={price.shopType} className="h-8" monochrome />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  ))}*/}
            {/*</div>*/}
            {/*<div className="mt-3">*/}
            {/*  {product.shops.map((price) => (*/}
            {/*    <div className="mt-1" key={price.shopType}>*/}
            {/*      <div className="flex items-center">*/}
            {/*        <div className="mr-4">*/}
            {/*          <BigPrice price={price.price} />*/}
            {/*        </div>*/}
            {/*        <div className="mt-1 flex flex-wrap justify-end text-secondary text-xs">*/}
            {/*          {price.unitPrice && (*/}
            {/*            <span>*/}
            {/*              {formatPrice(price.unitPrice)} ₽ за {uom}*/}
            {/*            </span>*/}
            {/*          )}*/}
            {/*        </div>*/}

            {/*        <div className="grow" />*/}
            {/*        <ShopLogo shopType={price.shopType} className="h-8" monochrome />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  ))}*/}
            {/*</div>*/}
            {product.shops.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center">
                  <BigPrice isMulti={product.shops.length > 1} price={product.shops[0].price} />
                  <div className="grow" />
                  <ShopLogo shopType={product.shops[0].shopType} className="h-8" monochrome />
                </div>
                <div className="flex flex-wrap justify-end text-secondary text-xs">
                  {product.shops[0].unitPrice && (
                    <span className="mt-4">
                      {product.shops.length > 1 && "от "}
                      {formatPrice(product.shops[0].unitPrice)} ₽ за {uom}
                    </span>
                  )}
                  <div className="grow" />
                  {product.eans && product.eans.length > 0 && (
                    <span className="mt-4">Арт. {product.eans.join(", ")}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={cx("ml-20", styles.divider)} />
    </div>
  )
}
