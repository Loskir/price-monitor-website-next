import { combine, createEvent, createStore, domain, forward } from "effector-next"
import { createGate, useEvent, useGate, useStore } from "effector-react"
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

const ProductView: NextPage = () => {
  const router = useRouter()
  const eanChangedL = useEvent(eanChanged)
  const state = useStore($state)

  useEffect(() => {
    const ean = router.query.ean?.toString()
    if (router.isReady && ean) {
      eanChangedL(ean)
    }
  }, [router])
  useEffect(() => {
    if (state.product) {
      router.replace(`/product/${state.product.productId}`)
    }
  }, [state])
  // state.product → redirecting
  if (state.isLoading || state.product) {
    return <CenteredOverlay>Loading...</CenteredOverlay>
  }
  return <CenteredOverlay>Not found :(</CenteredOverlay>
}

export default ProductView
