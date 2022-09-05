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
    offerValidUntil?: string
  }
}

export interface ProductPriceModel {
  price: number | string // fixme
  basePrice: number | string // fixme
  time: string
}

export type ShopType = "lenta" | "globus"
