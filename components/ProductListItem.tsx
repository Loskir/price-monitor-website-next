import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { formatUom } from "../functions/products"
import { ProductWithPriceModel } from "../models/Product"
import styles from "./ProductListItem.module.css"

export const ProductListItem: React.FC<{ product: ProductWithPriceModel }> = ({ product }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-start relative items-stretch">
        {product.photoUrl && (
          <img
            className={clsx("h-24 w-24 mr-4 p-2 flex-shrink-0 flex-grow-0", styles.image)}
            src={product.photoUrl}
            alt="Photo"
          />
        )}
        <div className="flex flex-col justify-center py-2 border-b border-gray-300 border-solid flex-grow">
          <h1 className="text-gray-800 font-medium leading-tight">
            <Link href={`/product/${product.productId}`}>
              <a className={styles.link}>
                {product.name}
              </a>
            </Link>
          </h1>
          {product.price && (
            <h2 className="mt-1 text-md">
              {product.price.price !== product.price.basePrice
                ? (
                  <>
                    <span className="font-semibold text-green-600 text-lg">{product.price.price}₽</span>
                    <span className="line-through ml-1">{product.price.basePrice}₽</span>
                  </>
                )
                : <span className="font-semibold text-xl">{product.price.price}₽</span>}
              <span className="ml-2">{product.price?.unitPrice.toFixed(2)}₽/{formatUom(product)}</span>
            </h2>
          )}
        </div>
      </div>
    </div>
  )
}
