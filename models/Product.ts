export enum UomType {
  kg = 'kg',
  l = 'l',
  none = 'none',
}

export interface Offer {

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
    unitPrice: number
  }
}

export interface ProductPriceModel {
  price: number
  basePrice: number
  offer?: Offer
  time: string
}
