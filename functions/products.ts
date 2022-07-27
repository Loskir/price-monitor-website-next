import { type ProductWithPriceModel, UomType } from "../models/Product"

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
