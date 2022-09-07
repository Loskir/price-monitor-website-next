import { combine, createEvent, createStore, domain, forward, sample } from "effector-next"
import { createGate } from "effector-react"
import { Controller, createRequestFx } from "fry-fx"
import { getProductById, getProductHistoryById } from "../../api"
import { isNotNull } from "../../functions/utils"
import { PriceHistoryModel, ProductWithPriceModel } from "../../models/Product"

const ProductGate = createGate<{
  productId: string | null
  routerReady: boolean
}>({
  defaultState: { productId: null, routerReady: false },
})
const $productId = ProductGate.state.map((v) => v.productId)
const $routerReady = ProductGate.state.map((v) => v.routerReady)

const productIdChanged = createEvent<string | null>()

sample({
  source: {
    isMounted: ProductGate.status,
    routerReady: $routerReady,
    productId: $productId,
  },
  clock: [
    $productId,
    ProductGate.open,
  ],
  filter: ({ isMounted, routerReady }) => isMounted && routerReady,
  fn: ({ productId }) => productId,
  target: productIdChanged,
})

const productIdChangedNotNull = productIdChanged.filter({ fn: isNotNull })

// load product
const $product = createStore<ProductWithPriceModel | null>(null)

const loadProductFx = createRequestFx<string, ProductWithPriceModel | null, Error>({
  name: "loadProductFx",
  domain,
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
  domain,
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

$product.reset(ProductGate.close)
$productHistory.reset(ProductGate.close)

export { $productHistoryState, $productState, ProductGate }
