export enum UomType {
  kg = "kg",
  l = "l",
  none = "none",
}

export interface PriceHistoryPriceModel {
  price: number | string // fixme
  basePrice: number | string // fixme
  time: string
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

export interface ProductPriceModel extends PriceHistoryPriceModel {
  unitPrice?: number
  offerValidUntil?: string
}
export interface ProductPriceEntry extends ProductPriceModel {
  shopType: ShopType
}

export interface ProductWithPriceModel extends ProductModel {
  price?: ProductPriceModel
  prices: ProductPriceEntry[]
}

export type ShopType = "lenta" | "globus"
