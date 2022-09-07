import { combine, createEvent, createStore, domain, forward } from "effector-next"
import { useUnit } from "effector-react"
import { Controller, createRequestFx } from "fry-fx"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { getProductByEan } from "../../../api"
import { CenteredOverlay } from "../../../components/CenteredOverlay"
import { ProductWithPriceModel } from "../../../models/Product"

const eanChanged = createEvent<string>()

const getProductByEanFx = createRequestFx<string, ProductWithPriceModel | null, Error>({
  name: "getProductByEanFx",
  domain,
  handler: async (ean, controller?: Controller) => {
    return getProductByEan(ean, controller?.getSignal())
  },
})

const $product = createStore<ProductWithPriceModel | null>(null)

forward({
  from: eanChanged,
  to: getProductByEanFx,
})

forward({
  from: getProductByEanFx.doneData,
  to: $product,
})

const $isLoading = getProductByEanFx.pending

const $state = combine({
  isLoading: $isLoading,
  product: $product,
})

const productIdReceived = createEvent<string>()

$product.watch((product) => {
  console.log("watch", product)
  if (product?.productId) {
    return productIdReceived(product.productId)
  }
})

const ProductView: NextPage = () => {
  const router = useRouter()
  const eanChangedL = useUnit(eanChanged)
  const state = useUnit($state)

  productIdReceived.watch((productId) => {
    return router.replace(`/product/${productId}`)
  })

  useEffect(() => {
    $product.reset()
    const ean = router.query.ean?.toString()
    if (router.isReady && ean) {
      eanChangedL(ean)
    }
  }, [eanChangedL, router])
  // state.product → redirecting
  if (state.isLoading || state.product) {
    return <CenteredOverlay>Loading...</CenteredOverlay>
  }
  return <CenteredOverlay>Not found :(</CenteredOverlay>
}

export default ProductView
