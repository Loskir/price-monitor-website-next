const apiRoot = process.env.NEXT_PUBLIC_API_ROOT
import type { CategoryModel } from "./models/Category"
import type { PriceHistoryPriceModel, ProductWithPriceModel } from "./models/Product"

export function getProductById(id: string, signal?: AbortSignal): Promise<ProductWithPriceModel | null> {
  return fetch(`${apiRoot}/products/${id}`, { signal })
    .then(async (res) => {
      if (res.status === 404) {
        return null
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel
    })
}

export function getProductHistoryById(id: string, signal?: AbortSignal): Promise<PriceHistoryPriceModel[]> {
  return fetch(`${apiRoot}/product/${id}/history`, { signal })
    .then(async (res) => {
      if (res.status === 404) {
        return []
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as PriceHistoryPriceModel[]
    })
}

export function getProductByEan(ean: string, signal?: AbortSignal): Promise<ProductWithPriceModel | null> {
  return fetch(`${apiRoot}/product/ean/${ean}`, { signal })
    .then(async (res) => {
      if (res.status === 404) {
        return null
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel
    })
}

export function searchProducts(query: string): Promise<ProductWithPriceModel[]> {
  const queryString = new URLSearchParams({
    query,
  })
  return fetch(`${apiRoot}/products/search?${queryString}`)
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel[]
    })
}

export function getCategories(parentId: number | null, signal?: AbortSignal): Promise<CategoryModel[]> {
  const params = parentId !== null
    ? new URLSearchParams({ parentId: parentId.toString() })
    : new URLSearchParams()
  return fetch(`${apiRoot}/categories?${params}`, { signal })
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as CategoryModel[]
    })
}

export enum SortType {
  name = "name",
  price = "price",
  unitPrice = "unitPrice",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export function getProductsByCategory(categoryId: number, {
  sortType,
  sortOrder,
  limit,
  signal,
}: {
  sortType?: SortType
  sortOrder?: SortOrder
  limit?: number
  signal?: AbortSignal
} = {}): Promise<ProductWithPriceModel[]> {
  const params = new URLSearchParams()
  if (sortType) params.append("sort", sortType)
  if (sortOrder) params.append("sortOrder", sortOrder)
  if (limit) params.append("limit", limit.toString())
  return fetch(`${apiRoot}/categories/${categoryId}/products?${params}`, { signal })
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as ProductWithPriceModel[]
    })
}
