import { ProductWithPriceModel } from "../models/Product"

export const parseSlug = (id: string): string => {
  const match = id.match(/^(?:.+_)?(.+)$/i)
  if (!match) return id
  return match[1]
}

export const generateSlug = (product: ProductWithPriceModel) => {
  if (!product.slug) return product.productId
  return `${product.slug}_${product.productId}`
}
