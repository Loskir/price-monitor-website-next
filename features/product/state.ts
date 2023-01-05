import { combine, createEffect, createEvent, createStore, forward, sample } from "effector"
import { Controller, createRequestFx } from "fry-fx"
import { PageContext } from "nextjs-effector"
import { getProductById, getProductHistoryById } from "../../api"
import { isNotNull } from "../../functions/utils"
import { PriceHistoryModel, ProductWithPriceModel } from "../../models/Product"

export const $productId = createStore<string | null>(null)

export const productPageLoaded = createEvent<PageContext>()

const productIdChanged = createEvent<string | null>()

sample({
  source: productPageLoaded,
  fn: (ctx) => ctx.params.id as string,
  target: productIdChanged,
})

sample({
  source: productIdChanged,
  target: $productId,
})

const productIdChangedNotNull = productIdChanged.filter({ fn: isNotNull })

// load product
const $product = createStore<ProductWithPriceModel | null>(null)

const loadProductFx = createEffect<string, ProductWithPriceModel | null, Error>({
  name: "loadProductFx",
  sid: "loadProductFx",
  handler: async (productId, controller?: Controller) => {
    return getProductById(productId, controller?.getSignal())
  },
})

sample({
  source: productIdChangedNotNull,
  target: loadProductFx,
})

forward({
  from: loadProductFx.doneData,
  to: $product,
})

const $productState = combine({
  isLoading: loadProductFx.pending,
  product: $product,
})

// load history
const $productHistory = createStore<PriceHistoryModel | null>(null)

const loadProductHistoryFx = createRequestFx<string, PriceHistoryModel | null, Error>({
  name: "loadProductHistoryFx",
  handler: async (productId, controller?: Controller) => {
    return getProductHistoryById(productId, controller?.getSignal())
  },
})

sample({
  source: productIdChangedNotNull,
  target: loadProductHistoryFx,
})

forward({
  from: loadProductHistoryFx.doneData,
  to: $productHistory,
})

const $productHistoryState = combine({
  isLoading: loadProductFx.pending,
  history: $productHistory,
})

export { $product, $productHistoryState, $productState }
