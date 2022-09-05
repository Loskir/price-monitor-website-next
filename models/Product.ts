export enum UomType {
  kg = "kg",
  l = "l",
  none = "none",
}

export interface ProductModel {
  productId: string
  name: string
  photoUrl?: string
  ean?: string
  uomType?: UomType
  uom?: string
  volume?: number
}
export interface ProductWithPriceModel extends ProductModel {
  price?: ProductPriceModel & {
    unitPrice?: number
  }
}

export interface ProductPriceModel {
  price: number | string // fixme
  basePrice: number | string // fixme
  offerValidUntil?: string
  time: string
}

export type ShopType = "lenta" | "globus"
