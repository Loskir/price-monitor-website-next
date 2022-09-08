import { type ProductWithPriceModel, UomType } from "../models/Product"

export const splitPrice = (price: number) => {
  const priceWhole = Math.floor(price)
  const priceDecimal = (price - priceWhole).toFixed(2).slice(2)
  return [priceWhole.toString(), priceDecimal]
}

export function formatUom(product: ProductWithPriceModel) {
  switch (product.uomType) {
    case UomType.kg:
      return "кг"
    case UomType.l:
      return "л"
    default:
      return product.uom || "шт"
  }
}
