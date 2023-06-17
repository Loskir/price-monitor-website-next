import type { CategoryModel } from "./models/Category"
import { PriceHistoryModel, SearchResponseModel } from "./models/Product"
import type { ProductWithPriceModel } from "./models/Product"

const apiRoot = process.env.NEXT_PUBLIC_API_ROOT ?? ""

export enum SortType {
  name = "name",
  price = "price",
  unitPrice = "unitPrice",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

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

export function getProductHistoryById(id: string, signal?: AbortSignal): Promise<PriceHistoryModel | null> {
  return fetch(`${apiRoot}/products/${id}/history`, { signal })
    .then(async (res) => {
      if (res.status === 404) {
        return null
      }
      if (res.status > 400) {
        throw new Error() // todo
      }
      return PriceHistoryModel.parse(await res.json())
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

export function searchProducts(
  {
    query,
    offset = 0,
    sort,
    sortOrder,
  }: {
    query: string
    offset?: number
    sort?: SortType
    sortOrder?: SortOrder
  },
  signal?: AbortSignal,
): Promise<SearchResponseModel> {
  const limit = 50
  const queryString = new URLSearchParams({
    query,
    offset: offset.toString(),
    limit: limit.toString(),
  })
  if (sort) queryString.set("sort", sort)
  if (sortOrder) queryString.set("sortOrder", sortOrder)
  return fetch(`${apiRoot}/v2/products/search?${queryString}`, { signal })
    .then(async (res) => {
      if (res.status > 400) {
        throw new Error() // todo
      }
      return await res.json() as SearchResponseModel
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
